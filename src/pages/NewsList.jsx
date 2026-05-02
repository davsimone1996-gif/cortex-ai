import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useInView } from '../hooks/useInView'
import CtaBanner from '../components/CtaBanner'

const CATEGORIES = ['Tutti', 'Behind the scenes', 'Industry', 'Case study']
const PAGE_SIZE = 20

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('it-IT', {
    day: '2-digit', month: 'long', year: 'numeric',
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
      style={{ transitionDelay: `${(index % 6) * 80}ms` }}
    >
      <div className={`relative overflow-hidden ${featured ? 'aspect-[16/7]' : 'aspect-video'}`}>
        {article.image_url ? (
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-dark-blue-2 to-dark flex items-center justify-center relative overflow-hidden">
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
        <div className="absolute top-4 left-4">
          <span className="bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full tracking-widest uppercase">
            {article.category}
          </span>
        </div>
      </div>

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

export default function NewsList() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('Tutti')
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true)
      const from = page * PAGE_SIZE
      const to = from + PAGE_SIZE - 1

      let query = supabase
        .from('articles')
        .select('*', { count: 'exact' })
        .order('date', { ascending: false })
        .range(from, to)

      if (activeCategory !== 'Tutti') {
        query = query.eq('category', activeCategory)
      }

      const { data, count } = await query
      if (data) setArticles(data)
      if (count !== null) setTotal(count)
      setLoading(false)
    }

    fetchArticles()
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
            <span className="w-8 h-px bg-teal" />News & Insights
          </span>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <h1 className="text-cream text-5xl lg:text-7xl font-black leading-none tracking-tight">
                Articoli & Insights
              </h1>
              {total > 0 && (
                <p className="text-cream/30 text-sm mt-3">{total} articoli</p>
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
          ) : articles.length === 0 ? (
            <div className="text-center py-32 text-cream/20">
              <p className="text-5xl mb-4">📰</p>
              <p className="text-sm">Nessun articolo in questa categoria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {articles.map((article, i) => (
                <NewsCard
                  key={article.id}
                  article={article}
                  index={i}
                  featured={i === 0 && page === 0}
                />
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
