import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useInView } from '../hooks/useInView'
import CtaBanner from '../components/CtaBanner'

const CATEGORIES = ['Tutti', 'Brand Film', 'Documentario', 'Social', 'Spot']
const PAGE_SIZE = 20

function ProjectCard({ project, index }) {
  const [hovered, setHovered] = useState(false)
  const [ref, inView] = useInView()
  const colors = ['bg-dark-blue-2', 'bg-dark-alt', 'bg-dark-blue', 'bg-dark']

  return (
    <Link
      to={`/projects/${project.slug}`}
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative block overflow-hidden rounded-xl aspect-[4/3] transition-all duration-700
        ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{ transitionDelay: `${(index % 3) * 100}ms` }}
    >
      <div className={`absolute inset-0 ${colors[index % colors.length]}`}>
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

      <div className={`absolute inset-0 bg-accent transition-opacity duration-500 ${hovered ? 'opacity-90' : 'opacity-0'}`} />

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
          <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300
            ${hovered ? 'border-white bg-white text-accent scale-110' : 'border-cream/30 text-cream/30'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </div>
        </div>
      </div>

      <div className={`absolute top-4 left-4 z-20 transition-all duration-300 ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
        <span className="text-white/80 text-xs font-semibold tracking-widest uppercase">{project.client}</span>
      </div>
    </Link>
  )
}

export default function ProjectsList() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('Tutti')
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true)
      const from = page * PAGE_SIZE
      const to = from + PAGE_SIZE - 1

      let query = supabase
        .from('projects')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)

      if (activeCategory !== 'Tutti') {
        query = query.eq('category', activeCategory)
      }

      const { data, count } = await query
      if (data) setProjects(data)
      if (count !== null) setTotal(count)
      setLoading(false)
    }

    fetchProjects()
  }, [activeCategory, page])

  function handleCategory(cat) {
    setActiveCategory(cat)
    setPage(0)
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <main className="bg-dark min-h-screen">
      {/* Header */}
      <div className="pt-28 lg:pt-40 pb-12 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <span className="inline-flex items-center gap-2 text-teal text-xs font-semibold tracking-widest uppercase mb-4">
            <span className="w-8 h-px bg-teal" />Portfolio
          </span>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <h1 className="text-cream text-5xl lg:text-7xl font-black leading-none tracking-tight">
                I nostri lavori.
              </h1>
              {total > 0 && (
                <p className="text-cream/30 text-sm mt-3">{total} progetti</p>
              )}
            </div>

            {/* Filtri categoria */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategory(cat)}
                  className={`text-xs font-semibold px-4 py-2 rounded-full tracking-widest uppercase transition-all duration-300
                    ${activeCategory === cat
                      ? 'bg-accent text-white'
                      : 'bg-cream/5 text-cream/50 hover:bg-cream/10 hover:text-cream border border-cream/10'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="px-6 lg:px-16 pb-24">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-32 text-cream/20">
              <p className="text-5xl mb-4">📂</p>
              <p className="text-sm">Nessun progetto in questa categoria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {projects.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </div>
          )}

          {/* Paginazione */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-16">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 0}
                className="w-10 h-10 rounded-full border border-cream/20 text-cream/40 flex items-center justify-center
                  hover:border-accent hover:text-accent transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`w-10 h-10 rounded-full text-sm font-bold transition-all duration-300
                    ${page === i
                      ? 'bg-accent text-white'
                      : 'border border-cream/20 text-cream/40 hover:border-accent hover:text-accent'
                    }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages - 1}
                className="w-10 h-10 rounded-full border border-cream/20 text-cream/40 flex items-center justify-center
                  hover:border-accent hover:text-accent transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      <CtaBanner />
    </main>
  )
}
