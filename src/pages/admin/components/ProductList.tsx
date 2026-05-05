import { ImageManager } from './ImageManager';
import { AdminProduct, CategoryOption, ProductEditDraft } from '../types';

interface ProductListProps {
  isLoadingProducts: boolean;
  sortedProducts: AdminProduct[];
  productEdits: Record<string, ProductEditDraft>;
  categoryOptions: CategoryOption[];
  existingFolderImages: Record<string, string[]>;
  existingLoading: Record<string, boolean>;
  existingUploading: Record<string, boolean>;
  hasProductEditChanges: (product: AdminProduct) => boolean;
  updateProductField: (
    id: string,
    field: 'name' | 'description' | 'price' | 'inStock' | 'category',
    value: string | boolean,
  ) => void;
  onDoneExistingProduct: (product: AdminProduct) => Promise<void>;
  getProductFolder: (product: AdminProduct) => string;
  onUploadExistingProductImages: (product: AdminProduct, e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onLoadExistingFolderImages: (product: AdminProduct) => Promise<void>;
  onToggleExistingProductImageSelection: (product: AdminProduct, imageUrl: string) => void;
  onMoveProductImage: (product: AdminProduct, index: number, direction: 'up' | 'down') => void;
  onDeleteExistingProductImage: (product: AdminProduct, imageUrl: string) => Promise<void>;
}

export function ProductList({
  isLoadingProducts,
  sortedProducts,
  productEdits,
  categoryOptions,
  existingFolderImages,
  existingLoading,
  existingUploading,
  hasProductEditChanges,
  updateProductField,
  onDoneExistingProduct,
  getProductFolder,
  onUploadExistingProductImages,
  onLoadExistingFolderImages,
  onToggleExistingProductImageSelection,
  onMoveProductImage,
  onDeleteExistingProductImage,
}: ProductListProps) {
  return (
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

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
                <select
                  value={productEdits[product.id]?.category ?? product.category}
                  onChange={(e) => updateProductField(product.id, 'category', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  {categoryOptions.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => onDoneExistingProduct(product)}
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

              <ImageManager
                product={product}
                existingFolderImages={existingFolderImages[product.id] || []}
                isUploading={Boolean(existingUploading[product.id])}
                isLoading={Boolean(existingLoading[product.id])}
                onUpload={onUploadExistingProductImages}
                onLoadFolderImages={onLoadExistingFolderImages}
                onToggleSelection={onToggleExistingProductImageSelection}
                onMoveImage={onMoveProductImage}
                onDeleteImage={onDeleteExistingProductImage}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
