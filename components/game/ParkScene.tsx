"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface ParkSceneProps {
  onEnterBooth: () => void
}

const GAME_WIDTH = 380
const GAME_HEIGHT = 500
const CHAR_SIZE = 32
const MOVE_SPEED = 3
const BOOTH_X = GAME_WIDTH / 2 - 40
const BOOTH_Y = 60
const BOOTH_W = 80
const BOOTH_H = 100
const DOOR_X = BOOTH_X + 20
const DOOR_Y = BOOTH_Y + BOOTH_H - 30
const DOOR_W = 40
const DOOR_H = 30

export default function ParkScene({ onEnterBooth }: ParkSceneProps) {
  const [charX, setCharX] = useState(GAME_WIDTH / 2 - CHAR_SIZE / 2)
  const [charY, setCharY] = useState(GAME_HEIGHT - 100)
  const [facing, setFacing] = useState<"down" | "up" | "left" | "right">("up")
  const [walking, setWalking] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)
  const keysRef = useRef<Set<string>>(new Set())
  const animFrameRef = useRef<number>(0)
  const stepRef = useRef(0)

  const isNearDoor = useCallback(
    (x: number, y: number) => {
      const cx = x + CHAR_SIZE / 2
      const cy = y + CHAR_SIZE / 2
      return (
        cx > DOOR_X - 10 &&
        cx < DOOR_X + DOOR_W + 10 &&
        cy > DOOR_Y - 20 &&
        cy < DOOR_Y + DOOR_H + 20
      )
    },
    []
  )

  const canMove = useCallback(
    (nx: number, ny: number) => {
      // Boundary
      if (nx < 0 || nx > GAME_WIDTH - CHAR_SIZE || ny < 10 || ny > GAME_HEIGHT - CHAR_SIZE - 10) return false
      // Booth collision (but allow door)
      const cx = nx + CHAR_SIZE / 2
      const cy = ny + CHAR_SIZE
      if (
        cx > BOOTH_X &&
        cx < BOOTH_X + BOOTH_W &&
        cy > BOOTH_Y + 10 &&
        cy < BOOTH_Y + BOOTH_H &&
        !(cx > DOOR_X && cx < DOOR_X + DOOR_W && cy > DOOR_Y)
      ) {
        return false
      }
      return true
    },
    []
  )

  const gameLoop = useCallback(() => {
    const keys = keysRef.current
    let dx = 0
    let dy = 0
    if (keys.has("up")) { dy = -MOVE_SPEED; setFacing("up") }
    if (keys.has("down")) { dy = MOVE_SPEED; setFacing("down") }
    if (keys.has("left")) { dx = -MOVE_SPEED; setFacing("left") }
    if (keys.has("right")) { dx = MOVE_SPEED; setFacing("right") }

    if (dx !== 0 || dy !== 0) {
      setWalking(true)
      stepRef.current += 1
      setCharX((prev) => {
        const nx = prev + dx
        return canMove(nx, charY) ? nx : prev
      })
      setCharY((prev) => {
        const ny = prev + dy
        return canMove(charX, ny) ? ny : prev
      })
    } else {
      setWalking(false)
    }

    animFrameRef.current = requestAnimationFrame(gameLoop)
  }, [charX, charY, canMove])

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(gameLoop)
    return () => cancelAnimationFrame(animFrameRef.current)
  }, [gameLoop])

  useEffect(() => {
    setShowPrompt(isNearDoor(charX, charY))
  }, [charX, charY, isNearDoor])

  // Keyboard controls
  useEffect(() => {
    const keyMap: Record<string, string> = {
      ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
      w: "up", s: "down", a: "left", d: "right",
    }
    const handleDown = (e: KeyboardEvent) => {
      const dir = keyMap[e.key]
      if (dir) { keysRef.current.add(dir); e.preventDefault() }
      if (e.key === "Enter" && showPrompt) onEnterBooth()
    }
    const handleUp = (e: KeyboardEvent) => {
      const dir = keyMap[e.key]
      if (dir) keysRef.current.delete(dir)
    }
    window.addEventListener("keydown", handleDown)
    window.addEventListener("keyup", handleUp)
    return () => {
      window.removeEventListener("keydown", handleDown)
      window.removeEventListener("keyup", handleUp)
    }
  }, [showPrompt, onEnterBooth])

  const handleDpad = useCallback(
    (dir: string, pressed: boolean) => {
      if (pressed) {
        keysRef.current.add(dir)
      } else {
        keysRef.current.delete(dir)
      }
    },
    []
  )

  const walkFrame = walking ? Math.floor(stepRef.current / 8) % 2 : 0

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      {/* Game viewport */}
      <div
        className="relative overflow-hidden"
        style={{
          width: GAME_WIDTH,
          height: GAME_HEIGHT,
          maxWidth: "100vw",
          background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 40%, #1a472a 60%, #2d5a27 100%)",
        }}
      >
        {/* Stars */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute rounded-full"
            style={{
              width: 2,
              height: 2,
              backgroundColor: "#fff",
              left: `${(i * 47 + 11) % 100}%`,
              top: `${(i * 19 + 5) % 45}%`,
              animation: `twinkle ${1.5 + (i % 3) * 0.5}s ease-in-out infinite`,
              animationDelay: `${(i * 0.3) % 2}s`,
            }}
          />
        ))}

        {/* Moon */}
        <div
          className="absolute rounded-full"
          style={{
            width: 30,
            height: 30,
            background: "#fffde7",
            top: 25,
            right: 40,
            boxShadow: "0 0 15px 5px rgba(255,253,231,0.3)",
          }}
        />

        {/* Ground */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ height: "45%", background: "#2d5a27" }}
        />
        {/* Path */}
        <div
          className="absolute"
          style={{
            width: 50,
            bottom: 0,
            top: "55%",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#8B7355",
            borderLeft: "3px solid #6B5B3F",
            borderRight: "3px solid #6B5B3F",
          }}
        />

        {/* Trees */}
        <PixelTree x={30} y={180} />
        <PixelTree x={GAME_WIDTH - 70} y={200} />
        <PixelTree x={60} y={320} />
        <PixelTree x={GAME_WIDTH - 90} y={340} />
        <PixelTree x={20} y={420} />
        <PixelTree x={GAME_WIDTH - 50} y={430} />

        {/* Flowers */}
        {[
          { x: 100, y: 300, c: "#ff6b9d" },
          { x: 280, y: 350, c: "#ff6b9d" },
          { x: 130, y: 420, c: "#ffa8cc" },
          { x: 250, y: 280, c: "#ffa8cc" },
          { x: 90, y: 380, c: "#ff4081" },
          { x: 300, y: 440, c: "#ff4081" },
        ].map((f, i) => (
          <div
            key={`flower-${i}`}
            className="absolute"
            style={{ left: f.x, top: f.y }}
          >
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: f.c }} />
            <div
              style={{
                width: 2,
                height: 6,
                background: "#4CAF50",
                margin: "0 auto",
              }}
            />
          </div>
        ))}

        {/* Photobooth */}
        <div
          className="absolute"
          style={{
            left: BOOTH_X,
            top: BOOTH_Y,
            width: BOOTH_W,
            height: BOOTH_H,
          }}
        >
          {/* Booth body */}
          <div
            className="absolute inset-0"
            style={{
              background: "#5c3a6e",
              border: "3px solid #3d2548",
              imageRendering: "pixelated",
            }}
          >
            {/* Roof */}
            <div
              style={{
                position: "absolute",
                top: -12,
                left: -6,
                right: -6,
                height: 16,
                background: "#7b4f9e",
                border: "3px solid #5c3a6e",
              }}
            />
            {/* Sign */}
            <div
              className="text-pixel text-center"
              style={{
                position: "absolute",
                top: 8,
                left: 0,
                right: 0,
                fontSize: "5px",
                color: "#ffd700",
                textShadow: "1px 1px 0px rgba(0,0,0,0.8)",
              }}
            >
              {"PHOTO"}
            </div>
            <div
              className="text-pixel text-center"
              style={{
                position: "absolute",
                top: 18,
                left: 0,
                right: 0,
                fontSize: "5px",
                color: "#ffd700",
                textShadow: "1px 1px 0px rgba(0,0,0,0.8)",
              }}
            >
              {"BOOTH"}
            </div>
            {/* Hearts on booth */}
            <div
              className="absolute"
              style={{ top: 32, left: 10, width: 6, height: 6, color: "#ff6b9d", fontSize: 8 }}
            >
              {"*"}
            </div>
            <div
              className="absolute"
              style={{ top: 32, right: 10, width: 6, height: 6, color: "#ff6b9d", fontSize: 8 }}
            >
              {"*"}
            </div>
            {/* Door */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 20,
                width: DOOR_W,
                height: DOOR_H,
                background: "#2a1535",
                border: "2px solid #1a0d22",
              }}
            >
              {/* Curtain effect */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 8,
                  background: "#8B4513",
                  borderBottom: "2px solid #654321",
                }}
              />
            </div>
          </div>
        </div>

        {/* Enter prompt */}
        {showPrompt && (
          <div
            className="absolute text-pixel text-center"
            style={{
              left: BOOTH_X - 20,
              top: BOOTH_Y + BOOTH_H + 4,
              width: BOOTH_W + 40,
              fontSize: "6px",
              color: "#ffd700",
              animation: "float 1.5s ease-in-out infinite",
              textShadow: "1px 1px 0px rgba(0,0,0,0.8)",
            }}
          >
            {"PRESS ENTER"}
          </div>
        )}

        {/* Character */}
        <div
          className="absolute"
          style={{
            left: charX,
            top: charY,
            width: CHAR_SIZE,
            height: CHAR_SIZE,
            zIndex: 10,
            transition: "none",
          }}
        >
          <PixelCharacter facing={facing} walkFrame={walkFrame} />
        </div>

        {/* Lamp posts */}
        <div className="absolute" style={{ left: 150, top: 250 }}>
          <div style={{ width: 4, height: 30, background: "#555", margin: "0 auto" }} />
          <div
            style={{
              width: 12,
              height: 8,
              background: "#ffd700",
              borderRadius: "50% 50% 0 0",
              margin: "-2px auto 0",
              boxShadow: "0 0 10px 3px rgba(255,215,0,0.3)",
            }}
          />
        </div>
        <div className="absolute" style={{ left: GAME_WIDTH - 160, top: 260 }}>
          <div style={{ width: 4, height: 30, background: "#555", margin: "0 auto" }} />
          <div
            style={{
              width: 12,
              height: 8,
              background: "#ffd700",
              borderRadius: "50% 50% 0 0",
              margin: "-2px auto 0",
              boxShadow: "0 0 10px 3px rgba(255,215,0,0.3)",
            }}
          />
        </div>
      </div>

      {/* D-Pad */}
      <DPad onDirection={handleDpad} onAction={showPrompt ? onEnterBooth : undefined} />
    </div>
  )
}

