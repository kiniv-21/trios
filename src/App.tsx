import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Palette,
  Leaf,
  PenTool,
  Scissors,
  Sparkles,
  Package,
  MessageCircle,
  Instagram,
  Mail,
  Phone,
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { categories as defaultCategories, products as staticProducts } from './data/products';
import { Product } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

interface ProductRow {
  id: string;
  product_code: string | null;
  name: string;
  price: number;
  description: string;
  images: string[] | null;
  category: string;
  featured: boolean;
  in_stock: boolean;
  show_materials: boolean | null;
  materials_text: string | null;
  show_dimensions: boolean | null;
  dimensions_text: string | null;
  show_customization: boolean | null;
  customization_text: string | null;
}

const DEFAULT_MATERIALS_TEXT = 'Natural jute base, hand-mixed fabric paints, artisan-finished trims.';
const DEFAULT_DIMENSIONS_TEXT = 'Available on request with piece-specific dimensions.';
const DEFAULT_CUSTOMIZATION_TEXT = 'Color palette, motif style, and naming personalization available.';

interface CategoryOption {
  id: string;
  name: string;
  coverImage?: string;
}

interface SiteContent {
  brand_name?: string;
  site_tab_title?: string;
  site_meta_description?: string;
  hero_title?: string;
  hero_description?: string;
  collection_title?: string;
  collection_description?: string;
  about_title?: string;
  about_description?: string;
  about_bullet_1_title?: string;
  about_bullet_1_desc?: string;
  about_bullet_2_title?: string;
  about_bullet_2_desc?: string;
  contact_title?: string;
  contact_description?: string;
  whatsapp_number?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_location?: string;
  process_title?: string;
  process_description?: string;
  process_step_1?: string;
  process_step_2?: string;
  process_step_3?: string;
  process_step_4?: string;
  process_step_5?: string;
  social_instagram?: string;
  footer_copyright?: string;
  footer_description?: string;
}

const defaultSiteContent: SiteContent = {
  brand_name: 'Trios Art',
  site_tab_title: 'Trios Art | Hand-Painted Jute Bags',
  site_meta_description: 'Trios Art offers unique hand-painted jute bags that combine artistic expression with sustainable fashion. Shop our collection of eco-friendly, stylish bags.',
  hero_title: 'Trios Art',
  hero_description: 'A curated studio of hand-painted and handcrafted pieces where sustainability meets local artistry.',
  collection_title: 'Collections',
  collection_description: 'Begin with a collection to explore pieces crafted in small batches.',
  about_title: 'The Heart of Trios Art',
  about_description: 'Trios Art celebrates handmade craftsmanship where every piece is painted, finished, and curated with care.',
  about_bullet_1_title: 'Handmade craftsmanship',
  about_bullet_1_desc: 'Every piece carries intentional human detail and artistry.',
  about_bullet_2_title: 'Sustainability first',
  about_bullet_2_desc: 'Natural materials and thoughtful making processes reduce waste and elevate quality.',
  contact_title: 'Bring Your Idea to Life',
  contact_description: 'Start a conversation to commission, customize, or reserve a piece.',
  whatsapp_number: '+91 98454 98171',
  contact_email: 'info@triosart.com',
  contact_phone: '+91 98454 98171',
  contact_location: 'Bengaluru, Karnataka, India',
  process_title: 'From Idea to Hand-Finished Piece',
  process_description: '',
  process_step_1: 'Concept',
  process_step_2: 'Design',
  process_step_3: 'Craft',
  process_step_4: 'Finish',
  process_step_5: 'Deliver',
  social_instagram: '#',
  footer_copyright: '© {} Trios Art. All rights reserved.',
  footer_description: 'Handmade stories in sustainable form.',
};

