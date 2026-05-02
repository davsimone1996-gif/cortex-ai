import { useInView } from '../hooks/useInView'

export default function CtaBanner() {
  const [ref, inView] = useInView()

  return (
    <section className="bg-dark-blue-2 py-24 lg:py-36 px-6 lg:px-16 overflow-hidden" ref={ref}>
      <div className="max-w-5xl mx-auto text-center relative">
        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[400px] bg-accent/10 rounded-full blur-[100px]" />
        </div>

        <div className={`relative z-10 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="inline-flex items-center gap-2 text-teal text-xs font-semibold tracking-widest uppercase mb-8">
            <span className="w-8 h-px bg-teal" />
            Iniziamo
          </span>
          <h2 className="text-cream text-5xl lg:text-7xl xl:text-8xl font-black leading-none tracking-tight mb-8">
            Hai un progetto
            <br />
            <span className="text-accent">in mente?</span>
          </h2>
          <p className="text-cream/40 text-lg lg:text-xl max-w-xl mx-auto leading-relaxed mb-12">
            Raccontaci la tua idea. Ci piace lavorare con persone che hanno qualcosa da dire.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/contact"
              className="w-full sm:w-auto bg-accent text-white font-bold text-sm px-10 py-4 rounded-full
                hover:bg-accent/90 hover:scale-95 transition-all duration-300 tracking-widest uppercase
                shadow-lg shadow-accent/20"
            >
              Scrivici ora
            </a>
            <a
              href="/#reel"
              className="w-full sm:w-auto border border-cream/20 text-cream font-semibold text-sm px-10 py-4 rounded-full
                hover:border-cream/50 hover:scale-95 transition-all duration-300 tracking-widest uppercase"
            >
              Guarda il reel
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
