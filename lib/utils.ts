import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateProductSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove non-word chars except space and dash
    .replace(/[\s_]+/g, "-")  // Replace spaces and underscores with dash
    .replace(/-+/g, "-");     // Replace multiple dashes with single dash
}
