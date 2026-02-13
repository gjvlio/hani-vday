"use client"

import { useState, useCallback, useRef } from "react"
import { playShutter, playPrinting, playButtonPress } from "@/lib/audio"

const TOTAL_PHOTOS = 9

// Placeholder letters - fill these in later
const LETTERS: string[] = [
  "our very first photobooth. kahit nakauniform ka pa, nagpicture pa rin tayo hehe ^__^ dito yung time na kiniss mo ako tapos hindi talaga tayo aware that time na may cctv pala wawhdahs!! i remember nagpapanic pa nga tayo kung ano yung ipopose natin but we look so good regardless :--) \nwhenever i'm with you, i shine. \niba pala yung reach ng girlfriend air noh?! especially kapag sobrang ganda nung girlfriend :3", // Letter 1
  "oh my goshhh >///< hickey check?!@?! wahshdah aside from photobooth pics, i really love our polaroids <3 alam mo, laging nasa wallet ko yan hehe!! grabe kasi yung kapit ng halik mo dyan aaaaaaaa nakakalasing ^____^ look at us babe oh! ang fresh hehehe it reflects how good that time was :--) i love spending time with you, and to think na merong memorabilias like these na pwedeng gawing keepsakes... napakasaya ko talaga ^___^ \ni remembered nga non before nyan, namimiss kita sobra huhu tapos biglang ?!@?! heheheheh im 1000% convinced that u can read my thoughts, or maybe just a fairy ^________^", // Letter 2
  "we bought kopi with us! hehe si kopi na nagpupuna pansamantala ng pangungulila ko sayo :'( (i love u kopiiii) its like a family huhu ang cute natin sobra!! and u look soooooo pretty as always my bb ^_______^ your smile is like a drop of honey, so sweet <3 haniii maylab so sweet ^__^ alam mo ba, i still cant grasp pa rin na we look good pag magkasama !?#? grabe ka na talaga binago mo buhay ko !!!! ako #1 fan mo sa lahat ng bagay bb, no matter how far we are with each other, we are still here :') alam mo sobrang blessed ako na kasama kita! sa mga lugar na gusto kong itry, sa mga pagkain na gusto ko kainin, kahit tulala moments, everything is better when i'm with you. you're my solace and my home.", // Letter 3
  "who knew someone like you will also be my present... and my future? we had our rough start, but we still made it :') i'm so grateful for your kindness my love :-) i could go thousands of pages just to explain how important you are to me. you penetrated onto my heart (engk limbic system raw HSDADSHA), not just successfully, but remarkably! wala na talaga akong mahihiling pa !!! naalala mo ba yung sinabi ko noon? -- ang ibigin ka ay mapagpalaya -- you brought me peace. ang dami ko rin na self-realizations because of u bb ^___^ you taught me things na mas nakikilala ko sarili ko! i love youuu! mahal kita-- at sana alam mo yan! i gave my heart to you, yet you held it gently. 143 my lovee <3", // Letter 4
  "alam mo ba? nung first hand holding natin sa first date natin, binilang ko kung gano katagal kong hawak kamay mo? ang awkward pa natin nun tapos namamawis parehas kamay natin HAHAHA di ko rin matyempuhan kung anong anggulo yung paghawak ko kasi ang liit ng kamay mo, tapos ang laki ng palad ko. Pero look at us now. Look how our hands intertwine as if it belongs with each other, look how our love grew! its so beautiful ^___^ it's really a privilege to be with you bb! and the more i'm with you, the more i see myself into your eyes, kung paano mo ako mahalin-- kung pano mo ako tignan. at kung iisipin ko lang ito,,, haaayyy ang sarap magmahal!", // Letter 5
  "you make my days better, turn my frowns into smiles. naging sandigan kita kapag malungkot ako, bestfriend ko rin kapag may mga chika! oh to be loved!!! it makes my heart sing!! you're one of my reasons bakit ako gumigising sa umaga, kung bakit gusto ko maging magaling sa classes,, gusto ko maging better for you, not because i feel or deem unworthy sayo, but being loved by you makes me also want to grow individually. i want you to see me grow tooo, as much as i want to see you succeed in life. you're my best part.", // Letter 6
  "whether i'm bald or kahit ayaw mo sumakay sa mga rides na matataas, you'll be always here with me. grabe ka magmahal kdsjfhjdskf (wala na naiyak na) -- you understand me better than anyone, you make me whole. if i'm given a chance to pick a timeline of multiverses, i'd rather pick this same world with you :--) i'd rather have someone like you who floods my thoughts with memories of you ^________^ love you bb", // Letter 7
  "you're my muse in every art i make, and nothing can't replace that. :--) kahit nakikinig ang buong pilipinas, ipagsisigawan kita!", // Letter 8
  "i can't wait to have another photobooth pic with you :--) i love you hannah nicole castueras bayabao :)", // Letter 9
]

interface PhotoBoothProps {
  onComplete: () => void 
}

