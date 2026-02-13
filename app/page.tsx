"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import TitleScreen from "@/components/game/TitleScreen"
import DateInput from "@/components/game/DateInput"
import ParkScene from "@/components/game/ParkScene"
import PhotoBooth from "@/components/game/PhotoBooth"
import FinalMessage from "@/components/game/FinalMessage"
import { MusicPlayer } from "@/lib/audio"

type GameScreen = "title" | "date" | "park" | "photobooth" | "final"

// Music tracks for each scene:
// Title + Date: sweet retro chiptune vibe (/public/music/title.mp3)
// Park/Forest: different ambient track (/public/music/forest.mp3)
// Photobooth: user's uploaded songs (/public/music/booth1.mp3 and /public/music/booth2.mp3)

export default function Game() {
  const [screen, setScreen] = useState<GameScreen>("title")
  const titleMusicRef = useRef<MusicPlayer | null>(null)
  const forestMusicRef = useRef<MusicPlayer | null>(null)
  const boothMusicRef = useRef<MusicPlayer | null>(null)

  // Initialize music players once
  useEffect(() => {
    titleMusicRef.current = new MusicPlayer(["/music/title.mp3"], 0.3)
    forestMusicRef.current = new MusicPlayer(["/music/forest.mp3"], 0.35)
    boothMusicRef.current = new MusicPlayer(["/music/booth1.mp3", "/music/booth2.mp3"], 0.4)

    return () => {
      titleMusicRef.current?.stop()
      forestMusicRef.current?.stop()
      boothMusicRef.current?.stop()
    }
  }, [])

  const stopAllMusic = useCallback(() => {
    titleMusicRef.current?.stop()
    forestMusicRef.current?.stop()
    boothMusicRef.current?.stop()
  }, [])

  const handleTitleMusicStart = useCallback(() => {
    stopAllMusic()
    titleMusicRef.current?.play()
  }, [stopAllMusic])

  const handleStart = useCallback(() => {
    // Title music continues into date screen
    setScreen("date")
  }, [])

  const handleDateCorrect = useCallback(() => {
    // Switch to forest music
    stopAllMusic()
    setTimeout(() => {
      forestMusicRef.current?.play()
    }, 500)
    setScreen("park")
  }, [stopAllMusic])

  const handleEnterBooth = useCallback(() => {
    // Switch to booth music (user's uploaded songs)
    stopAllMusic()
    setScreen("photobooth")
    setTimeout(() => {
      boothMusicRef.current?.play()
    }, 300)
  }, [stopAllMusic])

  const handleBoothComplete = useCallback(() => {
    setScreen("final")
    // Booth music continues into final screen
  }, [])

  const handleReplay = useCallback(() => {
    stopAllMusic()
    setScreen("title")
  }, [stopAllMusic])

  return (
    <main
      className="flex items-center justify-center min-h-dvh bg-background overflow-hidden"
      style={{ touchAction: "none" }}
    >
      <div
        className="relative w-full h-dvh flex flex-col items-center justify-center"
        style={{ maxWidth: 420 }}
      >
        {screen === "title" && (
          <TitleScreen onStart={handleStart} onMusicStart={handleTitleMusicStart} />
        )}
        {screen === "date" && <DateInput onCorrect={handleDateCorrect} />}
        {screen === "park" && <ParkScene onEnterBooth={handleEnterBooth} />}
        {screen === "photobooth" && <PhotoBooth onComplete={handleBoothComplete} />}
        {screen === "final" && <FinalMessage onReplay={handleReplay} />}
      </div>
    </main>
  )
}
