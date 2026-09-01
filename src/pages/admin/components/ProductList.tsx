import { ImageManager } from './ImageManager';
import { ChevronDown, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import { AdminProduct, CategoryOption, ProductEditDraft } from '../types';
import { useState } from 'react';

const formatPriceINR = (price: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number.isFinite(price) ? price : 0);

interface ProductListProps {
  isLoadingProducts: boolean;
  sortedProducts: AdminProduct[];
  deletingProductId: string | null;
  productEdits: Record<string, ProductEditDraft>;
  categoryOptions: CategoryOption[];
  existingFolderImages: Record<string, string[]>;
  existingLoading: Record<string, boolean>;
  existingUploading: Record<string, boolean>;
  hasProductEditChanges: (product: AdminProduct) => boolean;
  updateProductField: (
    id: string,
    field: 'name' | 'productCode' | 'description' | 'price' | 'inStock' | 'category' | 'showMaterials' | 'materialsText' | 'showDimensions' | 'dimensionsText' | 'showCustomization' | 'customizationText',
    value: string | boolean,
  ) => void;
  onDoneExistingProduct: (product: AdminProduct) => Promise<void>;
  onDeleteProduct: (product: AdminProduct) => Promise<void>;
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
  deletingProductId,
  productEdits,
  categoryOptions,
  existingFolderImages,
  existingLoading,
  existingUploading,
  hasProductEditChanges,
  updateProductField,
  onDoneExistingProduct,
  onDeleteProduct,
  getProductFolder,
  onUploadExistingProductImages,
  onLoadExistingFolderImages,
  onToggleExistingProductImageSelection,
  onMoveProductImage,
  onDeleteExistingProductImage,
}: ProductListProps) {
  const [expandedProductIds, setExpandedProductIds] = useState<Set<string>>(new Set());
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  const productCategoryOptions = categoryOptions.filter((category) =>
    sortedProducts.some((product) => product.category === category.id)
  );

  const toggleProduct = (productId: string) => {
    setExpandedProductIds((previous) => {
      const next = new Set(previous);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  const expandCategory = () => {
    setExpandedProductIds(new Set(
      sortedProducts
        .filter((product) => product.category === selectedCategoryId)
        .map((product) => product.id)
    ));
  };

  return (
    <div className="relative bg-white rounded-lg shadow p-6">
      <aside className="fixed right-4 top-1/2 z-30 hidden w-56 -translate-y-1/2 rounded-lg border border-gray-200 bg-white p-3 shadow-lg xl:block">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Product editors</p>
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setExpandedProductIds(new Set(sortedProducts.map((product) => product.id)))}
            className="flex w-full items-center gap-2 rounded border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Maximize2 size={15} />
            Expand all
          </button>
          <button
            type="button"
            onClick={() => setExpandedProductIds(new Set())}
            className="flex w-full items-center gap-2 rounded border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Minimize2 size={15} />
            Collapse all
          </button>
          <label className="block pt-2 text-xs font-medium text-gray-600" htmlFor="product-category-expander">Category</label>
          <select
            id="product-category-expander"
            value={selectedCategoryId}
            onChange={(event) => setSelectedCategoryId(event.target.value)}
            className="w-full rounded border border-gray-300 px-2 py-2 text-sm"
          >
            <option value="">Choose a category</option>
            {productCategoryOptions.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={expandCategory}
            disabled={!selectedCategoryId}
            className="w-full rounded bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Expand only this category
          </button>
        </div>
      </aside>

      <h2 className="text-xl font-semibold text-gray-900 mb-4">All Products</h2>
      {isLoadingProducts && <p className="text-sm text-gray-500 mb-4">Loading products from Supabase...</p>}
      <div className="sticky bottom-3 z-20 mb-4 rounded-lg border border-gray-200 bg-white/95 p-3 shadow-md backdrop-blur xl:hidden">
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => setExpandedProductIds(new Set(sortedProducts.map((product) => product.id)))} className="rounded border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Expand all</button>
          <button type="button" onClick={() => setExpandedProductIds(new Set())} className="rounded border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Collapse all</button>
        </div>
        <div className="mt-2 flex gap-2">
          <select value={selectedCategoryId} onChange={(event) => setSelectedCategoryId(event.target.value)} className="min-w-0 flex-1 rounded border border-gray-300 px-2 py-2 text-sm" aria-label="Category to expand">
            <option value="">Choose category</option>
            {productCategoryOptions.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
          <button type="button" onClick={expandCategory} disabled={!selectedCategoryId} className="rounded bg-indigo-600 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50">Expand category</button>
        </div>
      </div>
      <div className="space-y-4">
        {sortedProducts.map((product) => {
          const isExpanded = expandedProductIds.has(product.id);

          return (
          <div key={product.id} className="border border-gray-200 rounded p-4">
            <button
              type="button"
              onClick={() => toggleProduct(product.id)}
              aria-expanded={isExpanded}
              className="flex w-full items-center justify-between gap-4 text-left"
            >
              <span className="min-w-0">
                <span className="block truncate text-base font-semibold text-gray-900">{product.name}</span>
                <span className="mt-1 block text-sm text-gray-600">{product.productCode || 'No product ID'} · {product.category} · {formatPriceINR(product.price)}</span>
              </span>
              <span className="flex shrink-0 items-center gap-2 text-sm font-medium text-indigo-700">
                {isExpanded ? 'Collapse' : 'Edit'}
                {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </span>
            </button>
            {isExpanded && (
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

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Product ID</label>
                <input
                  value={productEdits[product.id]?.productCode ?? product.productCode ?? ''}
                  onChange={(e) => updateProductField(product.id, 'productCode', e.target.value.toUpperCase())}
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

              <div className="md:col-span-2 space-y-3 border border-gray-200 rounded p-3 bg-gray-50">
                <p className="text-xs font-semibold text-gray-700">Product Story Sections</p>

                <div>
                  <label className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1">
                    <input
                      type="checkbox"
                      checked={productEdits[product.id]?.showMaterials ?? product.showMaterials ?? true}
                      onChange={(e) => updateProductField(product.id, 'showMaterials', e.target.checked)}
                      className="h-4 w-4"
                    />
                    Show Materials
                  </label>
                  <textarea
                    rows={2}
                    value={productEdits[product.id]?.materialsText ?? product.materialsText ?? ''}
                    onChange={(e) => updateProductField(product.id, 'materialsText', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1">
                    <input
                      type="checkbox"
                      checked={productEdits[product.id]?.showDimensions ?? product.showDimensions ?? true}
                      onChange={(e) => updateProductField(product.id, 'showDimensions', e.target.checked)}
                      className="h-4 w-4"
                    />
                    Show Dimensions
                  </label>
                  <textarea
                    rows={2}
                    value={productEdits[product.id]?.dimensionsText ?? product.dimensionsText ?? ''}
                    onChange={(e) => updateProductField(product.id, 'dimensionsText', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1">
                    <input
                      type="checkbox"
                      checked={productEdits[product.id]?.showCustomization ?? product.showCustomization ?? true}
                      onChange={(e) => updateProductField(product.id, 'showCustomization', e.target.checked)}
                      className="h-4 w-4"
                    />
                    Show Customization Options
                  </label>
                  <textarea
                    rows={2}
                    value={productEdits[product.id]?.customizationText ?? product.customizationText ?? ''}
                    onChange={(e) => updateProductField(product.id, 'customizationText', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
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
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onDeleteProduct(product)}
                    disabled={deletingProductId === product.id}
                    className="border border-red-300 text-red-700 px-4 py-2 rounded hover:bg-red-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {deletingProductId === product.id ? 'Deleting...' : 'Delete Product'}
                  </button>

                  <button
                    type="button"
                    onClick={() => onDoneExistingProduct(product)}
                    disabled={!hasProductEditChanges(product) || deletingProductId === product.id}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Done
                  </button>
                </div>
              </div>

              <div className="md:col-span-2">
                <p className="text-xs text-gray-500 mb-2">
                  Internal DB ID: <span className="font-medium text-gray-700">{product.id}</span>
                </p>
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
            )}
          </div>
          );
        })}
      </div>
    </div>
  );
}
