"use client"

import { useEffect, useState } from "react"

interface FinalMessageProps {
  onReplay: () => void
}

export default function FinalMessage({ onReplay }: FinalMessageProps) {
  const [showMessage, setShowMessage] = useState(false)
  const [showHeart, setShowHeart] = useState(false)
  const [showReplay, setShowReplay] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setShowHeart(true), 500)
    const t2 = setTimeout(() => setShowMessage(true), 1500)
    const t3 = setTimeout(() => setShowReplay(true), 3500)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center h-full w-full relative px-4">
      {/* Floating hearts background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${(i * 29 + 10) % 100}%`,
              bottom: -20,
              animation: `floatUp ${4 + (i % 3) * 2}s ease-in-out infinite`,
              animationDelay: `${(i * 0.5) % 4}s`,
              opacity: 0.4,
              fontSize: 12 + (i % 3) * 6,
              color: "hsl(var(--primary))",
            }}
          >
            <svg
              width={12 + (i % 3) * 6}
              height={12 + (i % 3) * 6}
              viewBox="0 0 16 16"
              fill="currentColor"
              style={{ imageRendering: "pixelated" }}
            >
              <rect x="1" y="3" width="2" height="2" />
              <rect x="3" y="1" width="4" height="2" />
              <rect x="3" y="3" width="4" height="2" />
              <rect x="1" y="5" width="6" height="2" />
              <rect x="9" y="1" width="4" height="2" />
              <rect x="9" y="3" width="4" height="2" />
              <rect x="7" y="3" width="2" height="2" />
              <rect x="7" y="5" width="6" height="2" />
              <rect x="13" y="3" width="2" height="4" />
              <rect x="3" y="7" width="10" height="2" />
              <rect x="5" y="9" width="6" height="2" />
              <rect x="7" y="11" width="2" height="2" />
            </svg>
          </div>
        ))}
      </div>

      {/* Big pixel heart */}
      {showHeart && (
        <div
          style={{
            animation: "heartBeat 2s ease-in-out infinite, fadeIn 1s ease-out",
            marginBottom: 24,
          }}
        >
          <svg
            width="80"
            height="80"
            viewBox="0 0 16 16"
            fill="hsl(var(--primary))"
            style={{ imageRendering: "pixelated" }}
          >
            <rect x="1" y="3" width="2" height="2" />
            <rect x="3" y="1" width="4" height="2" />
            <rect x="3" y="3" width="4" height="2" />
            <rect x="1" y="5" width="6" height="2" />
            <rect x="9" y="1" width="4" height="2" />
            <rect x="9" y="3" width="4" height="2" />
            <rect x="7" y="3" width="2" height="2" />
            <rect x="7" y="5" width="6" height="2" />
            <rect x="13" y="3" width="2" height="4" />
            <rect x="3" y="7" width="10" height="2" />
            <rect x="5" y="9" width="6" height="2" />
            <rect x="7" y="11" width="2" height="2" />
          </svg>
        </div>
      )}

      {/* Main message */}
      {showMessage && (
        <div style={{ animation: "slideUp 1s ease-out" }}>
          <h1
            className="text-pixel text-primary text-center leading-relaxed mb-4"
            style={{
              fontSize: "14px",
              textShadow: "2px 2px 0px rgba(0,0,0,0.5)",
              lineHeight: 2,
            }}
          >
            {"Hani,"}
          </h1>
          <p
            className="text-pixel text-foreground text-center leading-relaxed mb-2"
            style={{
              fontSize: "12px",
              textShadow: "1px 1px 0px rgba(0,0,0,0.5)",
              lineHeight: 2.2,
            }}
          >
            {"every day is"}
          </p>
          <p
            className="text-pixel text-primary text-center leading-relaxed"
            style={{
              fontSize: "14px",
              textShadow: "2px 2px 0px rgba(0,0,0,0.5)",
              lineHeight: 2,
            }}
          >
            {"valentine's day"}
          </p>
          <p
            className="text-pixel text-secondary text-center mt-3"
            style={{
              fontSize: "9px",
              textShadow: "1px 1px 0px rgba(0,0,0,0.5)",
            }}
          >
            {"with you."}
          </p>
        </div>
      )}

      {/* Replay button */}
      {showReplay && (
        <button
          onClick={onReplay}
          className="mt-12 text-pixel text-foreground bg-card pixel-border cursor-pointer hover:brightness-125 active:brightness-75 transition-all px-6 py-3"
          style={{
            fontSize: "8px",
            border: "3px solid hsl(var(--border))",
            animation: "fadeIn 1s ease-out",
          }}
        >
          {"REPLAY"}
        </button>
      )}

      {/* Float up animation */}
      <style jsx>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.4;
          }
          90% {
            opacity: 0.4;
          }
          100% {
            transform: translateY(-100vh) rotate(20deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
