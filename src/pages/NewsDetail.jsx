import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('it-IT', {
    day: '2-digit', month: 'long', year: 'numeric',
  })
}

export default function NewsDetail() {
  const { slug } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase.from('articles').select('*').eq('slug', slug).single()
      setArticle(data)
      setLoading(false)
    }
    fetch()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center gap-6">
        <h1 className="text-cream text-4xl font-black">Articolo non trovato</h1>
        <Link to="/news" className="text-accent text-sm font-semibold hover:underline">← Torna alle news</Link>
      </div>
    )
  }

  return (
    <main className="bg-dark min-h-screen">
      {/* Hero */}
      <div className="relative pt-28 lg:pt-36 pb-16 px-6 lg:px-16 max-w-4xl mx-auto">
        <Link to="/news" className="text-cream/40 hover:text-cream text-xs font-semibold tracking-widest uppercase mb-8 inline-flex items-center gap-2 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Tutte le news
        </Link>

        <div className="flex items-center gap-4 mb-6">
          <span className="bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full">{article.category}</span>
          {article.date && <span className="text-cream/30 text-xs">{formatDate(article.date)}</span>}
        </div>

        <h1 className="text-cream text-4xl lg:text-6xl font-black leading-tight tracking-tight mb-6">
          {article.title}
        </h1>
        {article.excerpt && (
          <p className="text-cream/50 text-xl leading-relaxed">{article.excerpt}</p>
        )}
      </div>

      {/* Cover image */}
      {article.image_url && (
        <div className="mx-6 lg:mx-16 mb-16 rounded-2xl overflow-hidden aspect-video max-w-4xl mx-auto">
          <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Body */}
      <div className="px-6 lg:px-16 pb-24 max-w-3xl mx-auto">
        {article.content ? (
          <div className="prose prose-invert max-w-none text-cream/70 leading-relaxed space-y-6">
            {article.content.split('\n\n').map((para, i) => (
              <p key={i} className="text-base lg:text-lg">{para}</p>
            ))}
          </div>
        ) : (
          <p className="text-cream/30 text-lg italic">Contenuto non disponibile.</p>
        )}
      </div>

      {/* Footer nav */}
      <div className="border-t border-cream/10 px-6 lg:px-16 py-12 flex items-center justify-between max-w-4xl mx-auto">
        <Link to="/news" className="text-cream/40 hover:text-cream text-sm font-semibold tracking-widest uppercase transition-colors">
          ← Tutte le news
        </Link>
        <Link to="/contact" className="bg-accent text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-accent/90 transition-all duration-300">
          Contattaci
        </Link>
      </div>
    </main>
  )
}
