import { useEffect, useMemo, useState } from 'react';
import { createClient, type Session } from '@supabase/supabase-js';
import { products as staticProducts } from '../data/products';
import { Product } from '../types';

type AdminProduct = Product;

interface NewProductForm {
  name: string;
  description: string;
  price: string;
  inStock: boolean;
  images: string[];
}

const initialForm: NewProductForm = {
  name: '',
  description: '',
  price: '',
  inStock: true,
  images: [],
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const toFolderName = (name: string) => name.trim().replace(/\s+/g, ' ');
const publicImagePrefix = '/storage/v1/object/public/product-images/';

interface ProductRow {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[] | null;
  category: string;
  featured: boolean;
  in_stock: boolean;
}

interface ProductEditDraft {
  name: string;
  description: string;
  price: string;
  inStock: boolean;
}

const mapProductRow = (row: ProductRow): AdminProduct => ({
  id: row.id,
  name: row.name,
  price: Number(row.price || 0),
  description: row.description,
  images: Array.isArray(row.images) ? row.images : [],
  category: row.category,
  featured: Boolean(row.featured),
  inStock: Boolean(row.in_stock),
});

const getStoragePathFromPublicUrl = (url: string) => {
  const markerIndex = url.indexOf(publicImagePrefix);
  if (markerIndex === -1) return null;
  return url.slice(markerIndex + publicImagePrefix.length);
};

const getProductFolder = (product: Product) => {
  const firstImage = product.images[0];
  if (!firstImage) return toFolderName(product.name);

  const marker = '/product-images/';
  const markerIndex = firstImage.indexOf(marker);
  if (markerIndex === -1) return toFolderName(product.name);

  const pathAfterBucket = firstImage.slice(markerIndex + marker.length);
  const [folderName] = pathAfterBucket.split('/');

  return folderName ? decodeURIComponent(folderName) : toFolderName(product.name);
};

export function Admin() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [form, setForm] = useState<NewProductForm>(initialForm);
  const [message, setMessage] = useState('');
  const [folderImageUrls, setFolderImageUrls] = useState<string[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [isLoadingFolder, setIsLoadingFolder] = useState(false);
  const [existingFolderImages, setExistingFolderImages] = useState<Record<string, string[]>>({});
  const [existingLoading, setExistingLoading] = useState<Record<string, boolean>>({});
  const [existingUploading, setExistingUploading] = useState<Record<string, boolean>>({});
  const [productEdits, setProductEdits] = useState<Record<string, ProductEditDraft>>({});

  const newProductFolder = toFolderName(form.name);

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

  const verifyAdminSession = async (session: Session | null) => {
    if (!supabase || !session) {
      setIsUnlocked(false);
      return;
    }

    const { data, error } = await supabase.rpc('is_admin_user');
    if (error) {
      setIsUnlocked(false);
      setAuthMessage(`Admin check failed: ${error.message}`);
      return;
    }

    if (data === true) {
      setIsUnlocked(true);
      setAuthMessage('');
      return;
    }

    await supabase.auth.signOut();
    setIsUnlocked(false);
    setAuthMessage('This account is not authorized for admin access.');
  };

  useEffect(() => {
    const loadProducts = async () => {
      if (!supabase) {
        setProducts(staticProducts);
        return;
      }

      setIsLoadingProducts(true);
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, description, images, category, featured, in_stock')
        .order('created_at', { ascending: true });

      if (error) {
        setMessage(`Failed to load products: ${error.message}`);
        setProducts(staticProducts);
      } else {
        setProducts(((data || []) as ProductRow[]).map(mapProductRow));
      }

      setIsLoadingProducts(false);
    };

    if (isUnlocked) {
      loadProducts();
    }
  }, [isUnlocked]);

  useEffect(() => {
    setProductEdits((prev) => {
      const next: Record<string, ProductEditDraft> = {};
      for (const product of products) {
        next[product.id] = prev[product.id] || {
          name: product.name,
          description: product.description,
          price: String(product.price),
          inStock: product.inStock,
        };
      }
      return next;
    });
  }, [products]);

  useEffect(() => {
    const initializeAuth = async () => {
      if (!supabase) {
        setIsCheckingAuth(false);
        setAuthMessage('Supabase auth is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
        return;
      }

      const { data } = await supabase.auth.getSession();
      await verifyAdminSession(data.session);
      setIsCheckingAuth(false);
    };

    void initializeAuth();

    if (!supabase) return;

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      void verifyAdminSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.description.trim() || !form.price.trim() || form.images.length === 0) {
      setMessage('Title, description, price, and at least one image are required.');
      return;
    }

    const parsedPrice = Number(form.price);
    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      setMessage('Enter a valid non-negative price.');
      return;
    }

    if (!supabase) {
      setMessage('Supabase is not configured.');
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      in_stock: form.inStock,
      price: parsedPrice,
      images: form.images,
      category: 'totes',
      featured: false,
    };

    const { data, error } = await supabase
      .from('products')
      .insert(payload)
      .select('id, name, price, description, images, category, featured, in_stock')
      .single();

    if (error) {
      setMessage(`Failed to add product: ${error.message}`);
      return;
    }

    if (data) {
      setProducts((prev) => [...prev, mapProductRow(data as ProductRow)]);
    }

    setForm(initialForm);
    setFolderImageUrls([]);
    setMessage('Product saved to Supabase.');
  };

  const handleUploadImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!supabase) {
      setMessage('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      return;
    }

    const targetFolder = (newProductFolder || `new-product-${Date.now()}`).trim();

    if (!newProductFolder) {
      setMessage('Enter product title first. New folder name is based on title.');
      return;
    }

    setIsUploadingImages(true);
    setMessage('');

    try {
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        const filePath = `${targetFolder}/${Date.now()}-${file.name}`;
        const { error } = await supabase.storage
          .from('product-images')
          .upload(filePath, file, { upsert: false });

        if (error) {
          setMessage(`Image upload failed for ${file.name}: ${error.message}`);
          continue;
        }

        const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
        uploadedUrls.push(data.publicUrl);
      }

      if (uploadedUrls.length > 0) {
        setForm((prev) => ({
          ...prev,
          images: Array.from(new Set([...prev.images, ...uploadedUrls])),
        }));
        setMessage('Image upload successful.');
      }
    } finally {
      setIsUploadingImages(false);
      e.target.value = '';
    }
  };

  const handleLoadFolderImages = async () => {
    if (!supabase) {
      setMessage('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      return;
    }

    const targetFolder = newProductFolder.trim();
    if (!targetFolder) {
      setMessage('Enter product title first.');
      return;
    }

    setIsLoadingFolder(true);
    setMessage('');

    try {
      const { data, error } = await supabase.storage
        .from('product-images')
        .list(targetFolder, { limit: 200, sortBy: { column: 'name', order: 'asc' } });

      if (error) {
        setMessage(`Could not load folder images: ${error.message}`);
        return;
      }

      const urls = (data || [])
        .filter((item) => item.name && !item.name.endsWith('/'))
        .map((item) => {
          const fullPath = `${targetFolder}/${item.name}`;
          const { data: publicUrl } = supabase.storage.from('product-images').getPublicUrl(fullPath);
          return publicUrl.publicUrl;
        });

      setFolderImageUrls(urls);
      if (urls.length === 0) {
        setMessage('No images found in this folder.');
      }
    } finally {
      setIsLoadingFolder(false);
    }
  };

  const toggleSelectedImage = (url: string) => {
    setForm((prev) => {
      const exists = prev.images.includes(url);
      return {
        ...prev,
        images: exists ? prev.images.filter((img) => img !== url) : [...prev.images, url],
      };
    });
  };

  const updateProductImages = (productId: string, nextImages: string[]) => {
    setProducts((prev) =>
      prev.map((product) => (product.id === productId ? { ...product, images: nextImages } : product))
    );
  };

  const persistProductImages = async (productId: string, nextImages: string[]) => {
    if (!supabase) return;

    const { error } = await supabase
      .from('products')
      .update({ images: nextImages })
      .eq('id', productId);

    if (error) {
      setMessage(`Failed to save product images: ${error.message}`);
    }
  };

  const handleLoadExistingFolderImages = async (product: AdminProduct) => {
    if (!supabase) {
      setMessage('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      return;
    }

    const targetFolder = getProductFolder(product).trim();
    if (!targetFolder) {
      setMessage('Could not determine folder for this product.');
      return;
    }

    setExistingLoading((prev) => ({ ...prev, [product.id]: true }));
    setMessage('');

    try {
      const { data, error } = await supabase.storage
        .from('product-images')
        .list(targetFolder, { limit: 200, sortBy: { column: 'name', order: 'asc' } });

      if (error) {
        setMessage(`Could not load folder images for ${product.name}: ${error.message}`);
        return;
      }

      const urls = (data || [])
        .filter((item) => item.name && !item.name.endsWith('/'))
        .map((item) => {
          const fullPath = `${targetFolder}/${item.name}`;
          const { data: publicUrl } = supabase.storage.from('product-images').getPublicUrl(fullPath);
          return publicUrl.publicUrl;
        });

      setExistingFolderImages((prev) => ({ ...prev, [product.id]: urls }));
    } finally {
      setExistingLoading((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  const handleUploadExistingProductImages = async (product: AdminProduct, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!supabase) {
      setMessage('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      return;
    }

    const targetFolder = getProductFolder(product).trim();
    if (!targetFolder) {
      setMessage('Could not determine folder for this product.');
      return;
    }

    setExistingUploading((prev) => ({ ...prev, [product.id]: true }));
    setMessage('');

    try {
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        const filePath = `${targetFolder}/${Date.now()}-${file.name}`;
        const { error } = await supabase.storage
          .from('product-images')
          .upload(filePath, file, { upsert: false });

        if (error) {
          setMessage(`Image upload failed for ${file.name}: ${error.message}`);
          continue;
        }

        const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
        uploadedUrls.push(data.publicUrl);
      }

      if (uploadedUrls.length > 0) {
        setExistingFolderImages((prev) => ({
          ...prev,
          [product.id]: Array.from(new Set([...(prev[product.id] || []), ...uploadedUrls])),
        }));
        const nextImages = Array.from(new Set([...product.images, ...uploadedUrls]));
        updateProductImages(product.id, nextImages);
        await persistProductImages(product.id, nextImages);
      }
    } finally {
      setExistingUploading((prev) => ({ ...prev, [product.id]: false }));
      e.target.value = '';
    }
  };

  const toggleExistingProductImageSelection = (product: AdminProduct, imageUrl: string) => {
    const exists = product.images.includes(imageUrl);
    const nextImages = exists
      ? product.images.filter((img) => img !== imageUrl)
      : [...product.images, imageUrl];

    updateProductImages(product.id, nextImages);
    persistProductImages(product.id, nextImages);
  };

  const moveProductImage = (product: AdminProduct, index: number, direction: 'up' | 'down') => {
    const swapWith = direction === 'up' ? index - 1 : index + 1;
    if (swapWith < 0 || swapWith >= product.images.length) return;

    const nextImages = [...product.images];
    [nextImages[index], nextImages[swapWith]] = [nextImages[swapWith], nextImages[index]];
    updateProductImages(product.id, nextImages);
    persistProductImages(product.id, nextImages);
  };

  const handleDeleteExistingProductImage = async (product: AdminProduct, imageUrl: string) => {
    const storagePath = getStoragePathFromPublicUrl(imageUrl);

    if (!supabase || !storagePath) {
      setMessage('Could not delete image. Invalid Supabase image URL or missing configuration.');
      return;
    }

    const { error } = await supabase.storage.from('product-images').remove([storagePath]);
    if (error) {
      setMessage(`Failed to delete image: ${error.message}`);
      return;
    }

    const nextImages = product.images.filter((img) => img !== imageUrl);
    updateProductImages(product.id, nextImages);
    await persistProductImages(product.id, nextImages);
    setExistingFolderImages((prev) => ({
      ...prev,
      [product.id]: (prev[product.id] || []).filter((img) => img !== imageUrl),
    }));
  };

  const updateProductField = (id: string, field: 'name' | 'description' | 'price' | 'inStock', value: string | boolean) => {
    setProductEdits((prev) => {
      const current = prev[id] || { name: '', description: '', price: '', inStock: true };
      return {
        ...prev,
        [id]: {
          ...current,
          [field]: value,
        },
      };
    });
  };

  const hasProductEditChanges = (product: AdminProduct) => {
    const draft = productEdits[product.id];
    if (!draft) return false;
    return (
      draft.name !== product.name
      || draft.description !== product.description
      || Number(draft.price) !== product.price
      || draft.inStock !== product.inStock
    );
  };

  const handleDoneExistingProduct = async (product: AdminProduct) => {
    const draft = productEdits[product.id];
    if (!draft) return;

    const trimmedName = draft.name.trim();
    const trimmedDescription = draft.description.trim();
    const parsedPrice = Number(draft.price);

    if (!trimmedName || !trimmedDescription || !draft.price.trim()) {
      setMessage('Existing product title, description, and price cannot be empty.');
      return;
    }

    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      setMessage('Enter a valid non-negative price for the existing product.');
      return;
    }

    const nextProduct = {
      ...product,
      name: trimmedName,
      description: trimmedDescription,
      price: parsedPrice,
      inStock: draft.inStock,
    };

    setProducts((prev) => prev.map((p) => (p.id === product.id ? nextProduct : p)));
    setProductEdits((prev) => ({
      ...prev,
      [product.id]: {
        name: trimmedName,
        description: trimmedDescription,
        price: String(parsedPrice),
        inStock: draft.inStock,
      },
    }));

    if (!supabase) {
      setMessage(`Saved local changes for ${trimmedName}.`);
      return;
    }

    const { error } = await supabase
      .from('products')
      .update({
        name: trimmedName,
        description: trimmedDescription,
        price: parsedPrice,
        in_stock: draft.inStock,
      })
      .eq('id', product.id);

    if (error) {
      setMessage(`Failed to save change: ${error.message}`);
      return;
    }

    setMessage(`Saved changes for ${trimmedName}.`);
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supabase) {
      setAuthMessage('Supabase auth is not configured.');
      return;
    }

    const trimmedEmail = emailInput.trim();
    if (!trimmedEmail || !passwordInput) {
      setAuthMessage('Enter email and password.');
      return;
    }

    setIsAuthenticating(true);
    setAuthMessage('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: passwordInput,
      });

      if (error) {
        setAuthMessage(`Sign-in failed: ${error.message}`);
        return;
      }

      setPasswordInput('');
      await verifyAdminSession(data.session);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }

    setIsUnlocked(false);
    setEmailInput('');
    setPasswordInput('');
    setMessage('');
    setAuthMessage('Logged out successfully.');
    setProductEdits({});
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Checking admin session...</p>
        </div>
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Admin Access</h1>
          <p className="text-sm text-gray-600 mb-4">Sign in with the configured admin account.</p>

          <form onSubmit={handleUnlock} className="space-y-4">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Admin email"
            />
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Admin password"
            />
            {authMessage && <p className="text-sm text-red-700 bg-red-50 p-2 rounded">{authMessage}</p>}
            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
              {isAuthenticating ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin - Product Management</h1>
              <p className="text-sm text-gray-600">Add products and edit title, description, and stock status for all products.</p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition"
            >
              Log out
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Product</h2>
          {message && <p className="mb-4 text-sm text-indigo-700 bg-indigo-50 p-3 rounded">{message}</p>}

          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Title</label>
              <input
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Enter product title"
              />
            </div>

            <div className="flex items-end">
              <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={form.inStock}
                  onChange={(e) => setForm((prev) => ({ ...prev, inStock: e.target.checked }))}
                  className="h-4 w-4"
                />
                In Stock
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (INR)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Enter product price"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Enter product description"
              />
            </div>

            <div className="md:col-span-2 border border-gray-200 rounded p-4 space-y-4">
              <p className="text-sm font-semibold text-gray-800">Product Images (Supabase Storage)</p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Product Folder</label>
                <input
                  value={newProductFolder}
                  readOnly
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Folder auto-generated from title"
                />
                <p className="text-xs text-gray-500 mt-1">
                  A new folder is auto-created in `product-images` using the product title.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <label className="bg-gray-100 border border-gray-300 px-3 py-2 rounded cursor-pointer text-sm hover:bg-gray-200">
                  {isUploadingImages ? 'Uploading...' : 'Upload New Images'}
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleUploadImages}
                    disabled={isUploadingImages || !newProductFolder}
                  />
                </label>

                <button
                  type="button"
                  onClick={handleLoadFolderImages}
                  disabled={isLoadingFolder}
                  className="bg-white border border-gray-300 px-3 py-2 rounded text-sm hover:bg-gray-50"
                >
                  {isLoadingFolder ? 'Loading...' : 'Load Images From Folder'}
                </button>
              </div>

              {folderImageUrls.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2">Folder Images</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {folderImageUrls.map((url) => {
                      const isSelected = form.images.includes(url);
                      return (
                        <button
                          key={url}
                          type="button"
                          onClick={() => toggleSelectedImage(url)}
                          className={`border rounded p-1 ${isSelected ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-gray-300'}`}
                        >
                          <img src={url} alt="Folder product" className="w-full h-24 object-contain bg-gray-100 rounded" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2">Selected Images ({form.images.length})</p>
                {form.images.length === 0 && <p className="text-xs text-gray-500">No images selected yet.</p>}
                {form.images.length > 0 && (
                  <div className="space-y-2">
                    {form.images.map((url, idx) => (
                      <div key={url} className="flex items-center gap-2">
                        <span className="text-xs text-gray-700 truncate flex-1">{idx + 1}. {url}</span>
                        <button
                          type="button"
                          onClick={() => toggleSelectedImage(url)}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
              >
                Done
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">All Products</h2>
          {isLoadingProducts && <p className="text-sm text-gray-500 mb-4">Loading products from Supabase...</p>}
          <div className="space-y-4">
            {sortedProducts.map((product) => (
              <div key={product.id} className="border border-gray-200 rounded p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hasProductEditChanges(product) && (
                    <div className="md:col-span-2">
                      <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
                        You have unsaved title/description/stock changes for this product.
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Title</label>
                    <input
                      value={productEdits[product.id]?.name ?? product.name}
                      onChange={(e) => updateProductField(product.id, 'name', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>

                  <div className="flex items-end">
                    <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                      <input
                        type="checkbox"
                        checked={productEdits[product.id]?.inStock ?? product.inStock}
                        onChange={(e) => updateProductField(product.id, 'inStock', e.target.checked)}
                        className="h-4 w-4"
                      />
                      In Stock
                    </label>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                    <textarea
                      value={productEdits[product.id]?.description ?? product.description}
                      onChange={(e) => updateProductField(product.id, 'description', e.target.value)}
                      rows={3}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Price (INR)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={productEdits[product.id]?.price ?? String(product.price)}
                      onChange={(e) => updateProductField(product.id, 'price', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>

                  <div className="md:col-span-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleDoneExistingProduct(product)}
                      disabled={!hasProductEditChanges(product)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Done
                    </button>
                  </div>

                  <div className="md:col-span-2">
                    <p className="text-xs text-gray-500">
                      Supabase Folder: <span className="font-medium text-gray-700">{getProductFolder(product)}</span>
                    </p>
                  </div>

                  <div className="md:col-span-2 border border-gray-200 rounded p-4 space-y-3">
                    <p className="text-xs font-semibold text-gray-700">Manage Existing Product Images</p>

                    <div className="flex flex-wrap gap-2">
                      <label className="bg-gray-100 border border-gray-300 px-3 py-2 rounded cursor-pointer text-xs hover:bg-gray-200">
                        {existingUploading[product.id] ? 'Uploading...' : 'Upload To This Folder'}
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleUploadExistingProductImages(product, e)}
                          disabled={Boolean(existingUploading[product.id])}
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => handleLoadExistingFolderImages(product)}
                        disabled={Boolean(existingLoading[product.id])}
                        className="bg-white border border-gray-300 px-3 py-2 rounded text-xs hover:bg-gray-50"
                      >
                        {existingLoading[product.id] ? 'Loading...' : 'Load Folder Images'}
                      </button>
                    </div>

                    {(existingFolderImages[product.id] || []).length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-2">Folder Images (click to add/remove from product)</p>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                          {(existingFolderImages[product.id] || []).map((url) => {
                            const selected = product.images.includes(url);
                            return (
                              <button
                                key={url}
                                type="button"
                                onClick={() => toggleExistingProductImageSelection(product, url)}
                                className={`border rounded p-1 ${selected ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-gray-300'}`}
                              >
                                <img src={url} alt="Existing product" className="w-full h-20 object-contain bg-gray-100 rounded" />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-2">Product Image Order ({product.images.length})</p>
                      {product.images.length === 0 && <p className="text-xs text-gray-500">No images linked to this product.</p>}
                      {product.images.length > 0 && (
                        <div className="space-y-2">
                          {product.images.map((url, index) => (
                            <div key={url} className="flex items-center gap-2 border border-gray-200 rounded p-2">
                              <img src={url} alt="Ordered product" className="w-14 h-14 object-contain bg-gray-100 rounded" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-700 truncate">{index + 1}. {url}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => moveProductImage(product, index, 'up')}
                                disabled={index === 0}
                                className="text-xs px-2 py-1 border border-gray-300 rounded disabled:opacity-40"
                              >
                                Up
                              </button>
                              <button
                                type="button"
                                onClick={() => moveProductImage(product, index, 'down')}
                                disabled={index === product.images.length - 1}
                                className="text-xs px-2 py-1 border border-gray-300 rounded disabled:opacity-40"
                              >
                                Down
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteExistingProductImage(product, url)}
                                className="text-xs px-2 py-1 border border-red-300 text-red-700 rounded hover:bg-red-50"
                              >
                                Delete
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