function PixelCharacter({ facing, walkFrame }: { facing: string; walkFrame: number }) {
  const hairOffset = walkFrame === 1 ? -1 : 0

  return (
    <svg width="32" height="32" viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
      {/* Hair - black long hair */}
      <rect x="5" y={1 + hairOffset} width="6" height="2" fill="#1a1a1a" />
      <rect x="4" y={2 + hairOffset} width="8" height="2" fill="#1a1a1a" />
      {/* Face */}
      <rect x="5" y="3" width="6" height="3" fill="#ffd5b4" />
      {/* Eyes */}
      {facing === "up" ? null : (
        <>
          <rect x="6" y="4" width="1" height="1" fill="#333" />
          <rect x="9" y="4" width="1" height="1" fill="#333" />
        </>
      )}
      {/* Hair sides - long */}
      <rect x="4" y="3" width="1" height="5" fill="#1a1a1a" />
      <rect x="11" y="3" width="1" height="5" fill="#1a1a1a" />
      {/* Body - pastel purple top */}
      <rect x="5" y="6" width="6" height="4" fill="#c9a0dc" />
      <rect x="4" y="7" width="1" height="2" fill="#c9a0dc" />
      <rect x="11" y="7" width="1" height="2" fill="#c9a0dc" />
      {/* Arms */}
      <rect x="3" y="7" width="1" height="3" fill="#ffd5b4" />
      <rect x="12" y="7" width="1" height="3" fill="#ffd5b4" />
      {/* Legs */}
      {walkFrame === 0 ? (
        <>
          <rect x="6" y="10" width="2" height="3" fill="#ffd5b4" />
          <rect x="8" y="10" width="2" height="3" fill="#ffd5b4" />
          {/* Red shoes */}
          <rect x="5" y="13" width="3" height="2" fill="#e53935" />
          <rect x="8" y="13" width="3" height="2" fill="#e53935" />
        </>
      ) : (
        <>
          <rect x="5" y="10" width="2" height="3" fill="#ffd5b4" />
          <rect x="9" y="10" width="2" height="3" fill="#ffd5b4" />
          <rect x="4" y="13" width="3" height="2" fill="#e53935" />
          <rect x="9" y="13" width="3" height="2" fill="#e53935" />
        </>
      )}
    </svg>
  )
}