const mapProductRow = (row: ProductRow): Product => ({
  id: row.id,
  productCode: row.product_code || undefined,
  name: row.name,
  price: Number(row.price || 0),
  description: row.description,
  images: Array.isArray(row.images) ? row.images : [],
  category: normalizeCategoryId(row.category),
  featured: Boolean(row.featured),
  inStock: Boolean(row.in_stock),
  showMaterials: row.show_materials ?? true,
  materialsText: row.materials_text ?? DEFAULT_MATERIALS_TEXT,
  showDimensions: row.show_dimensions ?? true,
  dimensionsText: row.dimensions_text ?? DEFAULT_DIMENSIONS_TEXT,
  showCustomization: row.show_customization ?? true,
  customizationText: row.customization_text ?? DEFAULT_CUSTOMIZATION_TEXT,
});

const normalizeCategoryId = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const formatCategoryName = (id: string) =>
  id
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const formatPriceINR = (price: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number.isFinite(price) ? price : 0);

const parseStoredCategories = (rawValue?: string): CategoryOption[] => {
  if (!rawValue) return [];

  try {
    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => {
        if (typeof item === 'string') {
          const id = normalizeCategoryId(item);
          if (!id || id === 'all') return null;
          return { id, name: formatCategoryName(id) };
        }

        if (item && typeof item === 'object' && typeof item.id === 'string') {
          const id = normalizeCategoryId(item.id);
          if (!id || id === 'all') return null;
          const name = typeof item.name === 'string' && item.name.trim()
            ? item.name.trim()
            : formatCategoryName(id);
          const coverImage = typeof item.coverImage === 'string' && item.coverImage.trim()
            ? item.coverImage.trim()
            : undefined;
          return { id, name, coverImage };
        }

        return null;
      })
      .filter((item): item is CategoryOption => Boolean(item));
  } catch {
    return [];
  }
};

const getCategorySubtitle = (categoryId: string) => {
  const map: Record<string, string> = {
    totes: 'Gallery-ready everyday carry pieces',
    shoulder: 'Elegant silhouettes for daily artistry',
    artifacts: 'Decor objects with hand-finished detail',
    lunch: 'Functional forms with painted expression',
    sling: 'Compact statement pieces',
    wire: 'Textural craftsmanship with structure',
  };

  return map[categoryId] || 'Curated handmade collection';
};

const getProductStory = (product: Product) => ({
  shortStory: product.description,
  showMaterials: product.showMaterials ?? true,
  materials: product.materialsText ?? DEFAULT_MATERIALS_TEXT,
  showDimensions: product.showDimensions ?? true,
  dimensions: product.dimensionsText ?? DEFAULT_DIMENSIONS_TEXT,
  showCustomization: product.showCustomization ?? true,
  customization: product.customizationText ?? DEFAULT_CUSTOMIZATION_TEXT,
});

