import { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Floral Paradise Jute Tote',
    price: 49.99,
    description: 'Hand-painted floral design on a sturdy jute tote bag. Perfect for everyday use with internal pockets and strong handles.',
    images: [
      'https://images.pexels.com/photos/5864245/pexels-photo-5864245.jpeg',
      'https://images.pexels.com/photos/5864276/pexels-photo-5864276.jpeg'
    ],
    category: 'totes',
    featured: true,
    inStock: true,
    rating: 4.8
  },
  {
    id: '2',
    name: 'Ocean Waves Shoulder Bag',
    price: 59.99,
    description: 'Serene ocean wave patterns hand-painted on a medium-sized jute shoulder bag. Water-resistant lining and adjustable strap.',
    images: [
      'https://images.pexels.com/photos/5864235/pexels-photo-5864235.jpeg',
      'https://images.pexels.com/photos/5864281/pexels-photo-5864281.jpeg'
    ],
    category: 'shoulder',
    featured: true,
    inStock: true,
    rating: 4.7
  },
  {
    id: '3',
    name: 'Abstract Art Clutch',
    price: 39.99,
    description: 'Bold abstract designs on a compact jute clutch. Includes a detachable wrist strap and magnetic closure.',
    images: [
      'https://images.pexels.com/photos/4068314/pexels-photo-4068314.jpeg',
      'https://images.pexels.com/photos/4068313/pexels-photo-4068313.jpeg'
    ],
    category: 'clutch',
    featured: false,
    inStock: true,
    rating: 4.5
  },
  {
    id: '4',
    name: 'Botanical Garden Tote',
    price: 54.99,
    description: 'Lush botanical illustrations on a large capacity jute tote. Features reinforced bottom and premium cotton handles.',
    images: [
      'https://images.pexels.com/photos/5864249/pexels-photo-5864249.jpeg',
      'https://images.pexels.com/photos/5864248/pexels-photo-5864248.jpeg'
    ],
    category: 'totes',
    featured: true,
    inStock: true,
    rating: 4.9
  },
  {
    id: '5',
    name: 'Geometric Patterns Messenger',
    price: 64.99,
    description: 'Modern geometric patterns on a versatile jute messenger bag. Includes padded laptop sleeve and multiple organization pockets.',
    images: [
      'https://images.pexels.com/photos/5864243/pexels-photo-5864243.jpeg',
      'https://images.pexels.com/photos/5864242/pexels-photo-5864242.jpeg'
    ],
    category: 'messenger',
    featured: false,
    inStock: true,
    rating: 4.6
  },
  {
    id: '6',
    name: 'Sunset Dreams Mini Tote',
    price: 44.99,
    description: 'Vibrant sunset-inspired design on a compact jute tote. Perfect size for essentials with secure zip closure.',
    images: [
      'https://images.pexels.com/photos/5864271/pexels-photo-5864271.jpeg',
      'https://images.pexels.com/photos/5864270/pexels-photo-5864270.jpeg'
    ],
    category: 'totes',
    featured: false,
    inStock: true,
    rating: 4.7
  }
];

export const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'totes', name: 'Tote Bags' },
  { id: 'shoulder', name: 'Shoulder Bags' },
  { id: 'clutch', name: 'Clutches' },
  { id: 'messenger', name: 'Messenger Bags' }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  if (category === 'all') return products;
  return products.filter(product => product.category === category);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};