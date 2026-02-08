'use client'

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-blue-950 dark:to-cyan-950" />

      {/* Animated Gradient Overlay - Smooth */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'linear-gradient(-45deg, rgba(59, 130, 246, 0.08), rgba(34, 211, 238, 0.08))',
          backgroundSize: '400% 400%',
          animation: 'gradient-shift 20s ease infinite',
        }}
      />

      {/* Floating Blob 1 - Top Left - Reduced */}
      <div
        className="absolute -top-60 -left-60 w-96 h-96 rounded-full opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
          animation: 'blob-float 15s ease-in-out infinite',
          filter: 'blur(50px)',
        }}
      />

      {/* Floating Blob 2 - Bottom Right - Reduced */}
      <div
        className="absolute -bottom-60 -right-60 w-96 h-96 rounded-full opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(34, 211, 238, 0.3) 0%, transparent 70%)',
          animation: 'blob-float 18s ease-in-out infinite 2s',
          filter: 'blur(50px)',
        }}
      />

      {/* Soft Radial Glow - Center */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.04) 0%, transparent 60%)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
