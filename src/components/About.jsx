import { useInView } from '../hooks/useInView'

const stats = [
  { value: '150+', label: 'Progetti realizzati' },
  { value: '8+', label: 'Anni di esperienza' },
  { value: '40+', label: 'Brand collaborazioni' },
  { value: '12', label: 'Premi vinti' },
]

const services = [
  'Video Production',
  'Brand Film',
  'Documentari',
  'Social Content',
  'Motion Graphics',
  'Post-Produzione',
]

export default function About() {
  const [ref, inView] = useInView()

  return (
    <section id="about" className="bg-dark py-24 lg:py-40 px-6 lg:px-16" ref={ref}>
      <div className="max-w-7xl mx-auto">

        {/* Top label */}
        <div className={`mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-flex items-center gap-2 text-teal text-xs font-semibold tracking-widest uppercase">
            <span className="w-8 h-px bg-teal" />
            Chi siamo
          </span>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left: text */}
          <div className={`transition-all duration-700 delay-100 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
            <h2 className="text-cream text-4xl lg:text-5xl xl:text-6xl font-black leading-tight tracking-tight mb-8">
              Crediamo nel potere
              <br />
              <span className="text-accent">delle storie vere.</span>
            </h2>
            <p className="text-cream/50 text-base lg:text-lg leading-relaxed mb-6">
              Siamo un collettivo di filmmaker, direttori della fotografia e narratori digitali.
              Lavoriamo con brand, istituzioni e artisti per trasformare idee in contenuti video
              che creano connessioni autentiche.
            </p>
            <p className="text-cream/50 text-base lg:text-lg leading-relaxed mb-10">
              Dal concept alla consegna finale, ogni progetto viene trattato come un'opera unica.
              Non produciamo semplicemente video — costruiamo esperienze visive.
            </p>

            {/* Services list */}
            <div className="flex flex-wrap gap-3">
              {services.map((s) => (
                <span
                  key={s}
                  className="border border-cream/20 text-cream/60 text-xs font-medium px-4 py-2 rounded-full
                    hover:border-accent/50 hover:text-cream transition-all duration-300"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Right: stats + visual */}
          <div className={`transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-px bg-cream/10 rounded-2xl overflow-hidden mb-8">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-dark p-8 lg:p-10 group hover:bg-dark-blue-2 transition-colors duration-300"
                >
                  <div className="text-4xl lg:text-5xl font-black text-cream mb-2 group-hover:text-accent transition-colors duration-300">
                    {stat.value}
                  </div>
                  <div className="text-cream/40 text-sm font-medium tracking-wide">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Visual accent block */}
            <div className="relative h-32 lg:h-40 rounded-2xl overflow-hidden bg-gradient-to-r from-accent/20 via-dark-blue to-teal/20 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-teal/10" />
              <p className="relative text-cream/60 text-sm font-medium tracking-widest uppercase text-center px-6">
                Milano · Roma · Napoli · Internazionale
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
