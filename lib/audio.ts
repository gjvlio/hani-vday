// Retro 8-bit sound effects generated with Web Audio API
let audioCtx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume()
  }
  return audioCtx
}

// Sweet retro beep for button press
export function playButtonPress() {
  const ctx = getCtx()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = "square"
  osc.frequency.setValueAtTime(600, ctx.currentTime)
  osc.frequency.setValueAtTime(800, ctx.currentTime + 0.05)
  gain.gain.setValueAtTime(0.12, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.12)
}

// Number pad key press - short blip
export function playKeyPress() {
  const ctx = getCtx()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = "square"
  osc.frequency.setValueAtTime(440 + Math.random() * 60, ctx.currentTime)
  gain.gain.setValueAtTime(0.08, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.06)
}

// Wrong answer - descending error buzz
export function playError() {
  const ctx = getCtx()
  const t = ctx.currentTime
  // Two harsh oscillators for that classic "wrong" feel
  for (let i = 0; i < 2; i++) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = "square"
    osc.frequency.setValueAtTime(300, t + i * 0.12)
    osc.frequency.setValueAtTime(200, t + i * 0.12 + 0.1)
    gain.gain.setValueAtTime(0.15, t + i * 0.12)
    gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.12 + 0.15)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t + i * 0.12)
    osc.stop(t + i * 0.12 + 0.15)
  }
}

// Correct answer - ascending happy jingle
export function playCorrect() {
  const ctx = getCtx()
  const t = ctx.currentTime
  const notes = [523, 659, 784, 1047] // C5, E5, G5, C6
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = "square"
    osc.frequency.setValueAtTime(freq, t + i * 0.1)
    gain.gain.setValueAtTime(0.1, t + i * 0.1)
    gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.1 + 0.2)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t + i * 0.1)
    osc.stop(t + i * 0.1 + 0.2)
  })
}

// Camera shutter / photo click
export function playShutter() {
  const ctx = getCtx()
  const t = ctx.currentTime
  // White noise burst for shutter click
  const bufferSize = ctx.sampleRate * 0.08
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.3
  }
  const noise = ctx.createBufferSource()
  noise.buffer = buffer
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.2, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08)
  // Also a click tone
  const osc = ctx.createOscillator()
  const oscGain = ctx.createGain()
  osc.type = "square"
  osc.frequency.setValueAtTime(1200, t)
  osc.frequency.setValueAtTime(800, t + 0.03)
  oscGain.gain.setValueAtTime(0.1, t)
  oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1)
  noise.connect(gain)
  gain.connect(ctx.destination)
  osc.connect(oscGain)
  oscGain.connect(ctx.destination)
  noise.start(t)
  noise.stop(t + 0.08)
  osc.start(t)
  osc.stop(t + 0.1)
}

// Printing sound - mechanical ratchet
export function playPrinting(durationMs: number = 2000): { stop: () => void } {
  const ctx = getCtx()
  const t = ctx.currentTime
  const dur = durationMs / 1000
  const clickCount = Math.floor(durationMs / 80)
  const oscs: OscillatorNode[] = []
  
  for (let i = 0; i < clickCount; i++) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = "square"
    const clickTime = t + (i * dur) / clickCount
    osc.frequency.setValueAtTime(150 + (i % 2) * 80, clickTime)
    gain.gain.setValueAtTime(0.04, clickTime)
    gain.gain.exponentialRampToValueAtTime(0.001, clickTime + 0.03)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(clickTime)
    osc.stop(clickTime + 0.03)
    oscs.push(osc)
  }
  
  return {
    stop: () => oscs.forEach((o) => { try { o.stop() } catch {} }),
  }
}

// Start screen press - gentle chime
export function playStartChime() {
  const ctx = getCtx()
  const t = ctx.currentTime
  const notes = [784, 988, 1175] // G5, B5, D6
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = "triangle"
    osc.frequency.setValueAtTime(freq, t + i * 0.12)
    gain.gain.setValueAtTime(0.12, t + i * 0.12)
    gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.12 + 0.35)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t + i * 0.12)
    osc.stop(t + i * 0.12 + 0.35)
  })
}

// Music manager for looping background tracks
export class MusicPlayer {
  private audio: HTMLAudioElement | null = null
  private secondAudio: HTMLAudioElement | null = null
  private currentTrack: number = 0
  private sources: string[] = []
  private _volume: number = 0.35

  constructor(sources: string[], volume: number = 0.35) {
    this.sources = sources
    this._volume = volume
  }

  play() {
    if (this.sources.length === 0) return
    this.stop()
    
    if (this.sources.length === 1) {
      this.audio = new Audio(this.sources[0])
      this.audio.loop = true
      this.audio.volume = this._volume
      this.audio.play().catch(() => {})
    } else {
      // Two songs: play first, then second, then loop
      this.currentTrack = 0
      this.playCurrentTrack()
    }
  }

  private playCurrentTrack() {
    if (this.sources.length < 2) return
    this.audio = new Audio(this.sources[this.currentTrack])
    this.audio.volume = this._volume
    this.audio.loop = false
    this.audio.addEventListener("ended", () => {
      this.currentTrack = (this.currentTrack + 1) % this.sources.length
      this.playCurrentTrack()
    })
    this.audio.play().catch(() => {})
  }

  stop() {
    if (this.audio) {
      this.audio.pause()
      this.audio.currentTime = 0
      this.audio.removeAttribute("src")
      this.audio = null
    }
    if (this.secondAudio) {
      this.secondAudio.pause()
      this.secondAudio.currentTime = 0
      this.secondAudio = null
    }
  }

  setVolume(v: number) {
    this._volume = v
    if (this.audio) this.audio.volume = v
  }
}
