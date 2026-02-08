'use client'

import { useEffect, useState } from 'react'

interface Snowflake {
  id: number
  left: number
  delay: number
  duration: number
  size: number
}

export function Snowflakes() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([])

  useEffect(() => {
    const generateSnowflakes = () => {
      const flakes: Snowflake[] = []
      for (let i = 0; i < 50; i++) {
        flakes.push({
          id: i,
          left: Math.random() * 100,
          delay: Math.random() * 2,
          duration: 8 + Math.random() * 4,
          size: 10 + Math.random() * 20,
        })
      }
      setSnowflakes(flakes)
    }

    generateSnowflakes()
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute animate-snowfall"
          style={{
            left: `${flake.left}%`,
            top: '-10px',
            fontSize: `${flake.size}px`,
            opacity: 0.8,
            animation: `snowfall ${flake.duration}s linear ${flake.delay}s infinite`,
          }}
        >
          ❄️
        </div>
      ))}
    </div>
  )
}
