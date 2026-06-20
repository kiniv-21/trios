import { CategoryOption } from '../types';

interface CategoryManagerProps {
  categoryOptions: CategoryOption[];
  newCategoryName: string;
  isSavingCategoryChange: boolean;
  editingCategoryId: string | null;
  editingCategoryName: string;
  editingCategorySlug: string;
  editingCategoryCoverImage: string;
  isUploadingCategoryImage: boolean;
  deletingCategoryId: string | null;
  deleteReplacementCategoryId: string;
  getProductsUsingCategoryCount: (categoryId: string) => number;
  getCategoryProductImages: (categoryId: string) => string[];
  onNewCategoryNameChange: (value: string) => void;
  onAddCategory: (e: React.FormEvent) => Promise<void>;
  onStartCategoryEdit: (category: CategoryOption) => void;
  onCancelCategoryEdit: () => void;
  onEditingCategoryNameChange: (value: string) => void;
  onEditingCategorySlugChange: (value: string) => void;
  onEditingCategoryCoverImageChange: (value: string) => void;
  onUploadCategoryImage: (category: CategoryOption, e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onSaveCategoryEdit: (category: CategoryOption) => Promise<void>;
  onStartCategoryDelete: (category: CategoryOption) => void;
  onCancelCategoryDelete: () => void;
  onDeleteReplacementCategoryIdChange: (value: string) => void;
  onDeleteCategory: (category: CategoryOption) => Promise<void>;
}

export function CategoryManager({
  categoryOptions,
  newCategoryName,
  isSavingCategoryChange,
  editingCategoryId,
  editingCategoryName,
  editingCategorySlug,
  editingCategoryCoverImage,
  isUploadingCategoryImage,
  deletingCategoryId,
  deleteReplacementCategoryId,
  getProductsUsingCategoryCount,
  getCategoryProductImages,
  onNewCategoryNameChange,
  onAddCategory,
  onStartCategoryEdit,
  onCancelCategoryEdit,
  onEditingCategoryNameChange,
  onEditingCategorySlugChange,
  onEditingCategoryCoverImageChange,
  onUploadCategoryImage,
  onSaveCategoryEdit,
  onStartCategoryDelete,
  onCancelCategoryDelete,
  onDeleteReplacementCategoryIdChange,
  onDeleteCategory,
}: CategoryManagerProps) {
  return (
    <div className="border border-gray-200 rounded p-4 mb-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Category Management</h3>
      <form onSubmit={onAddCategory} className="flex flex-col sm:flex-row gap-2">
        <input
          value={newCategoryName}
          onChange={(e) => onNewCategoryNameChange(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-3 py-2"
          placeholder="Add new category (e.g. festive-bags)"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          Add Category
        </button>
      </form>

      <div className="mt-4 space-y-3">
        <p className="text-xs font-semibold text-gray-700">Categories</p>
        {categoryOptions.length === 0 && (
          <p className="text-xs text-gray-500">No categories.</p>
        )}

        {categoryOptions.map((category) => {
          const isEditing = editingCategoryId === category.id;
          const isDeleting = deletingCategoryId === category.id;
          const productsUsingCategory = getProductsUsingCategoryCount(category.id);
          const categoryProductImages = getCategoryProductImages(category.id);
          const previewImage = isEditing ? editingCategoryCoverImage : category.coverImage;

          return (
            <div key={category.id} className="border border-gray-200 rounded p-3 bg-gray-50 space-y-3">
              {!isEditing && (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{category.name}</p>
                    <p className="text-xs text-gray-500">id: {category.id}</p>
                    {category.coverImage && (
                      <div className="mt-2 h-20 w-20 overflow-hidden rounded border border-gray-200 bg-white">
                        <img src={category.coverImage} alt={`${category.name} thumbnail`} className="h-full w-full object-cover" />
                      </div>
                    )}
                    <p className="text-xs text-gray-500">{productsUsingCategory} product(s) currently use this category.</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onStartCategoryEdit(category)}
                      disabled={isSavingCategoryChange}
                      className="text-xs bg-white border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-100 disabled:opacity-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onStartCategoryDelete(category)}
                      disabled={isSavingCategoryChange}
                      className="text-xs bg-white border border-red-200 text-red-700 px-3 py-1.5 rounded hover:bg-red-50 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}

              {isEditing && (
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Category Name</label>
                    <input
                      value={editingCategoryName}
                      onChange={(e) => onEditingCategoryNameChange(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Category Id (slug)</label>
                    <input
                      value={editingCategorySlug}
                      onChange={(e) => onEditingCategorySlugChange(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Changing the id will reassign products from the old id to the new id.
                    </p>
                  </div>
                  <div className="space-y-3 rounded border border-gray-200 bg-white p-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Thumbnail Preview</label>
                      {previewImage ? (
                        <div className="h-28 w-28 overflow-hidden rounded border border-gray-200 bg-gray-50">
                          <img src={previewImage} alt={`${category.name} preview`} className="h-full w-full object-cover" />
                        </div>
                      ) : (
                        <div className="flex h-28 w-28 items-center justify-center rounded border border-dashed border-gray-300 bg-gray-50 text-xs text-gray-500">
                          Auto thumbnail
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Thumbnail URL</label>
                      <input
                        value={editingCategoryCoverImage}
                        onChange={(e) => onEditingCategoryCoverImageChange(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        placeholder="https://..."
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <label className="text-xs bg-white border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-100 cursor-pointer">
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/gif"
                          className="hidden"
                          onChange={(e) => void onUploadCategoryImage(category, e)}
                          disabled={isUploadingCategoryImage || isSavingCategoryChange}
                        />
                        {isUploadingCategoryImage ? 'Uploading...' : 'Upload Image'}
                      </label>
                      <button
                        type="button"
                        onClick={() => onEditingCategoryCoverImageChange('')}
                        disabled={isSavingCategoryChange}
                        className="text-xs bg-white border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-100 disabled:opacity-50"
                      >
                        Reset To Auto
                      </button>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-2">Choose From Products In This Category</p>
                      {categoryProductImages.length === 0 ? (
                        <p className="text-xs text-gray-500">No product images found for this category yet.</p>
                      ) : (
                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                          {categoryProductImages.map((imageUrl) => {
                            const isSelected = editingCategoryCoverImage === imageUrl;

                            return (
                              <button
                                key={imageUrl}
                                type="button"
                                onClick={() => onEditingCategoryCoverImageChange(imageUrl)}
                                className={`overflow-hidden rounded border bg-white ${isSelected ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200'}`}
                              >
                                <img src={imageUrl} alt={`${category.name} option`} className="h-20 w-full object-cover" />
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onSaveCategoryEdit(category)}
                      disabled={isSavingCategoryChange}
                      className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {isSavingCategoryChange ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={onCancelCategoryEdit}
                      disabled={isSavingCategoryChange}
                      className="text-xs bg-white border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-100 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {isDeleting && (
                <div className="space-y-2 border-t border-gray-200 pt-3">
                  {productsUsingCategory > 0 && (
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Replacement Category</label>
                      <select
                        value={deleteReplacementCategoryId}
                        onChange={(e) => onDeleteReplacementCategoryIdChange(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      >
                        <option value="">Select replacement category</option>
                        {categoryOptions
                          .filter((option) => option.id !== category.id)
                          .map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.name}
                            </option>
                          ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        {productsUsingCategory} product(s) will be moved to the replacement category.
                      </p>
                    </div>
                  )}
                  {productsUsingCategory === 0 && (
                    <p className="text-xs text-gray-500">
                      No products currently use this category. Delete will only remove it from the list.
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onDeleteCategory(category)}
                      disabled={isSavingCategoryChange}
                      className="text-xs bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700 disabled:opacity-50"
                    >
                      {isSavingCategoryChange ? 'Deleting...' : 'Confirm Delete'}
                    </button>
                    <button
                      type="button"
                      onClick={onCancelCategoryDelete}
                      disabled={isSavingCategoryChange}
                      className="text-xs bg-white border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-100 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
