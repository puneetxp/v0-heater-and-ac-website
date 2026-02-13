// Debug script to verify product slug matching
const products = {
  windowAC: [
    {
      id: 1,
      name: 'Window AC - 1 Ton',
      category: 'Window AC',
      capacity: '1 Ton',
      price: 899,
    },
    {
      id: 2,
      name: 'Window AC - 1.5 Ton',
      category: 'Window AC',
      capacity: '1.5 Ton',
      price: 1199,
    },
  ],
  splitAC: [
    {
      id: 3,
      name: 'Split AC - 1 Ton',
      category: 'Split AC',
      capacity: '1 Ton',
      price: 1499,
    },
    {
      id: 4,
      name: 'Split AC - 1.5 Ton',
      category: 'Split AC',
      capacity: '1.5 Ton',
      price: 1899,
    },
    {
      id: 5,
      name: 'Split AC - 2 Ton',
      category: 'Split AC',
      capacity: '2 Ton',
      price: 2399,
    },
  ],
  oilHeater: [
    {
      id: 6,
      name: 'Oil Heater - 7 Fin',
      category: 'Oil Heater',
      capacity: '7 Fins',
      price: 799,
    },
  ],
}

// Test slug generation
console.log('[v0] Testing slug generation...\n')

// Test Window AC 1 Ton
const testProduct = products.windowAC[0]
const testSlug = `${testProduct.category.toLowerCase().replace(/\s+/g, '-')}-${testProduct.capacity.toLowerCase().replace(/\s+/g, '-')}`
console.log(`[v0] Product: ${testProduct.name}`)
console.log(`[v0] Generated slug: ${testSlug}`)
console.log(`[v0] Expected: window-ac-1-ton`)
console.log(`[v0] Match: ${testSlug === 'window-ac-1-ton' ? '✓' : '✗'}\n`)

// Generate all static params
console.log('[v0] Generating all static params...\n')
const params = []

// Cooling products
const coolingProducts = [...products.windowAC, ...products.splitAC]
for (const product of coolingProducts) {
  const slug = `${product.category.toLowerCase().replace(/\s+/g, '-')}-${product.capacity.toLowerCase().replace(/\s+/g, '-')}`
  params.push({ category: 'cooling', slug })
  console.log(`[v0] /cooling/products/${slug}`)
}

// Heating products
for (const product of products.oilHeater) {
  const slug = `${product.category.toLowerCase().replace(/\s+/g, '-')}-${product.capacity.toLowerCase().replace(/\s+/g, '-')}`
  params.push({ category: 'heating', slug })
  console.log(`[v0] /heating/products/${slug}`)
}

console.log(`\n[v0] Total routes generated: ${params.length}`)
console.log('[v0] Debug complete!')
