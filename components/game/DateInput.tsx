"use client"

import { useState, useCallback, useRef } from "react"
import { playKeyPress, playError, playCorrect } from "@/lib/audio"

interface DateInputProps {
  onCorrect: () => void
}

const CORRECT_DATE = "10142023"

const WRONG_MESSAGES = [
  "di mo ba ako kilala, bb? :-(",
  "oh so you dont love me pala...",
  "luh??? sige po",
]

export default function DateInput({ onCorrect }: DateInputProps) {
  const [input, setInput] = useState("")
  const [shake, setShake] = useState(false)
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)
  const [wrongMsg, setWrongMsg] = useState("")
  const wrongIndexRef = useRef(0)

  const handleNumber = useCallback(
    (num: string) => {
      if (input.length >= 8 || success) return
      playKeyPress()
      const newInput = input + num
      setInput(newInput)
      setError(false)
      setWrongMsg("")

      if (newInput.length === 8) {
        if (newInput === CORRECT_DATE) {
          playCorrect()
          setSuccess(true)
          setTimeout(() => onCorrect(), 1200)
        } else {
          playError()
          setShake(true)
          setError(true)
          setWrongMsg(WRONG_MESSAGES[wrongIndexRef.current % WRONG_MESSAGES.length])
          wrongIndexRef.current += 1
          setTimeout(() => {
            setShake(false)
            setInput("")
            setError(false)
          }, 1600)
        }
      }
    },
    [input, onCorrect, success]
  )

  const handleDelete = useCallback(() => {
    if (success) return
    playKeyPress()
    setInput((prev) => prev.slice(0, -1))
    setError(false)
    setWrongMsg("")
  }, [success])

  // Format display: MM / DD / YYYY
  const formatDisplay = () => {
    const chars = input.split("")
    const slots = Array(8).fill("_")
    chars.forEach((c, i) => (slots[i] = c))
    return `${slots[0]}${slots[1]} / ${slots[2]}${slots[3]} / ${slots[4]}${slots[5]}${slots[6]}${slots[7]}`
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full px-4">
      {/* Question */}
      <p
        className="text-pixel text-foreground text-center mb-3 leading-relaxed"
        style={{ fontSize: "10px", textShadow: "1px 1px 0px rgba(0,0,0,0.5)" }}
      >
        {"When is our"}
      </p>
      <p
        className="text-pixel text-primary text-center mb-6 leading-relaxed"
        style={{ fontSize: "12px", textShadow: "1px 1px 0px rgba(0,0,0,0.5)" }}
      >
        {"anniversary?"}
      </p>

      {/* Date display */}
      <div
        className={`bg-card pixel-border px-6 py-4 mb-3 ${shake ? "animate-shake" : ""}`}
        style={{
          animation: shake ? "shake 0.3s ease-in-out 2" : undefined,
          borderColor: error
            ? "hsl(var(--destructive))"
            : success
              ? "#4caf50"
              : "hsl(var(--border))",
          borderWidth: 3,
          borderStyle: "solid",
          transition: "border-color 0.3s",
          background: success ? "rgba(76, 175, 80, 0.15)" : undefined,
        }}
      >
        <p
          className="text-pixel text-foreground text-center tracking-wider"
          style={{
            fontSize: "16px",
            letterSpacing: "3px",
            color: error
              ? "hsl(var(--destructive))"
              : success
                ? "#4caf50"
                : "hsl(var(--foreground))",
            transition: "color 0.3s",
          }}
        >
          {formatDisplay()}
        </p>
      </div>

      {/* Wrong message or hint */}
      <div style={{ minHeight: 28, marginBottom: 12 }}>
        {wrongMsg ? (
          <p
            className="text-pixel text-center"
            style={{
              fontSize: "7px",
              color: "hsl(var(--destructive))",
              animation: "fadeIn 0.3s ease-out",
              lineHeight: 1.8,
            }}
          >
            {wrongMsg}
          </p>
        ) : success ? (
          <p
            className="text-pixel text-center"
            style={{
              fontSize: "8px",
              color: "#4caf50",
              animation: "fadeIn 0.3s ease-out",
            }}
          >
            {"correct! <3"}
          </p>
        ) : (
          <p
            className="text-pixel text-muted-foreground text-center"
            style={{ fontSize: "7px" }}
          >
            {"MM / DD / YYYY"}
          </p>
        )}
      </div>

      {/* Number pad */}
      <div className="grid grid-cols-3 gap-2" style={{ maxWidth: 220 }}>
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
          <button
            key={num}
            onClick={() => handleNumber(num)}
            className="text-pixel text-foreground bg-card pixel-border-light flex items-center justify-center cursor-pointer hover:brightness-125 active:brightness-75 transition-all"
            style={{
              width: 56,
              height: 56,
              fontSize: "16px",
              border: "2px solid hsl(var(--border))",
            }}
          >
            {num}
          </button>
        ))}
        <button
          onClick={handleDelete}
          className="text-pixel text-destructive bg-card pixel-border-light flex items-center justify-center cursor-pointer hover:brightness-125 active:brightness-75 transition-all"
          style={{
            width: 56,
            height: 56,
            fontSize: "8px",
            border: "2px solid hsl(var(--border))",
          }}
        >
          {"DEL"}
        </button>
        <button
          onClick={() => handleNumber("0")}
          className="text-pixel text-foreground bg-card pixel-border-light flex items-center justify-center cursor-pointer hover:brightness-125 active:brightness-75 transition-all"
          style={{
            width: 56,
            height: 56,
            fontSize: "16px",
            border: "2px solid hsl(var(--border))",
          }}
        >
          {"0"}
        </button>
        <div style={{ width: 56, height: 56 }} />
      </div>

      {/* Shake animation */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out 2;
        }
      `}</style>
    </div>
  )
}
