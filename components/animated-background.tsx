'use client'

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-blue-950 dark:to-cyan-950" />

      {/* Animated Gradient Overlay */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: 'linear-gradient(-45deg, rgba(59, 130, 246, 0.1), rgba(34, 211, 238, 0.1), rgba(59, 130, 246, 0.1))',
          backgroundSize: '400% 400%',
          animation: 'gradient-shift 15s ease infinite',
        }}
      />

      {/* Floating Blob 1 - Top Left */}
      <div
        className="absolute -top-40 -left-40 w-80 h-80 rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)',
          animation: 'blob-float 8s ease-in-out infinite',
          filter: 'blur(40px)',
        }}
      />

      {/* Floating Blob 2 - Top Right */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(34, 211, 238, 0.4) 0%, transparent 70%)',
          animation: 'blob-float 10s ease-in-out infinite 1s',
          filter: 'blur(40px)',
        }}
      />

      {/* Floating Blob 3 - Bottom Left */}
      <div
        className="absolute -bottom-40 -left-32 w-96 h-96 rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
          animation: 'blob-float 12s ease-in-out infinite 2s',
          filter: 'blur(40px)',
        }}
      />

      {/* Floating Blob 4 - Bottom Right */}
      <div
        className="absolute -bottom-32 -right-40 w-80 h-80 rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(34, 211, 238, 0.4) 0%, transparent 70%)',
          animation: 'blob-float 9s ease-in-out infinite 3s',
          filter: 'blur(40px)',
        }}
      />

      {/* Shimmer Lines */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Vertical shimmer line 1 */}
        <div
          className="absolute w-1 h-full"
          style={{
            left: '25%',
            background: 'linear-gradient(to bottom, transparent, rgba(59, 130, 246, 0.2), transparent)',
            animation: 'shimmer 4s ease-in-out infinite',
            opacity: 0.3,
          }}
        />
        
        {/* Vertical shimmer line 2 */}
        <div
          className="absolute w-1 h-full"
          style={{
            left: '75%',
            background: 'linear-gradient(to bottom, transparent, rgba(34, 211, 238, 0.2), transparent)',
            animation: 'shimmer 5s ease-in-out infinite 1.5s',
            opacity: 0.3,
          }}
        />

        {/* Horizontal shimmer line */}
        <div
          className="absolute w-full h-1"
          style={{
            top: '40%',
            background: 'linear-gradient(to right, transparent, rgba(59, 130, 246, 0.1), transparent)',
            animation: 'shimmer 6s ease-in-out infinite 2s',
            opacity: 0.2,
          }}
        />
      </div>

      {/* Grid Pattern Overlay - subtle */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(0deg, transparent 24%, rgba(59, 130, 246, 0.05) 25%, rgba(59, 130, 246, 0.05) 26%, transparent 27%, transparent 74%, rgba(59, 130, 246, 0.05) 75%, rgba(59, 130, 246, 0.05) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(59, 130, 246, 0.05) 25%, rgba(59, 130, 246, 0.05) 26%, transparent 27%, transparent 74%, rgba(59, 130, 246, 0.05) 75%, rgba(59, 130, 246, 0.05) 76%, transparent 77%, transparent)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Radial Glow - Center */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
