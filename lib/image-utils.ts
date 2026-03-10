/**
 * Image Utility Functions for ACRentService
 * Handles robust image loading with fallback mechanisms
 */

/**
 * Get the fallback image URL for a product category
 */
export function getFallbackImageUrl(category: string): string {
  const fallbackImages: Record<string, string> = {
    cooling: '/fallback/cooling-unit.jpg',
    'window-ac': '/fallback/window-ac.jpg',
    'split-ac': '/fallback/split-ac.jpg',
    heating: '/fallback/heating-unit.jpg',
    'oil-heater': '/fallback/oil-heater.jpg',
    portable: '/fallback/portable-unit.jpg',
    default: '/fallback/product-default.jpg'
  }

  return fallbackImages[category.toLowerCase()] || fallbackImages.default
}

/**
 * Generate a Supabase storage image URL with error handling
 */
export function getStorageImageUrl(
  bucket: string,
  path: string | null | undefined,
  fallbackCategory?: string
): string {
  // If no path provided, use fallback
  if (!path || path.trim() === '') {
    return getFallbackImageUrl(fallbackCategory || 'default')
  }

  // Construct Supabase storage URL
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) {
    return getFallbackImageUrl(fallbackCategory || 'default')
  }

  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`
}

/**
 * Handle image error with fallback
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackUrl: string
): void {
  const img = event.currentTarget as HTMLImageElement
  if (img.src !== fallbackUrl) {
    img.src = fallbackUrl
  }
}

/**
 * Preload an image to check if it exists and is accessible
 */
export async function preloadImage(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = url
  })
}

/**
 * Get the best available image URL from multiple options
 */
export async function getBestImageUrl(
  primaryUrl: string | null | undefined,
  fallbackUrls: string[] = [],
  finalFallback: string
): Promise<string> {
  const urlsToTry = [
    primaryUrl,
    ...fallbackUrls,
    finalFallback
  ].filter(Boolean) as string[]

  for (const url of urlsToTry) {
    const isAccessible = await preloadImage(url)
    if (isAccessible) {
      return url
    }
  }

  return finalFallback
}
