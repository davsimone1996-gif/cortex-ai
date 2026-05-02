import { useRef, useState } from 'react'
import { useInView } from '../hooks/useInView'

export default function VideoReel({ reelUrl }) {
  const [playing, setPlaying] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const videoRef = useRef(null)
  const [ref, inView] = useInView()

  function handlePlay() {
    if (!reelUrl) return
    setPlaying(true)
    setFullscreen(true)
    setTimeout(() => {
      videoRef.current?.play()
    }, 100)
  }

  function handleClose() {
    videoRef.current?.pause()
    setPlaying(false)
    setFullscreen(false)
  }

  return (
    <>
      <section id="reel" className="relative bg-dark py-0 overflow-hidden" ref={ref}>
        {/* Band above */}
        <div className="bg-cream/5 border-y border-cream/10 py-4 overflow-hidden">
          <div className="flex items-center gap-12 whitespace-nowrap text-cream/20 text-xs font-semibold tracking-widest uppercase animate-marquee">
            {Array(10).fill('Video Production · Brand Film · Documentari · Motion Design · ').map((t, i) => (
              <span key={i}>{t}</span>
            ))}
          </div>
        </div>

        {/* Reel thumbnail area */}
        <div
          className={`relative mx-6 lg:mx-16 my-8 lg:my-16 rounded-2xl overflow-hidden cursor-pointer group
            transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
          `}
          style={{ aspectRatio: '16/9' }}
          onClick={handlePlay}
        >
          {/* Thumbnail / fallback */}
          <div className="absolute inset-0 bg-gradient-to-br from-dark-blue-2 via-dark to-dark-blue flex items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,28,32,0.08)_0%,transparent_70%)]" />
            {/* Grid lines */}
            <div className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: 'linear-gradient(#f4f3e3 1px, transparent 1px), linear-gradient(90deg, #f4f3e3 1px, transparent 1px)',
                backgroundSize: '60px 60px'
              }}
            />
            <div className="relative z-10 text-center">
              <p className="text-cream/30 text-xs font-semibold tracking-widest uppercase mb-6">
                {reelUrl ? 'Showreel 2024' : 'Carica il tuo reel da Admin'}
              </p>
              <p className="text-cream/10 text-8xl lg:text-[12rem] font-black leading-none tracking-tighter select-none">
                2024
              </p>
            </div>
          </div>

          {/* Play button */}
          {reelUrl && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="relative">
                <div className="absolute inset-0 bg-accent/20 rounded-full blur-2xl scale-150 group-hover:scale-200 transition-transform duration-500" />
                <div className="relative w-20 h-20 lg:w-28 lg:h-28 bg-accent rounded-full flex items-center justify-center
                  group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-accent/30">
                  <svg className="w-8 h-8 lg:w-10 lg:h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Corner label */}
          <div className="absolute bottom-4 left-4 z-20">
            <span className="bg-dark/80 text-cream text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full backdrop-blur-sm">
              Showreel
            </span>
          </div>

          {/* Duration placeholder */}
          {reelUrl && (
            <div className="absolute bottom-4 right-4 z-20">
              <span className="bg-dark/80 text-cream/60 text-xs px-3 py-1.5 rounded-full backdrop-blur-sm font-mono">
                03:24
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Fullscreen video overlay */}
      {fullscreen && reelUrl && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center animate-fade-in"
          onClick={handleClose}
        >
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 text-white/60 hover:text-white text-3xl z-10 w-12 h-12 flex items-center justify-center
              rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
          >
            ✕
          </button>
          <video
            ref={videoRef}
            src={reelUrl}
            controls
            className="w-full max-w-6xl max-h-[90vh] rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
