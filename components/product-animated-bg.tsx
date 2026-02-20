'use client'

import { useEffect, useState } from 'react'

interface ProductAnimatedBgProps {
  type?: 'cooling' | 'heating'
}

export function ProductAnimatedBackground({ type = 'cooling' }: ProductAnimatedBgProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Determine colors based on product type
  const colors = type === 'heating' 
    ? {
        gradient1: 'from-orange-50 via-yellow-50 to-red-50 dark:from-orange-950 dark:via-yellow-950 dark:to-red-950',
        blob1: 'rgba(249, 115, 22, 0.4)',
        blob2: 'rgba(251, 146, 60, 0.4)',
        blob3: 'rgba(252, 165, 11, 0.3)',
        gradient1Val: 'rgba(249, 115, 22, 0.1), rgba(251, 146, 60, 0.1)',
        gradient2Val: 'rgba(245, 158, 11, 0.08), rgba(217, 119, 6, 0.08)',
      }
    : {
        gradient1: 'from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-blue-950 dark:to-cyan-950',
        blob1: 'rgba(59, 130, 246, 0.4)',
        blob2: 'rgba(34, 211, 238, 0.4)',
        blob3: 'rgba(147, 197, 253, 0.3)',
        gradient1Val: 'rgba(59, 130, 246, 0.1), rgba(34, 211, 238, 0.1)',
        gradient2Val: 'rgba(148, 163, 247, 0.08), rgba(56, 189, 248, 0.08)',
      }

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden">
      {/* Base Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient1}`} />

      {/* Animated Gradient Overlay - Primary */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `linear-gradient(-45deg, ${colors.gradient1Val})`,
          backgroundSize: '400% 400%',
          animation: 'gradient-shift 25s ease infinite',
        }}
      />

      {/* Secondary Gradient Wave */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `linear-gradient(45deg, ${colors.gradient2Val})`,
          backgroundSize: '500% 500%',
          animation: 'gradient-shift-reverse 30s ease infinite',
        }}
      />

      {/* Floating Blob 1 - Top Left */}
      <div
        className="absolute -top-72 -left-72 w-96 h-96 rounded-full opacity-20"
        style={{
          background: `radial-gradient(circle, ${colors.blob1} 0%, transparent 70%)`,
          animation: 'blob-float 15s ease-in-out infinite',
          filter: 'blur(60px)',
        }}
      />

      {/* Floating Blob 2 - Bottom Right */}
      <div
        className="absolute -bottom-72 -right-72 w-96 h-96 rounded-full opacity-20"
        style={{
          background: `radial-gradient(circle, ${colors.blob2} 0%, transparent 70%)`,
          animation: 'blob-float 18s ease-in-out infinite 2s',
          filter: 'blur(60px)',
        }}
      />

      {/* Floating Blob 3 - Top Right */}
      <div
        className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-15"
        style={{
          background: `radial-gradient(circle, ${colors.blob3} 0%, transparent 70%)`,
          animation: 'blob-float 20s ease-in-out infinite 1s',
          filter: 'blur(50px)',
        }}
      />

      {/* Soft Radial Glow - Center */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 60%)',
          filter: 'blur(120px)',
          pointerEvents: 'none',
        }}
      />

      {/* Interactive Mouse Glow - Subtle */}
      <div
        className="absolute w-80 h-80 rounded-full pointer-events-none"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 60%)',
          filter: 'blur(80px)',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}
      />

      <style jsx>{`
        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes gradient-shift-reverse {
          0% {
            background-position: 100% 50%;
          }
          50% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 50%;
          }
        }

        @keyframes blob-float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-40px) translateX(30px);
          }
          50% {
            transform: translateY(-80px) translateX(-30px);
          }
          75% {
            transform: translateY(-40px) translateX(30px);
          }
        }
      `}</style>
    </div>
  )
}
