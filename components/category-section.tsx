'use client'

import { ReactNode } from 'react'

interface CategorySectionProps {
  title: string
  description: string
  category: 'cooling' | 'heating'
  children: ReactNode
}

export function CategorySection({
  title,
  description,
  category,
  children,
}: CategorySectionProps) {
  const isCooling = category === 'cooling'

  return (
    <div className="relative py-16 md:py-20 lg:py-24 mb-4">
      {/* Category-specific background animation */}
      <div className="absolute inset-0 -z-40 overflow-hidden">
        {isCooling ? (
          // Cooling Background - Subtle blue downward flow
          <>
            <div
              className="absolute top-0 left-1/3 w-80 h-80 rounded-full opacity-8"
              style={{
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)',
                animation: 'cool-flow 8s ease-in-out infinite',
                filter: 'blur(60px)',
              }}
            />
            <div
              className="absolute top-20 right-1/4 w-64 h-64 rounded-full opacity-6"
              style={{
                background: 'radial-gradient(circle, rgba(34, 211, 238, 0.3) 0%, transparent 70%)',
                animation: 'cool-flow 10s ease-in-out infinite 1s',
                filter: 'blur(50px)',
              }}
            />
            {/* Subtle grid overlay for cooling */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                                  linear-gradient(0deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
              }}
            />
          </>
        ) : (
          // Heating Background - Subtle orange/red upward flow
          <>
            <div
              className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full opacity-8"
              style={{
                background: 'radial-gradient(circle, rgba(234, 88, 12, 0.4) 0%, transparent 70%)',
                animation: 'heat-flow 8s ease-in-out infinite',
                filter: 'blur(60px)',
              }}
            />
            <div
              className="absolute bottom-20 right-1/3 w-64 h-64 rounded-full opacity-6"
              style={{
                background: 'radial-gradient(circle, rgba(251, 146, 60, 0.3) 0%, transparent 70%)',
                animation: 'heat-flow 10s ease-in-out infinite 1s',
                filter: 'blur(50px)',
              }}
            />
            {/* Subtle grid overlay for heating */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `linear-gradient(90deg, rgba(234, 88, 12, 0.1) 1px, transparent 1px),
                                  linear-gradient(0deg, rgba(234, 88, 12, 0.1) 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
              }}
            />
          </>
        )}
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-7xl relative z-10 px-4 md:px-6 lg:px-8">
        <div className="mb-10 md:mb-12">
          <h3 className="text-2xl md:text-3xl font-bold mb-3 animate-fadeIn" style={{ animationFillMode: 'both' }}>
            {title}
          </h3>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl animate-fadeIn" style={{ animationFillMode: 'both', animationDelay: '0.1s' }}>
            {description}
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}
