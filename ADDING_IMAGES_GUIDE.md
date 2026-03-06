# How to Add Your Product Images

This guide explains how to add your own product images to the Trios Art website.

## Step 1: Create the Images Folder

1. In your project, create a `public` folder in the root directory (if it doesn't exist already)
2. Inside `public`, create an `images` folder
3. Inside `images`, create a `products` folder

Your folder structure should look like:
```
project/
├── public/
│   └── images/
│       └── products/
├── src/
├── package.json
└── ...
```

## Step 2: Add Your Images

1. Copy your product images into the `public/images/products/` folder
2. Use clear naming like:
   - `bag-1-main.jpg`
   - `bag-1-detail.jpg`
   - `bag-2-main.jpg`
   - `bag-2-detail.jpg`

Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`

## Step 3: Update Product Data

Open `src/data/products.ts` and update the image URLs for each product:

```typescript
{
  id: '1',
  name: 'Your Product Name',
  price: 49.99,
  description: 'Your product description',
  images: [
    '/images/products/bag-1-main.jpg',      // Main image
    '/images/products/bag-1-detail.jpg'     // Additional images
  ],
  category: 'totes',
  featured: true,
  inStock: true,
  rating: 4.8
}
```

## Step 4: Add New Products

To add a new product, add a new object to the `products` array in `src/data/products.ts`:

```typescript
{
  id: '7',  // Use a unique ID
  name: 'New Bag Name',
  price: 59.99,
  description: 'Detailed description of your new bag',
  images: [
    '/images/products/new-bag-main.jpg',
    '/images/products/new-bag-detail-1.jpg',
    '/images/products/new-bag-detail-2.jpg'
  ],
  category: 'totes',  // Options: 'totes', 'shoulder', 'clutch', 'messenger'
  featured: false,
  inStock: true,
  rating: 4.5
}
```

## Categories Available

- `totes` - Tote Bags
- `shoulder` - Shoulder Bags
- `clutch` - Clutches
- `messenger` - Messenger Bags

## Image Recommendations

- **Size**: Minimum 800x800 pixels for best quality
- **Format**: JPEG for photos (smaller file size)
- **Naming**: Use lowercase, hyphens instead of spaces
- **Multiple angles**: Include 2-4 images per product showing different views

## Example Complete Product

```typescript
{
  id: '8',
  name: 'Sunset Waves Beach Tote',
  price: 54.99,
  description: 'Hand-painted sunset and wave design on eco-friendly jute. Perfect for beach trips with spacious interior.',
  images: [
    '/images/products/sunset-tote-front.jpg',
    '/images/products/sunset-tote-back.jpg',
    '/images/products/sunset-tote-detail.jpg',
    '/images/products/sunset-tote-handle.jpg'
  ],
  category: 'totes',
  featured: true,
  inStock: true,
  rating: 4.8
}
```

## Notes

- Images in the `public` folder are automatically served by Vite
- No need to import images - just reference them with `/images/products/...`
- The first image in the array is used as the main product image
- All images in the array are shown in the product detail modal
