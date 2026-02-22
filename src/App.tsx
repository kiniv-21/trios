import React, { useState, useEffect } from 'react';
import { Heart, Star, Palette, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Settings } from 'lucide-react';
import { categories } from './data/products';
import { Product } from './types';
import { createClient } from '@supabase/supabase-js';
import { Admin } from './pages/Admin';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function App() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) throw error;

      const mappedProducts = (data || []).map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        images: product.images || [],
        category: product.category,
        featured: product.featured,
        inStock: product.in_stock,
        rating: product.rating
      }));

      setProducts(mappedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.category === selectedCategory);

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
  };

  if (showAdmin) {
    return (
      <>
        <Admin />
        <button
          onClick={() => setShowAdmin(false)}
          className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition shadow-lg"
        >
          Back to Shop
        </button>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-indigo-900">
      {/* Header */}
      <header className="bg-gray-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Palette className="h-8 w-8 text-indigo-400" />
              <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">
                Trios Art
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <span className="text-gray-300">Hand-Painted Jute Bags</span>
              <button
                onClick={() => setShowAdmin(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition"
                title="Admin Panel"
              >
                <Settings size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-indigo-900/90 to-purple-900/80 z-10"></div>
          <img 
            src="https://images.pexels.com/photos/6069544/pexels-photo-6069544.jpeg" 
            alt="Hero background" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Artistry Meets <span className="bg-gradient-to-r from-amber-400 to-yellow-500 text-transparent bg-clip-text">Sustainable</span> Fashion
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Each Trios Art bag is a unique canvas showcasing handcrafted artistry on eco-friendly jute. 
            Discover our collection of sustainable fashion statements.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-gradient-to-b from-indigo-900/30 to-gray-900/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Collection</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Explore our unique hand-painted jute bags, each piece crafted with care and artistic vision.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map(product => (
              <div 
                key={product.id}
                className="group bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg overflow-hidden shadow-lg transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl cursor-pointer"
                onClick={() => openProductModal(product)}
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-all duration-500 transform group-hover:scale-105"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  
                  <button className="absolute top-4 right-4 p-2 bg-gray-900 bg-opacity-80 rounded-full text-white hover:bg-opacity-100 transition-all duration-200">
                    <Heart size={20} className="text-white" />
                  </button>

                  {product.featured && (
                    <div className="absolute top-0 left-0 bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                      Featured
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white group-hover:text-indigo-300 transition-colors duration-200 mb-2">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-400 ml-2">({product.rating})</span>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-white">${product.price.toFixed(2)}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.inStock 
                        ? 'bg-green-900 text-green-300' 
                        : 'bg-red-900 text-red-300'
                    }`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gradient-to-b from-indigo-900/30 to-gray-900/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Sustainability at Our Core</h2>
              <p className="text-gray-300 mb-6">
                At Trios Art, sustainability isn't just a buzzword—it's our foundation. We believe that fashion and environmental responsibility can coexist beautifully.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-indigo-600 rounded-full p-1 mr-3 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Eco-Friendly Materials</h3>
                    <p className="text-gray-400">100% natural jute fiber, renewable and biodegradable</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-indigo-600 rounded-full p-1 mr-3 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Ethical Production</h3>
                    <p className="text-gray-400">Fair wages and safe working conditions for artisans</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-indigo-600 rounded-full p-1 mr-3 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Water-Based Paints</h3>
                    <p className="text-gray-400">Non-toxic, environmentally safe painting materials</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-indigo-600 rounded-full opacity-20"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-600 rounded-full opacity-20"></div>
              <img 
                src="https://images.pexels.com/photos/5864292/pexels-photo-5864292.jpeg" 
                alt="Sustainable practices" 
                className="rounded-lg shadow-xl relative z-10 w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Get in Touch</h2>
            <p className="text-gray-300 mb-8">
              Interested in our products? Contact us for custom orders or inquiries.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <div className="bg-indigo-600 rounded-full p-4 mb-4">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">Email</h3>
                <p className="text-gray-300">info@triosart.com</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="bg-indigo-600 rounded-full p-4 mb-4">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">Phone</h3>
                <p className="text-gray-300">(555) 123-4567</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="bg-indigo-600 rounded-full p-4 mb-4">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">Location</h3>
                <p className="text-gray-300">Craft District, CA</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Palette className="h-6 w-6 text-indigo-400" />
              <span className="ml-2 text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">
                Trios Art
              </span>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-800 text-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} Trios Art. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Handcrafted with sustainable materials and ethical practices.
            </p>
          </div>
        </div>
      </footer>

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-white">{selectedProduct.name}</h2>
                <button 
                  onClick={closeProductModal}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="h-96 rounded-lg overflow-hidden bg-gray-700">
                    <img 
                      src={selectedProduct.images[0]} 
                      alt={selectedProduct.name} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {selectedProduct.images.map((image, index) => (
                      <div key={index} className="h-20 rounded-md overflow-hidden bg-gray-700">
                        <img 
                          src={image} 
                          alt={`${selectedProduct.name} ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center mb-2">
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded bg-indigo-900 text-indigo-300">
                        {selectedProduct.category.charAt(0).toUpperCase() + selectedProduct.category.slice(1)}
                      </span>
                      {selectedProduct.featured && (
                        <span className="ml-2 text-xs font-medium px-2.5 py-0.5 rounded bg-amber-900 text-amber-300">
                          Featured
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center mb-4">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-5 h-5 ${i < Math.floor(selectedProduct.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-gray-400 ml-2">({selectedProduct.rating})</span>
                    </div>
                  </div>

                  <p className="text-3xl font-bold text-white">${selectedProduct.price.toFixed(2)}</p>

                  <div className="border-t border-gray-700 pt-6">
                    <p className="text-gray-300">{selectedProduct.description}</p>
                  </div>

                  <div className="border-t border-gray-700 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col items-center text-center p-4 bg-gray-700 rounded-lg">
                        <h3 className="font-semibold text-white mb-2">Availability</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedProduct.inStock 
                            ? 'bg-green-900 text-green-300' 
                            : 'bg-red-900 text-red-300'
                        }`}>
                          {selectedProduct.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                      <div className="flex flex-col items-center text-center p-4 bg-gray-700 rounded-lg">
                        <h3 className="font-semibold text-white mb-2">Contact for Orders</h3>
                        <p className="text-indigo-400 text-sm">info@triosart.com</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;