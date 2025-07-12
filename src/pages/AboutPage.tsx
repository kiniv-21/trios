import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-indigo-900 pt-20">
      {/* Hero Section */}
      <section className="relative py-16">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-indigo-900/90 to-purple-900/80 z-10"></div>
          <img 
            src="https://images.pexels.com/photos/6069552/pexels-photo-6069552.jpeg" 
            alt="About us background" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Our Story
            </h1>
            <p className="text-xl text-gray-300">
              At Trios Art, we blend artistic expression with sustainable fashion to create unique, eco-friendly jute bags that make a statement.
            </p>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-gray-300 mb-6">
                Founded in 2020, Trios Art emerged from a passion for both art and environmental sustainability. Our mission is to transform everyday accessories into canvases for artistic expression while promoting eco-friendly alternatives to plastic bags.
              </p>
              <p className="text-gray-300">
                We believe that fashion can be both beautiful and responsible. Each of our jute bags represents this philosophy—combining stunning hand-painted designs with sustainable materials to create functional art you can carry with pride.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-indigo-600 rounded-full opacity-20"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-600 rounded-full opacity-20"></div>
              <img 
                src="https://images.pexels.com/photos/6069551/pexels-photo-6069551.jpeg" 
                alt="Our mission" 
                className="rounded-lg shadow-xl relative z-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-16 bg-gradient-to-b from-indigo-900/30 to-gray-900/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Creative Process</h2>
            <p className="text-gray-300">
              From sustainable sourcing to artistic creation, every Trios Art bag undergoes a thoughtful journey before reaching your hands.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Sustainable Sourcing",
                description: "We carefully select high-quality jute fibers from sustainable sources, ensuring our materials meet our ecological standards.",
                image: "https://images.pexels.com/photos/5864381/pexels-photo-5864381.jpeg"
              },
              {
                title: "Artisan Craftsmanship",
                description: "Our skilled artisans handcraft each bag, paying attention to durability, functionality, and quality of construction.",
                image: "https://images.pexels.com/photos/6069555/pexels-photo-6069555.jpeg"
              },
              {
                title: "Artistic Expression",
                description: "Our talented artists transform blank jute canvases into unique pieces of art using eco-friendly, water-based paints and natural dyes.",
                image: "https://images.pexels.com/photos/6069553/pexels-photo-6069553.jpeg"
              }
            ].map((step, index) => (
              <div key={index} className="bg-gray-800 bg-opacity-50 rounded-lg overflow-hidden shadow-lg">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={step.image}
                    alt={step.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-300">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Meet Our Team</h2>
            <p className="text-gray-300">
              The passionate individuals behind Trios Art combine diverse talents in art, design, and sustainability to create our unique products.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Maya Johnson",
                role: "Founder & Lead Artist",
                bio: "With a background in fine arts and environmental advocacy, Maya founded Trios Art to merge her two passions.",
                image: "https://images.pexels.com/photos/7821697/pexels-photo-7821697.jpeg"
              },
              {
                name: "David Chen",
                role: "Sustainable Materials Expert",
                bio: "David ensures all our materials meet the highest standards of sustainability and environmental responsibility.",
                image: "https://images.pexels.com/photos/8199739/pexels-photo-8199739.jpeg"
              },
              {
                name: "Leila Patel",
                role: "Design Director",
                bio: "Leila's innovative designs combine functionality with artistic expression, creating bags that are both beautiful and practical.",
                image: "https://images.pexels.com/photos/8100784/pexels-photo-8100784.jpeg"
              }
            ].map((member, index) => (
              <div key={index} className="bg-gray-800 bg-opacity-50 rounded-lg overflow-hidden shadow-lg">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={member.image}
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-indigo-400 mb-3">{member.role}</p>
                  <p className="text-gray-300">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability Commitment */}
      <section className="py-16 bg-gradient-to-b from-indigo-900/30 to-gray-900/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-bold text-white mb-6">Our Commitment to Sustainability</h2>
              <p className="text-gray-300 mb-6">
                At Trios Art, sustainability isn't just a feature—it's our foundation. We're committed to making eco-friendly choices at every step of our process.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-indigo-600 rounded-full p-1 mr-3 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Carbon Footprint Reduction</h3>
                    <p className="text-gray-400">We continuously work to minimize our carbon footprint through efficient production methods and local sourcing when possible.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-indigo-600 rounded-full p-1 mr-3 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Zero Waste Initiative</h3>
                    <p className="text-gray-400">We aim to create zero waste in our production process, repurposing scraps and minimizing packaging.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-indigo-600 rounded-full p-1 mr-3 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Community Support</h3>
                    <p className="text-gray-400">We partner with local communities and artisans, providing fair wages and supporting traditional craftsmanship.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="order-1 md:order-2 relative">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-indigo-600 rounded-full opacity-20"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-600 rounded-full opacity-20"></div>
              <img 
                src="https://images.pexels.com/photos/6069548/pexels-photo-6069548.jpeg" 
                alt="Sustainability commitment" 
                className="rounded-lg shadow-xl relative z-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-indigo-900 to-purple-900 rounded-lg p-8 md:p-12 shadow-xl">
            <h2 className="text-3xl font-bold text-white mb-4">Explore Our Collection</h2>
            <p className="text-gray-300 mb-8">
              Discover our unique hand-painted jute bags and add a touch of artistic sustainability to your everyday life.
            </p>
            <Link to="/shop/all">
              <Button variant="secondary" size="lg">
                Shop Now
                <ArrowRight size={20} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}