import { useEffect, useState } from 'react'
import Hero from '../components/Hero'
import About from '../components/About'
import VideoReel from '../components/VideoReel'
import Projects from '../components/Projects'
import News from '../components/News'
import CtaBanner from '../components/CtaBanner'
import MarqueeBand from '../components/MarqueeBand'
import { supabase } from '../lib/supabase'

const MARQUEE_ITEMS = [
  'Video Production', 'Brand Film', 'Documentari',
  'Motion Design', 'Post-Produzione', 'Social Content',
  'Regia', 'Fotografia', 'Storytelling',
]

export default function Home() {
  const [projects, setProjects] = useState([])
  const [articles, setArticles] = useState([])
  const [reelUrl, setReelUrl] = useState(null)

  useEffect(() => {
    async function fetchData() {
      const [{ data: proj }, { data: arts }, { data: settings }] = await Promise.all([
        supabase.from('projects').select('*').order('created_at', { ascending: false }).limit(6),
        supabase.from('articles').select('*').order('date', { ascending: false }).limit(3),
        supabase.from('settings').select('value').eq('key', 'reel_url').single(),
      ])
      if (proj) setProjects(proj)
      if (arts) setArticles(arts)
      if (settings?.value) setReelUrl(settings.value)
    }
    fetchData()
  }, [])

  return (
    <main>
      <Hero />

      <MarqueeBand
        items={MARQUEE_ITEMS}
        className="bg-accent text-white py-5"
      />

      <About />

      <VideoReel reelUrl={reelUrl} />

      <Projects projects={projects} />

      <News articles={articles} />

      <CtaBanner />
    </main>
  )
}