function App() {
  const [products, setProducts] = useState<Product[]>(staticProducts);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [storedCategories, setStoredCategories] = useState<CategoryOption[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultSiteContent);

  const [selectedCategory, setSelectedCategory] = useState<CategoryOption | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [animateProducts, setAnimateProducts] = useState(false);
  const [animateShowcase, setAnimateShowcase] = useState(false);

  const productSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const loadSiteContent = async () => {
      if (!supabase) return;

      const { data, error } = await supabase
        .from('site_content')
        .select('key, value');

      if (error) {
        console.error('Failed to load site content:', error.message);
        return;
      }

      if (data && data.length > 0) {
        const contentMap: Record<string, string> = {};
        data.forEach((item: any) => {
          contentMap[item.key] = item.value || '';
        });

        setSiteContent((prev) => ({ ...prev, ...contentMap }));
        setStoredCategories(parseStoredCategories(contentMap.product_categories));
      }
    };

    loadSiteContent();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      if (!supabase) {
        setProducts(staticProducts);
        setIsLoadingProducts(false);
        return;
      }

      const { data, error } = await supabase
        .from('products')
        .select('id, product_code, name, price, description, images, category, featured, in_stock, show_materials, materials_text, show_dimensions, dimensions_text, show_customization, customization_text')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Failed to load products from Supabase:', error.message);
        setProducts([]);
        setIsLoadingProducts(false);
        return;
      }

      setProducts(Array.isArray(data) ? (data as ProductRow[]).map(mapProductRow) : []);
      setIsLoadingProducts(false);
    };

    loadProducts();
  }, []);

  useEffect(() => {
    document.title = siteContent.site_tab_title || defaultSiteContent.site_tab_title || 'Trios Art';

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        siteContent.site_meta_description || defaultSiteContent.site_meta_description || ''
      );
    }
  }, [siteContent.site_tab_title, siteContent.site_meta_description]);

  const mergedCategories = useMemo(() => {
    const categoryMap = new Map<string, CategoryOption>();

    if (!supabase) {
      for (const category of defaultCategories) {
        if (category.id === 'all') continue;
        categoryMap.set(category.id, { id: category.id, name: category.name });
      }
    }

    for (const category of storedCategories) {
      categoryMap.set(category.id, category);
    }

    for (const product of products) {
      const id = normalizeCategoryId(product.category);
      if (!id || id === 'all') continue;
      if (!categoryMap.has(id)) {
        categoryMap.set(id, { id, name: formatCategoryName(id) });
      }
    }

    return Array.from(categoryMap.values())
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [products, storedCategories]);

  const categoryCovers = useMemo(() => {
    const map: Record<string, string> = {};

    for (const category of mergedCategories) {
      if (category.coverImage) {
        map[category.id] = category.coverImage;
        continue;
      }

      const first = products.find((p) => normalizeCategoryId(p.category) === category.id);
      if (first && first.images[0]) map[category.id] = first.images[0];
    }

    return map;
  }, [mergedCategories, products]);

  const categoryProductCount = useMemo(() => {
    const map: Record<string, number> = {};

    for (const category of mergedCategories) {
      map[category.id] = products.filter((p) => normalizeCategoryId(p.category) === category.id).length;
    }

    return map;
  }, [mergedCategories, products]);

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return [];
    return products.filter((p) => normalizeCategoryId(p.category) === selectedCategory.id);
  }, [products, selectedCategory]);

  const processSteps = useMemo(
    () => [
      { label: siteContent.process_step_1 || 'Concept', icon: Leaf },
      { label: siteContent.process_step_2 || 'Design', icon: PenTool },
      { label: siteContent.process_step_3 || 'Craft', icon: Scissors },
      { label: siteContent.process_step_4 || 'Finish', icon: Sparkles },
      { label: siteContent.process_step_5 || 'Deliver', icon: Package },
    ],
    [
      siteContent.process_step_1,
      siteContent.process_step_2,
      siteContent.process_step_3,
      siteContent.process_step_4,
      siteContent.process_step_5,
    ]
  );

  const openCategory = (category: CategoryOption) => {
    setSelectedCategory(category);
    setSelectedProduct(null);
    setSelectedImageIndex(0);
    setAnimateProducts(false);
    setAnimateShowcase(false);

    requestAnimationFrame(() => {
      setAnimateProducts(true);
      setTimeout(() => {
        productSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 140);
    });
  };

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
    setSelectedImageIndex(0);
    setAnimateShowcase(false);

    requestAnimationFrame(() => {
      setAnimateShowcase(true);
      setTimeout(() => {
        document.getElementById('product-showcase')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 140);
    });
  };

  const selectedProductCategoryName = selectedProduct
    ? mergedCategories.find((category) => category.id === normalizeCategoryId(selectedProduct.category))?.name
      || formatCategoryName(normalizeCategoryId(selectedProduct.category))
    : '';

  const selectedProductReference = selectedProduct?.productCode || selectedProduct?.id || '';
  const isSelectedProductOutOfStock = Boolean(selectedProduct && !selectedProduct.inStock);
  const selectedProductStory = selectedProduct ? getProductStory(selectedProduct) : null;

  const whatsappMessage = selectedProduct
    ? [
      'Hi Trios Art, I am interested in this piece.',
      `Product: ${selectedProduct.name}`,
      `Category: ${selectedProductCategoryName}`,
      `Price: ${formatPriceINR(selectedProduct.price)}`,
      `Product ID: ${selectedProductReference}`,
    ].join('\n')
    : selectedCategory
      ? `Hi Trios Art, I would like to explore ${selectedCategory.name}.`
      : 'Hi Trios Art, I would like to explore your handcrafted collections.';

  const whatsappNumber = (siteContent.whatsapp_number || '+91 98454 98171').replace(/\D/g, '');
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  const instagramLink = siteContent.social_instagram || '#';
  const emailLink = `mailto:${siteContent.contact_email || 'info@triosart.com'}`;
  const phoneLink = `tel:${(siteContent.contact_phone || '+919845498171').replace(/\s+/g, '')}`;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2B2B2B]">
      <a
        href={whatsappLink}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_26px_rgba(22,163,74,0.35)] transition-all duration-300 hover:scale-105 hover:shadow-[0_16px_30px_rgba(22,163,74,0.42)] sm:bottom-6 sm:right-6 sm:px-5"
      >
        <MessageCircle size={18} />
        WhatsApp
      </a>

      <header className="sticky top-0 z-40 border-b border-[#E8DED2] bg-[#FAF7F2]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <button
            className="flex items-center gap-2"
            onClick={() => {
              setSelectedCategory(null);
              setSelectedProduct(null);
            }}
          >
            <Palette className="h-7 w-7 text-[#A67C52]" />
            <span className="font-heading text-2xl">{siteContent.brand_name || 'Trios Art'}</span>
          </button>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-[#A67C52] px-4 py-2 text-xs font-semibold tracking-wide text-white transition hover:bg-[#8F6843]"
          >
            WhatsApp Inquiry
          </a>
        </div>
      </header>

      <main>
        {supabase && !isLoadingProducts && mergedCategories.length === 0 && products.length === 0 ? (
          <section className="mx-auto flex min-h-[55vh] max-w-7xl flex-col items-center justify-center px-5 text-center sm:px-8">
            <p className="text-sm uppercase tracking-[0.2em] text-[#A67C52]">Trios Art</p>
            <h1 className="mt-3 font-heading text-[2.35rem] leading-[1.1] sm:text-6xl">
              No products or categories yet.
            </h1>
            <p className="mt-5 max-w-2xl text-[1.02rem] leading-relaxed text-[#6B6B6B] sm:text-lg">
              Add products or create categories in the admin area to populate this storefront.
            </p>
          </section>
        ) : (
          <>
          <section className="mx-auto max-w-7xl px-5 pb-8 pt-14 sm:px-8 sm:pb-10 sm:pt-20">
          <p className="mb-4 text-sm uppercase tracking-[0.2em] text-[#A67C52]">Handmade Artisan Gallery</p>
          <h1 className="font-heading text-[2.35rem] leading-[1.1] sm:text-6xl">
            {siteContent.hero_title || 'Crafted Stories, Not Catalog Listings'}
          </h1>
          <p className="mt-5 max-w-3xl text-[1.02rem] leading-relaxed text-[#6B6B6B] sm:mt-6 sm:text-lg">
            {siteContent.hero_description || defaultSiteContent.hero_description}
          </p>
          <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#A67C52] px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#8F6843] hover:shadow-[0_10px_22px_rgba(166,124,82,0.35)]"
            >
              <MessageCircle size={16} />
              WhatsApp Inquiry
            </a>
            <a
              href={instagramLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#D9C8B7] bg-white px-5 py-3 text-sm font-semibold text-[#2B2B2B] transition-all duration-300 hover:bg-[#F7F1E8]"
            >
              <Instagram size={16} />
              Instagram Message
            </a>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12" id="collections">
          <div className="mb-8">
            <h2 className="font-heading text-[2rem] leading-tight sm:text-4xl">{siteContent.collection_title || 'Collections'}</h2>
            <p className="mt-3 text-[0.98rem] leading-relaxed text-[#6B6B6B] sm:text-base">{siteContent.collection_description}</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mergedCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => openCategory(category)}
                className="group overflow-hidden rounded-2xl border border-[#EFE5D9] bg-white text-left shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_18px_34px_rgba(66,44,24,0.14)]"
              >
                <div className="h-64 overflow-hidden bg-[#F4EEE6]">
                  {categoryCovers[category.id] ? (
                    <img
                      src={categoryCovers[category.id]}
                      alt={category.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#A67C52]">
                      <Palette size={42} />
                    </div>
                  )}
                </div>
                <div className="space-y-2 p-5 sm:p-6">
                  <h3 className="font-heading text-[1.65rem] leading-tight sm:text-3xl">{category.name}</h3>
                  <p className="text-[0.94rem] leading-relaxed text-[#6B6B6B] sm:text-sm">{getCategorySubtitle(category.id)}</p>
                  <p className="text-xs uppercase tracking-[0.14em] text-[#A67C52]">
                    {categoryProductCount[category.id] ?? 0} piece{categoryProductCount[category.id] !== 1 ? 's' : ''}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {selectedCategory && (
          <section
            ref={productSectionRef}
            className={`mx-auto max-w-7xl px-5 py-14 transition-all duration-700 ease-out sm:px-8 ${
              animateProducts ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
            }`}
            id="category-products"
          >
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.2em] text-[#A67C52]">Selected Collection</p>
              <h2 className="mt-2 font-heading text-4xl">{selectedCategory.name}</h2>
            </div>

            {filteredProducts.length === 0 ? (
              <p className="text-[#6B6B6B]">This collection will be revealed soon.</p>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProducts.map((product, index) => (
                    <button
                      key={product.id}
                      onClick={() => openProduct(product)}
                      className="overflow-hidden rounded-2xl border border-[#EFE5D9] bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                      style={{
                        opacity: animateProducts ? 1 : 0,
                        transform: animateProducts ? 'translateY(0)' : 'translateY(10px)',
                        transition: `opacity 420ms ease ${index * 55}ms, transform 420ms ease ${index * 55}ms`,
                      }}
                    >
                      <div className="relative h-64 bg-[#F7F1E8] p-3">
                        {!product.inStock && (
                          <span className="absolute left-4 top-4 z-10 rounded-full border border-[#D9C8B7] bg-[#F4E9DC] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[#8F6843]">
                            Sold Out
                          </span>
                        )}
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="p-5 sm:p-6">
                        <h3 className="font-heading text-[1.6rem] leading-tight sm:text-2xl">{product.name}</h3>
                        <p className="mt-2 text-sm font-semibold text-[#2B2B2B]">{formatPriceINR(product.price)}</p>
                        {!product.inStock && (
                          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#8F6843]">Sold Out</p>
                        )}
                        <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[#A67C52]">
                          Product ID: {product.productCode || product.id}
                        </p>
                        <p className="mt-2 line-clamp-2 text-[0.95rem] leading-relaxed text-[#6B6B6B] sm:text-sm">{product.description}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {selectedProduct && (
                  <article
                    id="product-showcase"
                    className={`mt-10 rounded-3xl border border-[#E9DDCF] bg-white p-6 shadow-md transition-all duration-700 ease-out sm:p-10 ${
                      animateShowcase ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                    }`}
                  >
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                        <div className="space-y-4">
                        <div className="relative flex h-[420px] items-center justify-center rounded-2xl bg-[#F7F1E8] p-4">
                          {!selectedProduct.inStock && (
                            <span className="absolute left-4 top-4 rounded-full border border-[#D9C8B7] bg-[#F4E9DC] px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-[#8F6843]">
                              Sold Out
                            </span>
                          )}
                          <img
                            src={selectedProduct.images[selectedImageIndex] || selectedProduct.images[0]}
                            alt={selectedProduct.name}
                            className="h-full w-full object-contain"
                          />
                        </div>
                        {selectedProduct.images.length > 1 && (
                          <div className="grid grid-cols-5 gap-2">
                            {selectedProduct.images.map((image, index) => (
                              <button
                                key={image}
                                onClick={() => setSelectedImageIndex(index)}
                                className={`h-20 overflow-hidden rounded-lg border bg-[#F7F1E8] p-1 ${
                                  selectedImageIndex === index ? 'border-[#A67C52]' : 'border-transparent'
                                }`}
                              >
                                <img src={image} alt={`${selectedProduct.name} ${index + 1}`} className="h-full w-full object-contain" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="space-y-6">
                        <div>
                          <p className="text-sm uppercase tracking-[0.2em] text-[#A67C52]">Product Story</p>
                          <h3 className="mt-2 font-heading text-[2.05rem] leading-tight sm:text-4xl">{selectedProduct.name}</h3>
                          <p className="mt-2 text-xl font-semibold text-[#2B2B2B]">{formatPriceINR(selectedProduct.price)}</p>
                          {!selectedProduct.inStock && (
                            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#8F6843]">Sold Out</p>
                          )}
                          <p className="mt-2 text-xs uppercase tracking-[0.12em] text-[#A67C52]">
                            Product ID: {selectedProduct.productCode || selectedProduct.id}
                          </p>
                        </div>

                        <p className="text-[1.02rem] leading-relaxed text-[#6B6B6B] sm:text-base">{selectedProductStory?.shortStory}</p>

                        {(selectedProductStory?.showMaterials || selectedProductStory?.showDimensions || selectedProductStory?.showCustomization) && (
                          <div className="space-y-4 rounded-2xl bg-[#FBF8F3] p-5">
                            {selectedProductStory?.showMaterials && selectedProductStory.materials && (
                              <div>
                                <h4 className="font-semibold text-[#2B2B2B]">Materials</h4>
                                <p className="text-sm text-[#6B6B6B]">{selectedProductStory.materials}</p>
                              </div>
                            )}
                            {selectedProductStory?.showDimensions && selectedProductStory.dimensions && (
                              <div>
                                <h4 className="font-semibold text-[#2B2B2B]">Dimensions</h4>
                                <p className="text-sm text-[#6B6B6B]">{selectedProductStory.dimensions}</p>
                              </div>
                            )}
                            {selectedProductStory?.showCustomization && selectedProductStory.customization && (
                              <div>
                                <h4 className="font-semibold text-[#2B2B2B]">Customization Options</h4>
                                <p className="text-sm text-[#6B6B6B]">{selectedProductStory.customization}</p>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full bg-[#F1E4D6] px-4 py-2 text-xs font-semibold text-[#7F5B3A]">Handcrafted</span>
                          <span className="rounded-full bg-[#F1E4D6] px-4 py-2 text-xs font-semibold text-[#7F5B3A]">Eco-Friendly</span>
                          <span className="rounded-full bg-[#F1E4D6] px-4 py-2 text-xs font-semibold text-[#7F5B3A]">Customizable</span>
                        </div>

                        {!isSelectedProductOutOfStock && (
                          <div className="rounded-2xl border border-[#E9DDCF] p-5">
                            <p className="mb-4 font-heading text-2xl">Interested in this piece?</p>
                            <div className="flex flex-wrap gap-3">
                              <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-full bg-[#A67C52] px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#8F6843] hover:shadow-[0_10px_22px_rgba(166,124,82,0.35)]"
                              >
                                <MessageCircle size={16} />
                                WhatsApp Inquiry
                              </a>
                              <a
                                href={instagramLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-full border border-[#D9C8B7] bg-white px-5 py-3 text-sm font-semibold text-[#2B2B2B] transition-all duration-300 hover:bg-[#F7F1E8]"
                              >
                                <Instagram size={16} />
                                Instagram Message
                              </a>
                              <a
                                href={emailLink}
                                className="inline-flex items-center gap-2 rounded-full border border-[#D9C8B7] bg-white px-5 py-3 text-sm font-semibold text-[#2B2B2B] transition-all duration-300 hover:bg-[#F7F1E8]"
                              >
                                <Mail size={16} />
                                Email
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                )}
              </>
            )}
          </section>
        )}
          </>
        )}

        <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16" id="about">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-[#A67C52]">About Trios Art</p>
              <h2 className="mt-3 font-heading text-[2.05rem] leading-tight sm:text-5xl">{siteContent.about_title}</h2>
              <p className="mt-5 text-[1.02rem] leading-relaxed text-[#6B6B6B] sm:text-lg">{siteContent.about_description}</p>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-[#E9DDCF] bg-white p-5">
                <h3 className="font-heading text-2xl">{siteContent.about_bullet_1_title}</h3>
                <p className="mt-2 text-[#6B6B6B]">{siteContent.about_bullet_1_desc}</p>
              </div>
              <div className="rounded-2xl border border-[#E9DDCF] bg-white p-5">
                <h3 className="font-heading text-2xl">{siteContent.about_bullet_2_title}</h3>
                <p className="mt-2 text-[#6B6B6B]">{siteContent.about_bullet_2_desc}</p>
              </div>
              <div className="rounded-2xl border border-[#E9DDCF] bg-white p-5">
                <h3 className="font-heading text-2xl">Local Artistry, Unique Creations</h3>
                <p className="mt-2 text-[#6B6B6B]">
                  Every creation is intentionally unique, balancing practical use with artistic expression.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16" id="process">
          <p className="text-sm uppercase tracking-[0.2em] text-[#A67C52]">Our Process</p>
          <h2 className="mt-3 font-heading text-[2.05rem] leading-tight sm:text-5xl">{siteContent.process_title || 'From Idea to Hand-Finished Piece'}</h2>
          {siteContent.process_description && (
            <p className="mt-4 max-w-3xl text-[1.02rem] leading-relaxed text-[#6B6B6B]">{siteContent.process_description}</p>
          )}

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-5">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.label} className="rounded-2xl border border-[#E9DDCF] bg-white p-5 text-center">
                  <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#F3E7D9] text-[#A67C52]">
                    <Icon size={20} />
                  </div>
                  <p className="text-xs uppercase tracking-[0.12em] text-[#A67C52]">Step {index + 1}</p>
                  <h3 className="mt-2 font-heading text-xl">{step.label}</h3>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16" id="contact">
          <div className="rounded-3xl border border-[#E9DDCF] bg-white p-8 sm:p-10">
            <p className="text-sm uppercase tracking-[0.2em] text-[#A67C52]">Contact</p>
            <h2 className="mt-3 font-heading text-[2.05rem] leading-tight sm:text-4xl">{siteContent.contact_title}</h2>
            <p className="mt-4 max-w-2xl text-[1.02rem] leading-relaxed text-[#6B6B6B]">{siteContent.contact_description}</p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-[#D9C8B7] bg-[#F8F2EA] p-5 transition hover:shadow-md"
              >
                <MessageCircle className="mb-3 text-[#A67C52]" />
                <h3 className="font-heading text-2xl">WhatsApp</h3>
                <p className="mt-1 text-sm text-[#6B6B6B]">Start an inquiry instantly</p>
              </a>

              <a
                href={instagramLink}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-[#E9DDCF] p-5 transition hover:shadow-md"
              >
                <Instagram className="mb-3 text-[#A67C52]" />
                <h3 className="font-heading text-2xl">Instagram</h3>
                <p className="mt-1 text-sm text-[#6B6B6B]">Message on social</p>
              </a>

              <a href={emailLink} className="rounded-2xl border border-[#E9DDCF] p-5 transition hover:shadow-md">
                <Mail className="mb-3 text-[#A67C52]" />
                <h3 className="font-heading text-2xl">Email</h3>
                <p className="mt-1 text-sm text-[#6B6B6B]">{siteContent.contact_email}</p>
              </a>

              <a href={phoneLink} className="rounded-2xl border border-[#E9DDCF] p-5 transition hover:shadow-md">
                <Phone className="mb-3 text-[#A67C52]" />
                <h3 className="font-heading text-2xl">Phone</h3>
                <p className="mt-1 text-sm text-[#6B6B6B]">{siteContent.contact_phone}</p>
              </a>
            </div>

            <p className="mt-6 text-sm text-[#6B6B6B]">{siteContent.contact_location}</p>
          </div>
        </section>

      </main>

      <footer className="border-t border-[#E9DDCF] py-8">
        <div className="mx-auto max-w-7xl px-5 text-center sm:px-8">
          <p className="text-[#6B6B6B]">
            {siteContent.footer_copyright
              ? siteContent.footer_copyright.replace('{}', new Date().getFullYear().toString())
              : `© ${new Date().getFullYear()} Trios Art. All rights reserved.`}
          </p>
          <p className="mt-2 text-sm text-[#6B6B6B]">{siteContent.footer_description}</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
