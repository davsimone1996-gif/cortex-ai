import { Link } from 'react-router-dom'
import { useInView } from '../hooks/useInView'

const PLACEHOLDER_NEWS = [
  {
    id: 1,
    title: 'Come costruiamo un brand film in 5 fasi',
    excerpt: 'Dal briefing creativo alla consegna finale: il nostro processo di lavoro spiegato passo dopo passo.',
    category: 'Behind the scenes',
    date: '2024-03-15',
    image_url: null,
    slug: 'brand-film-5-fasi',
  },
  {
    id: 2,
    title: 'Il futuro della produzione video nel 2024',
    excerpt: 'AI, virtual production e nuovi formati: come si sta evolvendo il nostro settore e cosa significa per i brand.',
    category: 'Industry',
    date: '2024-02-28',
    image_url: null,
    slug: 'futuro-produzione-video-2024',
  },
  {
    id: 3,
    title: 'Case study: campagna per un brand fashion',
    excerpt: 'Come abbiamo realizzato una serie di contenuti video che ha aumentato il brand awareness del 340%.',
    category: 'Case study',
    date: '2024-01-20',
    image_url: null,
    slug: 'case-study-fashion-brand',
  },
]

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function NewsCard({ article, index, featured = false }) {
  const [ref, inView] = useInView()

  return (
    <Link
      to={`/news/${article.slug}`}
      ref={ref}
      className={`group block overflow-hidden rounded-xl bg-cream/5 border border-cream/10
        hover:border-accent/30 hover:bg-cream/[0.07] transition-all duration-500
        ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        ${featured ? 'lg:col-span-2' : ''}
      `}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Image */}
      <div className={`relative overflow-hidden ${featured ? 'aspect-[16/7]' : 'aspect-video'}`}>
        {article.image_url ? (
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-dark-blue-2 to-dark flex items-center justify-center">
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: 'linear-gradient(#f4f3e3 1px, transparent 1px), linear-gradient(90deg, #f4f3e3 1px, transparent 1px)',
                backgroundSize: '30px 30px',
              }}
            />
            <span className="relative text-cream/5 font-black text-6xl lg:text-8xl select-none tracking-tighter">
              NEWS
            </span>
          </div>
        )}
        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full tracking-widest uppercase">
            {article.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 lg:p-8">
        <p className="text-cream/30 text-xs font-medium tracking-widest uppercase mb-3">
          {formatDate(article.date)}
        </p>
        <h3 className={`text-cream font-black leading-tight mb-3 group-hover:text-accent transition-colors duration-300
          ${featured ? 'text-2xl lg:text-3xl' : 'text-xl'}`}>
          {article.title}
        </h3>
        <p className="text-cream/40 text-sm leading-relaxed line-clamp-2 mb-6">
          {article.excerpt}
        </p>
        <div className="flex items-center gap-2 text-accent text-xs font-semibold tracking-widest uppercase">
          Leggi l'articolo
          <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </div>
      </div>
    </Link>
  )
}

export default function News({ articles }) {
  const [headerRef, headerInView] = useInView()
  const displayArticles = articles?.length ? articles : PLACEHOLDER_NEWS

  return (
    <section id="news" className="bg-dark py-24 lg:py-40 px-6 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div
          ref={headerRef}
          className={`flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16 transition-all duration-700 ${headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div>
            <span className="inline-flex items-center gap-2 text-teal text-xs font-semibold tracking-widest uppercase mb-4">
              <span className="w-8 h-px bg-teal" />
              News & Insights
            </span>
            <h2 className="text-cream text-5xl lg:text-7xl font-black leading-none tracking-tight">
              Dal nostro<br />
              <span className="text-cream/30">universo.</span>
            </h2>
          </div>

          <Link
            to="/news"
            className="self-start lg:self-end group flex items-center gap-2 text-cream/50 hover:text-cream text-sm font-semibold tracking-widest uppercase transition-colors duration-300"
          >
            Tutti gli articoli
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {displayArticles.map((article, i) => (
            <NewsCard
              key={article.id}
              article={article}
              index={i}
              featured={i === 0}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
