// All products across categories
export const allProducts = {
  windowAC: [
    {
      id: 1,
      name: 'Window AC - 1 Ton',
      category: 'Window AC',
      capacity: '1 Ton',
      price: 899,
      description: 'Perfect for small rooms and apartments',
      features: ['Energy Efficient', 'Quiet Operation', 'Remote Control'],
      basePrice: 899,
    },
    {
      id: 2,
      name: 'Window AC - 1.5 Ton',
      category: 'Window AC',
      capacity: '1.5 Ton',
      price: 1199,
      description: 'Best for medium-sized rooms',
      features: ['Powerful Cooling', 'Timer Function', 'Easy Installation'],
      basePrice: 1199,
    },
  ],
  splitAC: [
    {
      id: 3,
      name: 'Split AC - 1 Ton',
      category: 'Split AC',
      capacity: '1 Ton',
      price: 1499,
      description: 'Perfect for small rooms and apartments',
      features: ['Inverter Technology', 'Sleep Mode', 'Auto Clean'],
      basePrice: 1499,
    },
    {
      id: 4,
      name: 'Split AC - 1.5 Ton',
      category: 'Split AC',
      capacity: '1.5 Ton',
      price: 1899,
      description: 'Best for medium-sized rooms',
      features: ['5-Star Rating', 'Smart Wi-Fi', 'Turbo Cooling'],
      basePrice: 1899,
    },
    {
      id: 5,
      name: 'Split AC - 2 Ton',
      category: 'Split AC',
      capacity: '2 Ton',
      price: 2399,
      description: 'Ideal for large rooms and offices',
      features: ['Heavy Duty', 'Dual Inverter', 'Air Purifier'],
      basePrice: 2399,
    },
  ],
  oilHeater: [
    {
      id: 6,
      name: 'Oil Heater - 7 Fin',
      category: 'Oil Heater',
      capacity: '7 Fins',
      price: 799,
      description: 'Compact portable heater perfect for small rooms',
      features: ['Fast Heating', '3 Heat Settings', 'Tip-Over Protection'],
      basePrice: 799,
    },
    {
      id: 7,
      name: 'Oil Heater - 9 Fin',
      category: 'Oil Heater',
      capacity: '9 Fins',
      price: 999,
      description: 'Ideal heating solution for medium-sized rooms',
      features: ['Maximum Heat', 'Digital Display', 'Timer Function'],
      basePrice: 999,
    },
    {
      id: 8,
      name: 'Oil Heater - 11 Fin',
      category: 'Oil Heater',
      capacity: '11 Fins',
      price: 1299,
      description: 'Premium heater for large rooms and offices',
      features: ['Large Room Coverage', 'Eco Mode', 'Remote Control'],
      basePrice: 1299,
    },
  ],
}

// Helper to find product by slug
export function findProductBySlug(slug: string, category: 'window-ac' | 'split-ac' | 'oil-heater'): any {
  const categoryMap = {
    'window-ac': allProducts.windowAC,
    'split-ac': allProducts.splitAC,
    'oil-heater': allProducts.oilHeater,
  }

  const products = categoryMap[category]
  
  // Create slugs and find matching product
  return products.find(product => {
    const productSlug = `${product.category.toLowerCase().replace(/\s+/g, '-')}-${product.capacity
      .toLowerCase()
      .replace(/\s+/g, '-')}`
    return productSlug === slug
  })
}

// Get all products for a category
export function getProductsByCategory(category: 'window-ac' | 'split-ac' | 'oil-heater'): any[] {
  const categoryMap = {
    'window-ac': allProducts.windowAC,
    'split-ac': allProducts.splitAC,
    'oil-heater': allProducts.oilHeater,
  }
  return categoryMap[category]
}

// Generate URL slug for product
export function generateProductSlug(category: string, capacity: string): string {
  const categorySlug = category.toLowerCase().replace(/\s+/g, '-')
  const capacitySlug = capacity.toLowerCase().replace(/\s+/g, '-')
  return `${categorySlug}-${capacitySlug}`
}

// Construct full URL for product
export function getProductUrl(category: 'window-ac' | 'split-ac' | 'oil-heater', capacity: string): string {
  const slug = generateProductSlug(
    category.replace('-', ' ').toUpperCase(),
    capacity
  )
  return `/${category === 'window-ac' ? 'cooling/window-ac' : category === 'split-ac' ? 'cooling/split-ac' : 'heating/oil-heater'}/${slug}`
}
