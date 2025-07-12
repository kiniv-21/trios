import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Button from '../components/ui/Button';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useCart();

  const incrementQuantity = (productId: string, currentQuantity: number) => {
    updateQuantity(productId, currentQuantity + 1);
  };

  const decrementQuantity = (productId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(productId, currentQuantity - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-indigo-900 pt-20 px-4">
      <div className="max-w-7xl mx-auto mt-8">
        <h1 className="text-3xl font-bold text-white mb-8">Your Shopping Cart</h1>

        {cart.items.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <ShoppingBag size={64} className="text-gray-600" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-4">Your cart is empty</h2>
            <p className="text-gray-400 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <Link to="/shop/all">
              <Button variant="primary">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <div className="p-6">
                  <div className="hidden sm:grid grid-cols-12 text-sm font-medium text-gray-400 mb-4">
                    <div className="col-span-6">Product</div>
                    <div className="col-span-2 text-center">Price</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-2 text-right">Total</div>
                  </div>

                  <div className="divide-y divide-gray-700">
                    {cart.items.map(item => (
                      <div key={item.product.id} className="py-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                        <div className="col-span-6 flex items-center">
                          <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-700 flex-shrink-0">
                            <img 
                              src={item.product.images[0]} 
                              alt={item.product.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <Link 
                              to={`/product/${item.product.id}`} 
                              className="text-white font-medium hover:text-indigo-300 transition-colors"
                            >
                              {item.product.name}
                            </Link>
                            <div className="text-sm text-gray-400 mt-1">
                              Category: {item.product.category.charAt(0).toUpperCase() + item.product.category.slice(1)}
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-sm text-red-400 hover:text-red-300 flex items-center mt-2 transition-colors"
                            >
                              <Trash2 size={14} className="mr-1" />
                              Remove
                            </button>
                          </div>
                        </div>

                        <div className="col-span-2 text-center text-white">
                          <div className="sm:hidden text-gray-400 mb-1">Price:</div>
                          ${item.product.price.toFixed(2)}
                        </div>

                        <div className="col-span-2 flex items-center justify-center">
                          <div className="sm:hidden text-gray-400 mb-1">Quantity:</div>
                          <div className="flex items-center">
                            <button 
                              onClick={() => decrementQuantity(item.product.id, item.quantity)} 
                              className="w-8 h-8 rounded-l-md bg-gray-700 text-white flex items-center justify-center hover:bg-gray-600 transition-colors"
                            >
                              -
                            </button>
                            <div className="w-10 h-8 flex items-center justify-center bg-gray-700 text-white border-x border-gray-600">
                              {item.quantity}
                            </div>
                            <button 
                              onClick={() => incrementQuantity(item.product.id, item.quantity)} 
                              className="w-8 h-8 rounded-r-md bg-gray-700 text-white flex items-center justify-center hover:bg-gray-600 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="col-span-2 text-right font-medium text-white">
                          <div className="sm:hidden text-gray-400 mb-1">Total:</div>
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span>${cart.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Shipping</span>
                    <span>{cart.total > 75 ? 'Free' : '$7.99'}</span>
                  </div>
                  <div className="border-t border-gray-700 pt-3 flex justify-between font-bold text-white">
                    <span>Total</span>
                    <span>${(cart.total > 75 ? cart.total : cart.total + 7.99).toFixed(2)}</span>
                  </div>
                </div>

                <Link to="/checkout">
                  <Button variant="primary" fullWidth>
                    Proceed to Checkout
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>

                <div className="mt-6">
                  <h3 className="font-medium text-white mb-2">We Accept</h3>
                  <div className="flex space-x-2">
                    <div className="w-10 h-6 bg-gray-700 rounded"></div>
                    <div className="w-10 h-6 bg-gray-700 rounded"></div>
                    <div className="w-10 h-6 bg-gray-700 rounded"></div>
                    <div className="w-10 h-6 bg-gray-700 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}