type BoothState = "idle" | "printing" | "photo-display" | "letter-display"

export default function PhotoBooth({ onComplete }: PhotoBoothProps) {
  const [currentPhoto, setCurrentPhoto] = useState(0)
  const [boothState, setBoothState] = useState<BoothState>("idle")
  const [printProgress, setPrintProgress] = useState(0)
  const printSoundRef = useRef<{ stop: () => void } | null>(null)

  const handleButtonPress = useCallback(() => {
    if (boothState !== "idle") return

    playShutter()

    // Start printing animation after brief flash
    setTimeout(() => {
      setBoothState("printing")
      setPrintProgress(0)
      printSoundRef.current = playPrinting(2000)

      const steps = 20
      let step = 0
      const interval = setInterval(() => {
        step++
        setPrintProgress(Math.min((step / steps) * 100, 100))
        if (step >= steps) {
          clearInterval(interval)
          if (printSoundRef.current) printSoundRef.current.stop()
          playButtonPress()
          setBoothState("photo-display")
        }
      }, 100)
    }, 300)
  }, [boothState])

  const handlePhotoClick = useCallback(() => {
    if (boothState !== "photo-display") return
    playButtonPress()
    setBoothState("letter-display")
  }, [boothState])

  const handleCloseLetter = useCallback(() => {
    playButtonPress()
    const nextPhoto = currentPhoto + 1
    if (nextPhoto >= TOTAL_PHOTOS) {
      onComplete()
    } else {
      setCurrentPhoto(nextPhoto)
      setBoothState("idle")
      setPrintProgress(0)
    }
  }, [currentPhoto, onComplete])

  return (
    <div className="flex flex-col items-center justify-start h-full w-full px-4 pt-4 overflow-y-auto">
      {/* Photo counter */}
      <div
        className="text-pixel text-muted-foreground mb-3"
        style={{ fontSize: "7px" }}
      >
        {`${currentPhoto + 1} / ${TOTAL_PHOTOS}`}
      </div>

      {/* Photobooth machine */}
      <div
        className="relative pixel-border flex-shrink-0"
        style={{
          width: 240,
          height: 380,
          background: "#5c3a6e",
          border: "4px solid #3d2548",
        }}
      >
        {/* Top sign */}
        <div
          className="absolute text-pixel text-center"
          style={{
            top: 8,
            left: 0,
            right: 0,
            fontSize: "7px",
            color: "#ffd700",
            textShadow: "1px 1px 0px rgba(0,0,0,0.8)",
          }}
        >
          {"PHOTO BOOTH"}
        </div>

        {/* Camera lens */}
        <div
          className="absolute"
          style={{
            top: 28,
            left: "50%",
            transform: "translateX(-50%)",
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: "#333",
            border: "3px solid #555",
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: boothState === "printing" ? "#4fc3f7" : "#1a1a2e",
              margin: "3px auto",
              boxShadow: boothState === "printing" ? "0 0 8px 2px rgba(79,195,247,0.5)" : "none",
              transition: "all 0.3s",
            }}
          />
        </div>

        {/* Flash indicator */}
        {boothState === "printing" && (
          <div
            className="absolute"
            style={{
              top: 24,
              left: "50%",
              transform: "translateX(-50%)",
              width: 60,
              height: 30,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.3)",
              animation: "blink 0.3s ease-in-out 2",
              pointerEvents: "none",
            }}
          />
        )}

        {/* Screen - vertical rectangle */}
        <div
          className="absolute"
          style={{
            top: 58,
            left: 50,
            right: 50,
            height: 200,
            background: "#1a1a2e",
            border: "3px solid #333",
            overflow: "hidden",
          }}
        >
          {boothState === "idle" && (
            <div className="flex items-center justify-center h-full">
              <p
                className="text-pixel text-center text-muted-foreground"
                style={{ fontSize: "6px", lineHeight: "1.8" }}
              >
                {currentPhoto === 0 ? "Press the\nbutton!" : "Ready for\nnext photo!"}
              </p>
            </div>
          )}
          {boothState === "printing" && (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <p
                className="text-pixel text-center"
                style={{ fontSize: "6px", color: "#4fc3f7" }}
              >
                {"Printing..."}
              </p>
              <div
                style={{
                  width: "70%",
                  height: 6,
                  background: "#333",
                  border: "1px solid #555",
                }}
              >
                <div
                  style={{
                    width: `${printProgress}%`,
                    height: "100%",
                    background: "#4fc3f7",
                    transition: "width 0.1s",
                  }}
                />
              </div>
            </div>
          )}
          {(boothState === "photo-display" || boothState === "letter-display") && (
            <div className="flex items-center justify-center h-full p-2">
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "#2a2a3e",
                  border: "2px solid #444",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/photos/photo${currentPhoto + 1}.jpg`}
                  alt={`Photo ${currentPhoto + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    imageRendering: "auto",
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = "none"
                    if (target.parentElement) {
                      target.parentElement.innerHTML = `<span style="font-family:var(--font-pixel);font-size:6px;color:#666;text-align:center;">Photo ${currentPhoto + 1}<br/>Add to<br/>/public/photos/</span>`
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Printing tray */}
        <div
          className="absolute"
          style={{
            bottom: 55,
            left: 55,
            right: 55,
            height: 12,
            background: "#444",
            border: "2px solid #333",
            borderRadius: "0 0 4px 4px",
          }}
        >
          {boothState === "printing" && (
            <div
              style={{
                position: "absolute",
                bottom: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                width: 36,
                height: 50 * (printProgress / 100),
                background: "#fff",
                border: "1px solid #ccc",
                overflow: "hidden",
                transition: "height 0.1s",
              }}
            />
          )}
        </div>

        {/* Big red button */}
        <button
          onClick={handleButtonPress}
          disabled={boothState !== "idle"}
          className="absolute cursor-pointer active:brightness-75 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            bottom: 12,
            left: "50%",
            transform: "translateX(-50%)",
            width: 60,
            height: 30,
            background: boothState === "idle" ? "#e53935" : "#888",
            border: "3px solid " + (boothState === "idle" ? "#b71c1c" : "#666"),
            borderRadius: 4,
            boxShadow: boothState === "idle"
              ? "inset 0 -3px 0 0 #b71c1c, inset 0 3px 0 0 #ef5350"
              : "none",
            fontSize: "7px",
            fontFamily: "var(--font-pixel)",
            color: "#fff",
            textShadow: "1px 1px 0px rgba(0,0,0,0.5)",
          }}
          aria-label="Take photo"
        >
          {"CLICK"}
        </button>
      </div>

      {/* Printed photo (when in photo-display state) */}
      {boothState === "photo-display" && (
        <div
          className="mt-4 cursor-pointer flex-shrink-0"
          onClick={handlePhotoClick}
          style={{ animation: "slideUp 0.5s ease-out" }}
          role="button"
          tabIndex={0}
          aria-label="View letter"
          onKeyDown={(e) => {
            if (e.key === "Enter") handlePhotoClick()
          }}
        >
          <div
            className="pixel-border-light p-2"
            style={{
              background: "#fff",
              width: 120,
              height: 160,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/photos/photo${currentPhoto + 1}.jpg`}
              alt={`Photo ${currentPhoto + 1}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                imageRendering: "auto",
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = "none"
                if (target.parentElement) {
                  target.parentElement.innerHTML = `<div style="width:100%;height:100%;background:#f0f0f0;display:flex;align-items:center;justify-content:center;font-family:var(--font-pixel);font-size:6px;color:#999;">Photo ${currentPhoto + 1}</div>`
                }
              }}
            />
          </div>
          <p
            className="text-pixel text-center text-muted-foreground mt-2"
            style={{ fontSize: "6px", animation: "blink 1.2s ease-in-out infinite" }}
          >
            {"TAP THE PHOTO"}
          </p>
        </div>
      )}

      {/* Letter overlay */}
      {boothState === "letter-display" && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            background: "rgba(0,0,0,0.85)",
            animation: "fadeIn 0.3s ease-out",
          }}
        >
          <div
            className="relative pixel-border p-6 mx-4"
            style={{
              background: "#fef9ef",
              maxWidth: 320,
              width: "90%",
              maxHeight: "80vh",
              display: "flex",
              flexDirection: "column",
              animation: "slideUp 0.4s ease-out",
            }}
          >
            {/* Close button */}
            <button
              onClick={handleCloseLetter}
              className="absolute text-pixel cursor-pointer bg-transparent border-none z-10"
              style={{
                top: 8,
                right: 12,
                fontSize: "12px",
                color: "#999",
                lineHeight: 1,
              }}
              aria-label="Close letter"
            >
              {"X"}
            </button>

            {/* Letter header */}
            <div className="flex items-center gap-2 mb-4 flex-shrink-0">
              <div
                style={{
                  width: 8,
                  height: 8,
                  background: "#e53935",
                  transform: "rotate(45deg)",
                }}
              />
              <p
                className="text-pixel"
                style={{ fontSize: "8px", color: "#5c3a6e" }}
              >
                {`Letter #${currentPhoto + 1}`}
              </p>
            </div>

            {/* Letter content - scrollable */}
            <div
              className="text-pixel leading-relaxed overflow-y-auto flex-1"
              style={{
                fontSize: "8px",
                color: "#333",
                lineHeight: 2.2,
                minHeight: 80,
                maxHeight: "55vh",
                whiteSpace: "pre-wrap",
                paddingRight: 8,
                WebkitOverflowScrolling: "touch",
              }}
            >
              {LETTERS[currentPhoto] || "(Your letter here)"}
            </div>

            {/* Letter footer */}
            <div className="mt-4 pt-3 flex-shrink-0" style={{ borderTop: "1px dashed #ccc" }}>
              <p
                className="text-pixel text-right"
                style={{ fontSize: "7px", color: "#999" }}
              >
                {"with love"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
