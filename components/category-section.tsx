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
        <div className="mb-12 md:mb-16">
          <div className="space-y-3 mb-6">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest animate-fadeIn" style={{ animationFillMode: 'both' }}>
              {isCooling ? 'Cooling Solutions' : 'Heating Solutions'}
            </p>
            <h3 className="text-3xl md:text-4xl font-bold text-pretty animate-fadeIn" style={{ animationFillMode: 'both', animationDelay: '0.05s' }}>
              {title}
            </h3>
          </div>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed animate-fadeIn" style={{ animationFillMode: 'both', animationDelay: '0.1s' }}>
            {description}
          </p>
        </div>
        <div className="animate-slideInUp" style={{ animationFillMode: 'both', animationDelay: '0.2s' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
