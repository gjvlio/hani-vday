"use client"

import { useEffect, useState } from "react"
import { playStartChime } from "@/lib/audio"

interface TitleScreenProps {
  onStart: () => void
  onMusicStart: () => void
}

export default function TitleScreen({ onStart, onMusicStart }: TitleScreenProps) {
  const [showPress, setShowPress] = useState(true)

  useEffect(() => {
    // Start music on first user interaction
    const startMusicOnInteraction = () => {
      onMusicStart()
      document.removeEventListener("click", startMusicOnInteraction)
      document.removeEventListener("touchstart", startMusicOnInteraction)
    }

    document.addEventListener("click", startMusicOnInteraction)
    document.addEventListener("touchstart", startMusicOnInteraction)

    return () => {
      document.removeEventListener("click", startMusicOnInteraction)
      document.removeEventListener("touchstart", startMusicOnInteraction)
    }
  }, [onMusicStart])

  useEffect(() => {
    const interval = setInterval(() => {
      setShowPress((prev) => !prev)
    }, 600)
    return () => clearInterval(interval)
  }, [])

  const handleStart = () => {
    playStartChime()
    setTimeout(() => onStart(), 400)
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full relative">
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-foreground"
            style={{
              width: i % 3 === 0 ? 3 : 2,
              height: i % 3 === 0 ? 3 : 2,
              left: `${(i * 37 + 13) % 100}%`,
              top: `${(i * 23 + 7) % 100}%`,
              animation: `twinkle ${1.5 + (i % 3) * 0.5}s ease-in-out infinite`,
              animationDelay: `${(i * 0.2) % 2}s`,
            }}
          />
        ))}
      </div>

      {/* Pixel heart decoration */}
      <div className="relative mb-6" style={{ animation: "heartBeat 2s ease-in-out infinite" }}>
        <PixelHeart size={64} />
      </div>

      {/* Title */}
      <h1
        className="text-pixel text-primary text-center leading-relaxed mb-2"
        style={{ fontSize: "20px", textShadow: "2px 2px 0px rgba(0,0,0,0.5)" }}
      >
        {"For Hani"}
      </h1>

      <p
        className="text-pixel text-secondary text-center mb-16"
        style={{ fontSize: "8px", textShadow: "1px 1px 0px rgba(0,0,0,0.5)" }}
      >
        {"a valentine's surprise"}
      </p>

      {/* Press Start */}
      <button
        onClick={handleStart}
        className="text-pixel text-foreground text-center cursor-pointer bg-transparent border-none"
        style={{
          fontSize: "10px",
          opacity: showPress ? 1 : 0,
          transition: "opacity 0.1s",
          textShadow: "1px 1px 0px rgba(0,0,0,0.5)",
        }}
      >
        {"- PRESS START -"}
      </button>

      {/* Small hearts at bottom */}
      <div className="absolute bottom-8 flex gap-4">
        <PixelHeart size={12} />
        <PixelHeart size={12} />
        <PixelHeart size={12} />
      </div>
    </div>
  )
}

function PixelHeart({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ imageRendering: "pixelated" }}
    >
      {/* Left bump - row 1 */}
      <rect x="2" y="2" width="2" height="2" fill="hsl(var(--primary))" />
      <rect x="4" y="2" width="2" height="2" fill="hsl(var(--primary))" />
      
      {/* Right bump - row 1 */}
      <rect x="10" y="2" width="2" height="2" fill="hsl(var(--primary))" />
      <rect x="12" y="2" width="2" height="2" fill="hsl(var(--primary))" />
      
      {/* Left bump - row 2 */}
      <rect x="1" y="4" width="2" height="2" fill="hsl(var(--primary))" />
      <rect x="3" y="4" width="2" height="2" fill="hsl(var(--primary))" />
      <rect x="5" y="4" width="2" height="2" fill="hsl(var(--primary))" />
      
      {/* Right bump - row 2 */}
      <rect x="9" y="4" width="2" height="2" fill="hsl(var(--primary))" />
      <rect x="11" y="4" width="2" height="2" fill="hsl(var(--primary))" />
      <rect x="13" y="4" width="2" height="2" fill="hsl(var(--primary))" />
      
      {/* Wide middle section - row 3 */}
      <rect x="1" y="6" width="2" height="2" fill="hsl(var(--primary))" />
      <rect x="3" y="6" width="10" height="2" fill="hsl(var(--primary))" />
      <rect x="13" y="6" width="2" height="2" fill="hsl(var(--primary))" />
      
      {/* Narrower section - row 4 */}
      <rect x="3" y="8" width="10" height="2" fill="hsl(var(--primary))" />
      
      {/* Even narrower - row 5 */}
      <rect x="5" y="10" width="6" height="2" fill="hsl(var(--primary))" />
      
      {/* Point - row 6 */}
      <rect x="7" y="12" width="2" height="2" fill="hsl(var(--primary))" />
    </svg>
  )
}
