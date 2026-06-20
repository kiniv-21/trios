import { CategoryOption, NewProductForm } from '../types';

const formatPriceINR = (price: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number.isFinite(price) ? price : 0);

interface ProductFormProps {
  form: NewProductForm;
  suggestedProductCode: string;
  categoryOptions: CategoryOption[];
  newProductFolder: string;
  isUploadingImages: boolean;
  isLoadingFolder: boolean;
  folderImageUrls: string[];
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onFormFieldChange: <K extends keyof NewProductForm>(
    field: K,
    value: NewProductForm[K]
  ) => void;
  onUploadImages: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onLoadFolderImages: () => Promise<void>;
  onToggleSelectedImage: (url: string) => void;
}

export function ProductForm({
  form,
  suggestedProductCode,
  categoryOptions,
  newProductFolder,
  isUploadingImages,
  isLoadingFolder,
  folderImageUrls,
  onSubmit,
  onFormFieldChange,
  onUploadImages,
  onLoadFolderImages,
  onToggleSelectedImage,
}: ProductFormProps) {
  const parsedPrice = Number(form.price);

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Product Title</label>
        <input
          value={form.name}
          onChange={(e) => onFormFieldChange('name', e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Enter product title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Product ID</label>
        <input
          value={form.productCode || suggestedProductCode}
          onChange={(e) => onFormFieldChange('productCode', e.target.value.toUpperCase())}
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="e.g. TOT-001"
        />
        <p className="text-xs text-gray-500 mt-1">Auto-generated from category, editable before saving.</p>
      </div>

      <div className="flex items-end">
        <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            checked={form.inStock}
            onChange={(e) => onFormFieldChange('inStock', e.target.checked)}
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
          onChange={(e) => onFormFieldChange('price', e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Enter product price"
        />
        <p className="text-xs text-gray-500 mt-1">
          Display Price: {formatPriceINR(Number.isFinite(parsedPrice) ? parsedPrice : 0)}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          value={form.category}
          onChange={(e) => onFormFieldChange('category', e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          {categoryOptions.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Product Description</label>
        <textarea
          value={form.description}
          onChange={(e) => onFormFieldChange('description', e.target.value)}
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
          <label className={`bg-gray-100 border border-gray-300 px-3 py-2 rounded cursor-pointer text-sm hover:bg-gray-200 ${isUploadingImages || !newProductFolder ? 'opacity-50 pointer-events-none' : ''}`}>
            {isUploadingImages ? 'Uploading...' : 'Upload New Images'}
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={onUploadImages}
            />
          </label>

          <button
            type="button"
            onClick={onLoadFolderImages}
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
                    onClick={() => onToggleSelectedImage(url)}
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
                    onClick={() => onToggleSelectedImage(url)}
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
  );
}