function PixelTree({ x, y }: { x: number; y: number }) {
  return (
    <div className="absolute" style={{ left: x, top: y }}>
      {/* Canopy */}
      <div
        style={{
          width: 30,
          height: 24,
          background: "#2e7d32",
          borderRadius: "50% 50% 20% 20%",
          border: "2px solid #1b5e20",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -8,
            left: 6,
            width: 18,
            height: 14,
            background: "#388e3c",
            borderRadius: "50%",
          }}
        />
      </div>
      {/* Trunk */}
      <div
        style={{
          width: 8,
          height: 16,
          background: "#5D4037",
          margin: "0 auto",
          border: "1px solid #3E2723",
        }}
      />
    </div>
  )
}

function DPad({
  onDirection,
  onAction,
}: {
  onDirection: (dir: string, pressed: boolean) => void
  onAction?: () => void
}) {
  const btnStyle = {
    width: 48,
    height: 48,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    userSelect: "none" as const,
    touchAction: "none" as const,
  }

  const handlePointerDown = (dir: string) => (e: React.PointerEvent) => {
    e.preventDefault()
    onDirection(dir, true)
  }
  const handlePointerUp = (dir: string) => (e: React.PointerEvent) => {
    e.preventDefault()
    onDirection(dir, false)
  }
  const handlePointerLeave = (dir: string) => (e: React.PointerEvent) => {
    e.preventDefault()
    onDirection(dir, false)
  }

  return (
    <div className="flex items-center gap-8 mt-4 select-none">
      {/* D-pad */}
      <div className="grid grid-cols-3 gap-0" style={{ width: 144, height: 144 }}>
        <div />
        <button
          onPointerDown={handlePointerDown("up")}
          onPointerUp={handlePointerUp("up")}
          onPointerLeave={handlePointerLeave("up")}
          className="bg-card pixel-border-light text-foreground cursor-pointer active:brightness-75"
          style={btnStyle}
          aria-label="Move up"
        >
          {"^"}
        </button>
        <div />
        <button
          onPointerDown={handlePointerDown("left")}
          onPointerUp={handlePointerUp("left")}
          onPointerLeave={handlePointerLeave("left")}
          className="bg-card pixel-border-light text-foreground cursor-pointer active:brightness-75"
          style={btnStyle}
          aria-label="Move left"
        >
          {"<"}
        </button>
        <div className="bg-muted" style={{ width: 48, height: 48 }} />
        <button
          onPointerDown={handlePointerDown("right")}
          onPointerUp={handlePointerUp("right")}
          onPointerLeave={handlePointerLeave("right")}
          className="bg-card pixel-border-light text-foreground cursor-pointer active:brightness-75"
          style={btnStyle}
          aria-label="Move right"
        >
          {">"}
        </button>
        <div />
        <button
          onPointerDown={handlePointerDown("down")}
          onPointerUp={handlePointerUp("down")}
          onPointerLeave={handlePointerLeave("down")}
          className="bg-card pixel-border-light text-foreground cursor-pointer active:brightness-75"
          style={btnStyle}
          aria-label="Move down"
        >
          {"v"}
        </button>
        <div />
      </div>

      {/* Action button */}
      {onAction && (
        <button
          onClick={onAction}
          className="bg-primary text-primary-foreground text-pixel pixel-border cursor-pointer active:brightness-75 rounded-full flex items-center justify-center"
          style={{ width: 56, height: 56, fontSize: "8px" }}
          aria-label="Enter photobooth"
        >
          {"A"}
        </button>
      )}
    </div>
  )
}
