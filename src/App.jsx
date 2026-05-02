import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import ProjectDetail from './pages/ProjectDetail'
import NewsDetail from './pages/NewsDetail'
import NewsList from './pages/NewsList'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import ProjectsList from './pages/ProjectsList'
import About from './components/About'
import CtaBanner from './components/CtaBanner'

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
            <NewsList />
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

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function AboutPage() {
  return (
    <main className="bg-dark min-h-screen pt-28">
      <About />
      <CtaBanner />
    </main>
  )
}
