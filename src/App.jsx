import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import ProjectDetail from './pages/ProjectDetail'
import NewsDetail from './pages/NewsDetail'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import ProjectsList from './pages/ProjectsList'

function Layout({ children, hideNav = false }) {
  return (
    <>
      {!hideNav && <Navbar />}
      {children}
      {!hideNav && <Footer />}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={
          <Layout>
            <Home />
          </Layout>
        } />
        <Route path="/projects" element={
          <Layout>
            <ProjectsList />
          </Layout>
        } />
        <Route path="/projects/:slug" element={
          <Layout>
            <ProjectDetail />
          </Layout>
        } />
        <Route path="/news" element={
          <Layout>
            <NewsListPage />
          </Layout>
        } />
        <Route path="/news/:slug" element={
          <Layout>
            <NewsDetail />
          </Layout>
        } />
        <Route path="/contact" element={
          <Layout>
            <Contact />
          </Layout>
        } />
        <Route path="/about" element={
          <Layout>
            <AboutPage />
          </Layout>
        } />
        <Route path="/login" element={
          <Layout hideNav>
            <Login />
          </Layout>
        } />
        <Route path="/admin" element={
          <Layout hideNav>
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          </Layout>
        } />
      </Routes>
    </BrowserRouter>
  )
}

// Inline simple pages
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}
import { supabase } from './lib/supabase'
import News from './components/News'
import About from './components/About'
import CtaBanner from './components/CtaBanner'

function NewsListPage() {
  const [articles, setArticles] = useState([])
  useEffect(() => {
    supabase.from('articles').select('*').order('date', { ascending: false })
      .then(({ data }) => { if (data) setArticles(data) })
  }, [])

  return (
    <main className="bg-dark min-h-screen pt-28 lg:pt-36">
      <div className="px-6 lg:px-16 pb-8 max-w-7xl mx-auto">
        <span className="inline-flex items-center gap-2 text-teal text-xs font-semibold tracking-widest uppercase mb-4">
          <span className="w-8 h-px bg-teal" />News
        </span>
        <h1 className="text-cream text-5xl lg:text-7xl font-black leading-none tracking-tight mb-4">
          Articoli & Insights
        </h1>
        <p className="text-cream/40 text-base max-w-xl">
          Storie dal nostro studio, approfondimenti sul mondo video e case study dei nostri lavori.
        </p>
      </div>
      <News articles={articles} />
      <CtaBanner />
    </main>
  )
}

function AboutPage() {
  return (
    <main className="bg-dark min-h-screen pt-28">
      <About />
      <CtaBanner />
    </main>
  )
}
