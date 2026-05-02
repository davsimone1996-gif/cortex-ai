import { useEffect, useRef, useState } from 'react'

export default function Hero() {
  const videoRef = useRef(null)
  const [videoLoaded, setVideoLoaded] = useState(false)

  // Placeholder reel video URL — replace with your Supabase video URL
  const reelUrl = null

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [videoLoaded])

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-end overflow-hidden bg-dark">
      {/* Background video or gradient fallback */}
      <div className="absolute inset-0 z-0">
        {reelUrl ? (
          <video
            ref={videoRef}
            src={reelUrl}
            autoPlay
            muted
            loop
            playsInline
            onCanPlay={() => setVideoLoaded(true)}
            className="w-full h-full object-cover opacity-40"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-dark via-dark-blue-2 to-dark" />
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent" />
      </div>

      {/* Animated background shapes */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-teal/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 lg:px-16 pb-20 lg:pb-28">
        {/* Label */}
        <div className="mb-6 lg:mb-8">
          <span className="inline-flex items-center gap-2 text-accent text-xs font-semibold tracking-widest uppercase">
            <span className="w-8 h-px bg-accent" />
            Agenzia Creativa & Video Production
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-cream font-black leading-none tracking-tight mb-8 lg:mb-12">
          <span
            className="block text-[13vw] lg:text-[10vw] xl:text-[9vw] animate-fade-up"
            style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
          >
            Storie che
          </span>
          <span
            className="block text-[13vw] lg:text-[10vw] xl:text-[9vw] text-accent animate-fade-up"
            style={{ animationDelay: '0.25s', animationFillMode: 'both' }}
          >
            ispirano.
          </span>
          <span
            className="block text-[13vw] lg:text-[10vw] xl:text-[9vw] animate-fade-up"
            style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
          >
            Immagini che
          </span>
          <span
            className="block text-[13vw] lg:text-[10vw] xl:text-[9vw] text-cream/30 animate-fade-up"
            style={{ animationDelay: '0.55s', animationFillMode: 'both' }}
          >
            restano.
          </span>
        </h1>

        {/* Bottom row */}
        <div
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 animate-fade-up"
          style={{ animationDelay: '0.7s', animationFillMode: 'both' }}
        >
          <p className="text-cream/50 text-base lg:text-lg font-light max-w-md leading-relaxed">
            Creiamo contenuti video che connettono brand e persone.
            Dalla strategia alla post-produzione, ogni frame racconta qualcosa di vero.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="/#projects"
              className="group flex items-center gap-3 text-cream font-semibold text-sm tracking-widest uppercase hover:text-accent transition-colors duration-300"
            >
              Scopri i lavori
              <span className="inline-block w-10 h-px bg-cream group-hover:bg-accent group-hover:w-16 transition-all duration-300" />
            </a>
            <a
              href="/#reel"
              className="bg-accent/10 border border-accent/30 text-accent text-sm font-semibold px-6 py-3 rounded-full
                hover:bg-accent hover:text-white transition-all duration-300"
            >
              ▶ Guarda il reel
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 z-10 flex flex-col items-center gap-2 animate-fade-in"
        style={{ animationDelay: '1.2s', animationFillMode: 'both' }}>
        <span className="text-cream/30 text-xs tracking-widest uppercase" style={{ writingMode: 'vertical-rl' }}>
          Scroll
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-cream/30 to-transparent" />
      </div>
    </section>
  )
}
