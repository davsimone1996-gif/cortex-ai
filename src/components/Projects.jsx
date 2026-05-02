import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useInView } from '../hooks/useInView'

const CATEGORIES = ['Tutti', 'Brand Film', 'Documentario', 'Social', 'Spot']

// Placeholder projects — replaced with Supabase data
const PLACEHOLDER_PROJECTS = [
  {
    id: 1,
    title: 'Progetto Uno',
    client: 'Brand Name',
    category: 'Brand Film',
    year: '2024',
    thumbnail_url: null,
    slug: 'progetto-uno',
  },
  {
    id: 2,
    title: 'Campagna Estate',
    client: 'Cliente X',
    category: 'Spot',
    year: '2024',
    thumbnail_url: null,
    slug: 'campagna-estate',
  },
  {
    id: 3,
    title: 'Documentario Napoli',
    client: 'RAI',
    category: 'Documentario',
    year: '2023',
    thumbnail_url: null,
    slug: 'documentario-napoli',
  },
  {
    id: 4,
    title: 'Social Series',
    client: 'Fashion Brand',
    category: 'Social',
    year: '2024',
    thumbnail_url: null,
    slug: 'social-series',
  },
  {
    id: 5,
    title: 'Brand Identity Film',
    client: 'Startup',
    category: 'Brand Film',
    year: '2023',
    thumbnail_url: null,
    slug: 'brand-identity-film',
  },
  {
    id: 6,
    title: 'Prodotto Lancio',
    client: 'Tech Co.',
    category: 'Spot',
    year: '2024',
    thumbnail_url: null,
    slug: 'prodotto-lancio',
  },
]

function ProjectCard({ project, index }) {
  const [hovered, setHovered] = useState(false)
  const [ref, inView] = useInView()

  const colors = ['bg-dark-blue-2', 'bg-dark-alt', 'bg-dark-blue', 'bg-dark']
  const bgColor = colors[index % colors.length]

  return (
    <Link
      to={`/projects/${project.slug}`}
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative block overflow-hidden rounded-xl aspect-[4/3]
        transition-all duration-700
        ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
      `}
      style={{ transitionDelay: `${(index % 3) * 100}ms` }}
    >
      {/* Thumbnail or placeholder */}
      <div className={`absolute inset-0 ${bgColor}`}>
        {project.thumbnail_url ? (
          <img
            src={project.thumbnail_url}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-dark-blue-2 to-dark" />
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: 'linear-gradient(#f4f3e3 1px, transparent 1px), linear-gradient(90deg, #f4f3e3 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />
            <span className="relative text-cream/10 text-7xl lg:text-8xl font-black tracking-tighter select-none">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>
        )}
      </div>

      {/* Hover overlay */}
      <div className={`absolute inset-0 bg-accent transition-opacity duration-500 ${hovered ? 'opacity-90' : 'opacity-0'}`} />

      {/* Always visible bottom info */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-4 lg:p-6 bg-gradient-to-t from-dark/90 to-transparent">
        <div className="flex items-end justify-between">
          <div>
            <p className={`text-xs font-semibold tracking-widest uppercase mb-1 transition-colors duration-300 ${hovered ? 'text-white/80' : 'text-cream/40'}`}>
              {project.category} · {project.year}
            </p>
            <h3 className={`text-lg lg:text-xl font-black leading-tight transition-colors duration-300 ${hovered ? 'text-white' : 'text-cream'}`}>
              {project.title}
            </h3>
          </div>
          <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center
            transition-all duration-300
            ${hovered ? 'border-white bg-white text-accent scale-110' : 'border-cream/30 text-cream/30'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </div>
        </div>
      </div>

      {/* Hovered client */}
      <div className={`absolute top-4 left-4 z-20 transition-all duration-300 ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
        <span className="text-white/80 text-xs font-semibold tracking-widest uppercase">
          {project.client}
        </span>
      </div>
    </Link>
  )
}

export default function Projects({ projects }) {
  const [activeCategory, setActiveCategory] = useState('Tutti')
  const [headerRef, headerInView] = useInView()
  const displayProjects = projects?.length ? projects : PLACEHOLDER_PROJECTS

  const filtered = activeCategory === 'Tutti'
    ? displayProjects
    : displayProjects.filter((p) => p.category === activeCategory)

  return (
    <section id="projects" className="bg-accent py-24 lg:py-40">
      <div className="px-6 lg:px-16">
        {/* Header */}
        <div
          ref={headerRef}
          className={`flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16 transition-all duration-700 ${headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div>
            <span className="inline-flex items-center gap-2 text-white/60 text-xs font-semibold tracking-widest uppercase mb-4">
              <span className="w-8 h-px bg-white/60" />
              Portfolio
            </span>
            <h2 className="text-white text-5xl lg:text-7xl font-black leading-none tracking-tight">
              I nostri lavori.
            </h2>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs font-semibold px-4 py-2 rounded-full tracking-widest uppercase transition-all duration-300
                  ${activeCategory === cat
                    ? 'bg-white text-accent'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            to="/projects"
            className="inline-flex items-center gap-3 bg-white text-accent font-bold text-sm px-8 py-4 rounded-full
              hover:bg-cream hover:scale-95 transition-all duration-300 tracking-widest uppercase"
          >
            Vedi tutti i progetti
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
