interface CategoryOption {
  id: string;
  name: string;
  coverImage?: string;
}

export const resolveCategoryOptions = (
  defaults: CategoryOption[],
  saved: CategoryOption[],
  products: { category: string }[],
  includeUnusedDefaults: boolean,
): CategoryOption[] => {
  const normalizeId = (value: string) => value.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
  const defaultMap = new Map(defaults.filter(category => category.id !== 'all')
    .map(category => [normalizeId(category.id), category]));
  const categoryMap = new Map<string, CategoryOption>();

  if (includeUnusedDefaults) {
    for (const [id, category] of defaultMap) {
      categoryMap.set(id, { id, name: category.name });
    }
  }

  for (const category of saved) {
    const id = normalizeId(category.id);
    if (id && id !== 'all') categoryMap.set(id, { ...category, id });
  }

  for (const product of products) {
    const id = normalizeId(product.category);
    if (!id || id === 'all' || categoryMap.has(id)) continue;
    const name = defaultMap.get(id)?.name || id.split('-').filter(Boolean)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
    categoryMap.set(id, { id, name });
  }

  return Array.from(categoryMap.values()).sort((first, second) => first.name.localeCompare(second.name));
};