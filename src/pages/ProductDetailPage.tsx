import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingBag, Share2, ArrowLeft, Star, Truck, Package, Shield } from 'lucide-react';
import { getProductById } from '../data/products';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import Button from '../components/ui/Button';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    // In a real app, this would be an API call
    if (id) {
      const foundProduct = getProductById(id);
      if (foundProduct) {
        setProduct(foundProduct);
        setSelectedImage(foundProduct.images[0]);
      }
      setLoading(false);
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-indigo-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-indigo-900 pt-20 px-4">
        <div className="max-w-7xl mx-auto mt-8 bg-gray-800 rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Product Not Found</h1>
          <p className="text-gray-300 mb-6">We couldn't find the product you're looking for.</p>
          <Link to="/shop/all">
            <Button variant="primary">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-indigo-900 pt-20 px-4">
      <div className="max-w-7xl mx-auto mt-8">
        <div className="mb-6">
          <Link to="/shop/all" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Back to Shop
          </Link>
        </div>

        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative h-96 rounded-lg overflow-hidden bg-gray-700">
                <img 
                  src={selectedImage} 
                  alt={product.name} 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`h-24 rounded-md overflow-hidden bg-gray-700 transition-all ${selectedImage === image ? 'ring-2 ring-indigo-500' : 'opacity-70 hover:opacity-100'}`}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center mb-2">
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded bg-indigo-900 text-indigo-300">
                    {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                  </span>
                  {product.featured && (
                    <span className="ml-2 text-xs font-medium px-2.5 py-0.5 rounded bg-amber-900 text-amber-300">
                      Featured
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-white">{product.name}</h1>
                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-gray-400 ml-2">({product.rating})</span>
                </div>
              </div>

              <p className="text-2xl font-bold text-white">${product.price.toFixed(2)}</p>

              <div className="border-t border-gray-700 pt-6">
                <p className="text-gray-300">{product.description}</p>
              </div>

              <div className="border-t border-gray-700 pt-6">
                <div className="flex items-center mb-6">
                  <label htmlFor="quantity" className="block mr-4 text-gray-300">Quantity:</label>
                  <div className="flex items-center">
                    <button 
                      onClick={decrementQuantity} 
                      className="w-10 h-10 rounded-l-md bg-gray-700 text-white flex items-center justify-center hover:bg-gray-600 transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      id="quantity"
                      min="1"
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="w-16 h-10 text-center bg-gray-700 text-white border-x border-gray-600 focus:outline-none"
                    />
                    <button 
                      onClick={incrementQuantity} 
                      className="w-10 h-10 rounded-r-md bg-gray-700 text-white flex items-center justify-center hover:bg-gray-600 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    onClick={handleAddToCart}
                    fullWidth
                  >
                    <ShoppingBag className="mr-2" size={20} />
                    Add to Cart
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={toggleFavorite}
                  >
                    <Heart 
                      size={20} 
                      className={`${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} 
                    />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="lg"
                  >
                    <Share2 size={20} />
                  </Button>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col items-center text-center p-3 bg-gray-800 rounded-lg">
                    <Truck className="h-6 w-6 text-indigo-400 mb-2" />
                    <h3 className="font-semibold text-white">Free Shipping</h3>
                    <p className="text-sm text-gray-400">On orders over $75</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-3 bg-gray-800 rounded-lg">
                    <Package className="h-6 w-6 text-indigo-400 mb-2" />
                    <h3 className="font-semibold text-white">Easy Returns</h3>
                    <p className="text-sm text-gray-400">30 day return policy</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-3 bg-gray-800 rounded-lg">
                    <Shield className="h-6 w-6 text-indigo-400 mb-2" />
                    <h3 className="font-semibold text-white">Secure Checkout</h3>
                    <p className="text-sm text-gray-400">SSL secured payment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}