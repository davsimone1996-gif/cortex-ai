import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ProjectDetail() {
  const { slug } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    async function fetchProject() {
      const { data } = await supabase
        .from('projects')
        .select('slug, thumbnail_url, title, category, year, client, description, video_url')
        .eq('slug', slug)
        .single()
      setProject(data)
      setLoading(false)
    }
    fetchProject()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center gap-6 px-6 text-center">
        <h1 className="text-cream text-4xl font-black">Progetto non trovato</h1>
        <Link to="/#projects" className="text-accent text-sm font-semibold hover:underline">
          ← Torna ai progetti
        </Link>
      </div>
    )
  }

  return (
    <main className="bg-dark min-h-screen">
      {/* Hero */}
      <div className="relative h-[60vh] lg:h-[80vh] overflow-hidden">
        {project.thumbnail_url ? (
          <img src={project.thumbnail_url} alt={project.title}
            className="absolute inset-0 w-full h-full object-cover opacity-50" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-dark-blue-2 to-dark" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 lg:p-16">
          <Link to="/#projects" className="text-cream/40 hover:text-cream text-xs font-semibold tracking-widest uppercase mb-6 inline-flex items-center gap-2 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Tutti i progetti
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <span className="bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full">{project.category}</span>
            <span className="text-cream/40 text-xs font-semibold">{project.year}</span>
          </div>
          <h1 className="text-cream text-4xl lg:text-7xl font-black leading-none tracking-tight mb-2">
            {project.title}
          </h1>
          <p className="text-cream/50 text-lg">{project.client}</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 lg:px-16 py-16 lg:py-24 max-w-4xl">
        {project.description && (
          <div className="mb-16">
            <p className="text-cream/60 text-lg lg:text-xl leading-relaxed">{project.description}</p>
          </div>
        )}

        {/* Video */}
        {project.video_url && (
          <div className="relative rounded-2xl overflow-hidden aspect-video bg-dark-blue-2 mb-16 group cursor-pointer"
            onClick={() => { setPlaying(true); videoRef.current?.play() }}>
            <video ref={videoRef} src={project.video_url} className="w-full h-full object-cover" playsInline />
            {!playing && (
              <div className="absolute inset-0 flex items-center justify-center bg-dark/40 group-hover:bg-dark/20 transition-all duration-300">
                <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-accent/30">
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Next project CTA */}
      <div className="border-t border-cream/10 px-6 lg:px-16 py-12 flex items-center justify-between">
        <Link to="/#projects" className="text-cream/40 hover:text-cream text-sm font-semibold tracking-widest uppercase transition-colors">
          ← Tutti i progetti
        </Link>
        <Link to="/contact" className="bg-accent text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-accent/90 transition-all duration-300">
          Lavoriamo insieme
        </Link>
      </div>
    </main>
  )
}
