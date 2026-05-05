import { AdminProduct } from '../types';

interface ImageManagerProps {
  product: AdminProduct;
  existingFolderImages: string[];
  isUploading: boolean;
  isLoading: boolean;
  onUpload: (product: AdminProduct, e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onLoadFolderImages: (product: AdminProduct) => Promise<void>;
  onToggleSelection: (product: AdminProduct, imageUrl: string) => void;
  onMoveImage: (product: AdminProduct, index: number, direction: 'up' | 'down') => void;
  onDeleteImage: (product: AdminProduct, imageUrl: string) => Promise<void>;
}

export function ImageManager({
  product,
  existingFolderImages,
  isUploading,
  isLoading,
  onUpload,
  onLoadFolderImages,
  onToggleSelection,
  onMoveImage,
  onDeleteImage,
}: ImageManagerProps) {
  return (
    <div className="md:col-span-2 border border-gray-200 rounded p-4 space-y-3">
      <p className="text-xs font-semibold text-gray-700">Manage Existing Product Images</p>

      <div className="flex flex-wrap gap-2">
        <label className="bg-gray-100 border border-gray-300 px-3 py-2 rounded cursor-pointer text-xs hover:bg-gray-200">
          {isUploading ? 'Uploading...' : 'Upload To This Folder'}
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => onUpload(product, e)}
            disabled={isUploading}
          />
        </label>

        <button
          type="button"
          onClick={() => onLoadFolderImages(product)}
          disabled={isLoading}
          className="bg-white border border-gray-300 px-3 py-2 rounded text-xs hover:bg-gray-50"
        >
          {isLoading ? 'Loading...' : 'Load Folder Images'}
        </button>
      </div>

      {existingFolderImages.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-600 mb-2">Folder Images (click to add/remove from product)</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {existingFolderImages.map((url) => {
              const selected = product.images.includes(url);
              return (
                <button
                  key={url}
                  type="button"
                  onClick={() => onToggleSelection(product, url)}
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
                  onClick={() => onMoveImage(product, index, 'up')}
                  disabled={index === 0}
                  className="text-xs px-2 py-1 border border-gray-300 rounded disabled:opacity-40"
                >
                  Up
                </button>
                <button
                  type="button"
                  onClick={() => onMoveImage(product, index, 'down')}
                  disabled={index === product.images.length - 1}
                  className="text-xs px-2 py-1 border border-gray-300 rounded disabled:opacity-40"
                >
                  Down
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteImage(product, url)}
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
  );
}
