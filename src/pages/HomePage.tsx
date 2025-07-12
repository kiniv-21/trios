import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import Button from '../components/ui/Button';
import { getFeaturedProducts, categories } from '../data/products';
import { Product } from '../types';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    // In a real app, this would be an API call
    setFeaturedProducts(getFeaturedProducts());
  }, []);

  return (
    <div className="bg-gradient-to-b from-gray-900 to-indigo-900 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-indigo-900/90 to-purple-900/80 z-10"></div>
          <img 
            src="https://images.pexels.com/photos/6069544/pexels-photo-6069544.jpeg" 
            alt="Hero background" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Artistry Meets <span className="bg-gradient-to-r from-amber-400 to-yellow-500 text-transparent bg-clip-text">Sustainable</span> Fashion
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              Each Trios Art bag is a unique canvas showcasing handcrafted artistry on eco-friendly jute. Carry your essentials with style that makes a statement about sustainability and artistic expression.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/shop/all">
                <Button variant="primary" size="lg">
                  <ShoppingBag className="mr-2" size={20} />
                  Shop Collection
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg">
                  Our Story
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
          <span className="text-white text-sm mb-2">Scroll Down</span>
          <svg className="w-6 h-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gradient-to-b from-indigo-900 to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Shop By Category</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Explore our collection of handcrafted jute bags, each category featuring unique artistic styles and functional designs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.slice(1).map((category) => (
              <Link 
                key={category.id} 
                to={`/shop/${category.id}`}
                className="group relative overflow-hidden rounded-lg h-64 shadow-lg transform transition-transform hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 z-10"></div>
                <img 
                  src={`https://images.pexels.com/photos/5864${Math.floor(Math.random() * 100)}/pexels-photo-5864${Math.floor(Math.random() * 100)}.jpeg`} 
                  alt={category.name} 
                  className="w-full h-full object-cover transform transition-transform group-hover:scale-105" 
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 className="text-xl font-bold text-white mb-1">{category.name}</h3>
                  <div className="flex items-center text-indigo-300 group-hover:text-indigo-200 transition-colors">
                    <span>Shop Now</span>
                    <ArrowRight size={16} className="ml-2 transform transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-indigo-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Featured Products</h2>
              <p className="text-gray-400 max-w-2xl">
                Our most popular hand-painted jute bags, selected for their unique designs and exceptional craftsmanship.
              </p>
            </div>
            <Link to="/shop/all" className="hidden md:flex items-center text-indigo-400 hover:text-indigo-300 transition-colors">
              <span>View All</span>
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link to="/shop/all">
              <Button variant="outline">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section className="py-16 bg-gradient-to-b from-indigo-900 to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Sustainability at Our Core</h2>
              <p className="text-gray-300 mb-6">
                At Trios Art, sustainability isn't just a buzzword—it's our foundation. We believe that fashion and environmental responsibility can coexist beautifully.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <div className="bg-indigo-600 rounded-full p-1 mr-3 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Eco-Friendly Materials</h3>
                    <p className="text-gray-400">Our bags are crafted from 100% natural jute fiber, a renewable resource that's biodegradable and requires minimal water to grow.</p>
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
                    <p className="text-gray-400">We partner with local artisan communities, ensuring fair wages and safe working conditions while preserving traditional craftsmanship.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-indigo-600 rounded-full p-1 mr-3 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Reduced Carbon Footprint</h3>
                    <p className="text-gray-400">We use water-based, non-toxic paints and minimize packaging waste with recycled and biodegradable materials.</p>
                  </div>
                </li>
              </ul>
              <Link to="/about">
                <Button variant="secondary">
                  Learn More About Our Practices
                </Button>
              </Link>
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

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-indigo-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">What Our Customers Say</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Read about the experiences of our customers who've added Trios Art bags to their collection.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg p-6 shadow-lg">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">
                  {i === 1 && "I've received so many compliments on my Floral Paradise tote! The colors are vibrant and the craftsmanship is exceptional. It's also surprisingly durable for daily use."}
                  {i === 2 && "These bags are not only beautiful, but they're making a difference. I love supporting a company that prioritizes sustainability and ethical production. My Ocean Waves bag is a work of art."}
                  {i === 3 && "The Botanical Garden tote is even more stunning in person than in photos. The attention to detail in the painting is remarkable, and I appreciate that each bag is unique. Definitely worth the investment!"}
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                    {i === 1 && "SL"}
                    {i === 2 && "JD"}
                    {i === 3 && "KM"}
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold text-white">
                      {i === 1 && "Sarah L."}
                      {i === 2 && "James D."}
                      {i === 3 && "Kelly M."}
                    </h4>
                    <p className="text-sm text-gray-400">Verified Customer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-b from-indigo-900 to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Join Our Community</h2>
            <p className="text-gray-300 mb-8">
              Subscribe to our newsletter for exclusive offers, new product launches, and artisan stories.
            </p>
            <form className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <Button variant="primary" type="submit">
                Subscribe
              </Button>
            </form>
            <p className="text-gray-500 text-sm mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}