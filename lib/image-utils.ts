/**
 * Image Utility Functions for ACRentService
 * Handles robust image loading with fallback mechanisms
 */

/**
 * Get the fallback image URL for a product category
 */
export function getFallbackImageUrl(category: string): string {
  const fallbackImages: Record<string, string> = {
    cooling: '/modern-white-window-air-conditioner-unit.jpg',
    'window-ac': '/modern-white-window-air-conditioner-unit.jpg',
    'window ac': '/modern-white-window-air-conditioner-unit.jpg',
    'window_ac': '/modern-white-window-air-conditioner-unit.jpg',
    'split-ac': '/modern-white-split-air-conditioner-indoor-unit.jpg',
    'split ac': '/modern-white-split-air-conditioner-indoor-unit.jpg',
    'split_ac': '/modern-white-split-air-conditioner-indoor-unit.jpg',
    heating: '/7-fin-oil-heater-radiator-with-wheels.jpg',
    'oil-heater': '/7-fin-oil-heater-radiator-with-wheels.jpg',
    'oil heater': '/7-fin-oil-heater-radiator-with-wheels.jpg',
    'oil_heater': '/7-fin-oil-heater-radiator-with-wheels.jpg',
    default: '/modern-air-conditioner-and-heater-in-luxury-home-i.jpg'
  }

  // Handle case-insensitive and dash/underscore variations
  const key = category.toLowerCase().trim();
  return fallbackImages[key] || fallbackImages.default
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
