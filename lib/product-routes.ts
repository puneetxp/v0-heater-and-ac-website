// Product routing utilities for SEO-friendly category-based URLs

export type ProductCategory = 'cooling' | 'heating'
export type CoolingSubcategory = 'window-ac' | 'split-ac'
export type HeatingSubcategory = 'oil-heater'

export interface ProductRoute {
  id: string | number
  category: ProductCategory
  subcategory: CoolingSubcategory | HeatingSubcategory
  slug: string
}

// Map product types to categories and subcategories
const categoryMap: Record<string, { category: ProductCategory; subcategory: CoolingSubcategory | HeatingSubcategory }> = {
  'Window AC': { category: 'cooling', subcategory: 'window-ac' },
  'Split AC': { category: 'cooling', subcategory: 'split-ac' },
  'Oil Heater': { category: 'heating', subcategory: 'oil-heater' },
}

// Convert product name to URL slug
export function createSlug(name: string, capacity: string): string {
  // Clean up name: convert to lowercase and hyphenate
  let cleanName = name.toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^\w-]/g, '') // Remove special characters

  // Clean up capacity: convert to lowercase and hyphenate
  let cleanCapacity = capacity.toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^\w-]/g, '') // Remove special characters

  // If cleanName already ends with cleanCapacity, don't repeat it
  if (cleanName.endsWith(cleanCapacity) || cleanName.endsWith(cleanCapacity.split('-')[0])) {
    return cleanName
  }

  // Combine name and capacity only if capacity isn't already in the name
  const combinedSlug = `${cleanName}-${cleanCapacity}`
  
  // Remove any double hyphens that might have been created
  return combinedSlug.replace(/-+/g, '-')
}

// Get category info from product details
export function getCategoryInfo(productCategory: string): { category: ProductCategory; subcategory: CoolingSubcategory | HeatingSubcategory } | null {
  return categoryMap[productCategory] || null
}

// Generate product URL
export function generateProductUrl(productId: string | number, productCategory: string, productName: string, capacity: string): string {
  const categoryInfo = getCategoryInfo(productCategory)
  if (!categoryInfo) return `/product/${productId}`

  const slug = createSlug(productName, capacity)
  return `/${categoryInfo.category}/${categoryInfo.subcategory}/${slug}`
}

// Parse category URL to get routing info
export function parseCategoryUrl(category: string, subcategory: string): { category: ProductCategory; subcategory: CoolingSubcategory | HeatingSubcategory } | null {
  const validCategory = ['cooling', 'heating'].includes(category) ? (category as ProductCategory) : null
  if (!validCategory) return null

  const validSubcategories: Record<string, boolean> = {
    'window-ac': true,
    'split-ac': true,
    'oil-heater': true,
  }

  if (!validSubcategories[subcategory]) return null

  return {
    category: validCategory,
    subcategory: subcategory as CoolingSubcategory | HeatingSubcategory,
  }
}
