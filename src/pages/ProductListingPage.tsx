import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Filter, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import { getProductsByCategory, categories } from '../data/products';
import { Product } from '../types';

export default function ProductListingPage() {
  const { categoryId = 'all' } = useParams<{ categoryId: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [showInStock, setShowInStock] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchProducts = () => {
      setLoading(true);
      const fetchedProducts = getProductsByCategory(categoryId);
      setProducts(fetchedProducts);
      setFilteredProducts(fetchedProducts);
      setLoading(false);
    };

    fetchProducts();
  }, [categoryId]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...products];

    // Filter by price range
    result = result.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Filter by stock status
    if (showInStock) {
      result = result.filter(product => product.inStock);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Featured products first, then sort by rating
        result.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.rating - a.rating;
        });
    }

    setFilteredProducts(result);
  }, [products, priceRange, sortBy, showInStock]);

  const currentCategory = categories.find(c => c.id === categoryId) || categories[0];

  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-indigo-900 pt-20 px-4">
      <div className="max-w-7xl mx-auto mt-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{currentCategory.name}</h1>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Link
                key={category.id}
                to={`/shop/${category.id}`}
                className={`px-4 py-2 text-sm rounded-full transition-colors ${
                  category.id === categoryId
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter sidebar - desktop */}
          <div className="hidden lg:block">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-4">Filters</h2>
              
              <div className="mb-6">
                <h3 className="font-medium text-gray-300 mb-3">Price Range</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">${priceRange[0]}</span>
                  <span className="text-gray-400">${priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium text-gray-300 mb-3">Sort By</h3>
                <div className="space-y-2">
                  {[
                    { id: 'featured', label: 'Featured' },
                    { id: 'price-low', label: 'Price: Low to High' },
                    { id: 'price-high', label: 'Price: High to Low' },
                    { id: 'rating', label: 'Highest Rated' }
                  ].map(option => (
                    <div key={option.id} className="flex items-center">
                      <input
                        id={`sort-${option.id}`}
                        type="radio"
                        name="sortBy"
                        checked={sortBy === option.id}
                        onChange={() => setSortBy(option.id)}
                        className="h-4 w-4 bg-gray-700 border-gray-600 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor={`sort-${option.id}`} className="ml-2 text-gray-300">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium text-gray-300 mb-3">Availability</h3>
                <div className="flex items-center">
                  <input
                    id="inStock"
                    type="checkbox"
                    checked={showInStock}
                    onChange={(e) => setShowInStock(e.target.checked)}
                    className="h-4 w-4 bg-gray-700 border-gray-600 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="inStock" className="ml-2 text-gray-300">
                    In Stock Only
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Products grid */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-300">
                Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
              </p>
              
              {/* Mobile filter button */}
              <button
                onClick={toggleFilters}
                className="lg:hidden flex items-center px-4 py-2 bg-gray-800 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
              >
                <Filter size={18} className="mr-2" />
                Filters
              </button>
              
              {/* Desktop sort dropdown */}
              <div className="hidden lg:block">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-800 text-gray-300 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <h2 className="text-2xl font-semibold text-white mb-4">No products found</h2>
                <p className="text-gray-300 mb-4">Try adjusting your filters to find what you're looking for.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile filter drawer */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity lg:hidden ${isFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`absolute right-0 top-0 bottom-0 w-80 bg-gray-900 transform transition-transform ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Filters</h2>
              <button onClick={toggleFilters} className="text-gray-300">
                <SlidersHorizontal size={24} />
              </button>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium text-gray-300 mb-3">Price Range</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">${priceRange[0]}</span>
                <span className="text-gray-400">${priceRange[1]}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium text-gray-300 mb-3">Sort By</h3>
              <div className="space-y-2">
                {[
                  { id: 'featured', label: 'Featured' },
                  { id: 'price-low', label: 'Price: Low to High' },
                  { id: 'price-high', label: 'Price: High to Low' },
                  { id: 'rating', label: 'Highest Rated' }
                ].map(option => (
                  <div key={option.id} className="flex items-center">
                    <input
                      id={`mobile-sort-${option.id}`}
                      type="radio"
                      name="mobileSortBy"
                      checked={sortBy === option.id}
                      onChange={() => setSortBy(option.id)}
                      className="h-4 w-4 bg-gray-700 border-gray-600 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor={`mobile-sort-${option.id}`} className="ml-2 text-gray-300">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium text-gray-300 mb-3">Availability</h3>
              <div className="flex items-center">
                <input
                  id="mobileInStock"
                  type="checkbox"
                  checked={showInStock}
                  onChange={(e) => setShowInStock(e.target.checked)}
                  className="h-4 w-4 bg-gray-700 border-gray-600 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="mobileInStock" className="ml-2 text-gray-300">
                  In Stock Only
                </label>
              </div>
            </div>
            
            <button
              onClick={toggleFilters}
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}