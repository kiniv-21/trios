import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFavorite, setIsFavorite] = React.useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <Link 
      to={`/product/${product.id}`}
      className="group"
    >
      <div 
        className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg overflow-hidden shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative h-64 overflow-hidden">
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-500 transform group-hover:scale-105"
          />
          
          {/* Overlay on hover */}
          <div 
            className={`absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-0 transition-opacity duration-300 ${isHovered ? 'opacity-50' : ''}`}
          ></div>
          
          {/* Favorite button */}
          <button 
            onClick={toggleFavorite}
            className="absolute top-2 right-2 p-2 bg-gray-900 bg-opacity-80 rounded-full text-white hover:bg-opacity-100 transition-all duration-200"
          >
            <Heart 
              size={20} 
              className={`transition-colors duration-200 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} 
            />
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors duration-200">{product.name}</h3>
              <div className="flex items-center mt-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-500'}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-gray-400 ml-1">({product.rating})</span>
              </div>
            </div>
            <span className="text-xl font-bold text-white">${product.price.toFixed(2)}</span>
          </div>
          
          <div className="mt-4">
            <button
              onClick={handleAddToCart}
              className="w-full py-2 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg flex items-center justify-center transition-all duration-200"
            >
              <ShoppingCart size={18} className="mr-2" />
              Add to Cart
            </button>
          </div>
        </div>
        
        {product.featured && (
          <div className="absolute top-0 left-0 bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 px-3 py-1 text-xs font-bold uppercase tracking-wider">
            Featured
          </div>
        )}
        
        {!product.inStock && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
      </div>
    </Link>
  );
}