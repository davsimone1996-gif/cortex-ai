import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY
      setScrolled(current > 50)
      setHidden(current > lastScrollY && current > 200)
      setLastScrollY(current)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const navLinks = [
    { label: 'Lavori', href: '/#projects' },
    { label: 'About', href: '/about' },
    { label: 'News', href: '/news' },
    { label: 'Contatti', href: '/contact' },
  ]

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out
          ${scrolled ? 'bg-dark/90 backdrop-blur-md' : 'bg-transparent'}
          ${hidden && !menuOpen ? '-translate-y-full' : 'translate-y-0'}
        `}
      >
        <div className="flex items-center justify-between px-6 lg:px-12 py-5">
          {/* Logo */}
          <Link
            to="/"
            className="text-cream font-black text-xl lg:text-2xl tracking-tight hover:text-accent transition-colors duration-300 z-50 relative"
          >
            HERO<span className="text-accent">.</span>COLLECTIVE
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-cream/70 hover:text-cream text-sm font-medium tracking-widest uppercase hover-underline transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Desktop */}
          <div className="hidden lg:flex items-center gap-6">
            <Link
              to="/admin"
              className="text-cream/50 hover:text-cream text-xs font-medium tracking-widest uppercase transition-colors duration-300"
            >
              Admin
            </Link>
            <a
              href="/contact"
              className="bg-accent text-white text-sm font-semibold px-6 py-2.5 rounded-full
                hover:bg-accent/90 hover:scale-95 transition-all duration-300"
            >
              Lavoriamo insieme
            </a>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 z-50 relative"
            aria-label="Toggle menu"
          >
            <span
              className={`hamburger-line block w-7 h-0.5 bg-cream
                ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}
            />
            <span
              className={`hamburger-line block w-7 h-0.5 bg-cream
                ${menuOpen ? 'opacity-0 scale-x-0' : ''}`}
            />
            <span
              className={`hamburger-line block w-7 h-0.5 bg-cream
                ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}
            />
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 bg-dark flex flex-col justify-center items-center
          transition-all duration-500 ease-in-out
          ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      >
        <nav className="flex flex-col items-center gap-8">
          {navLinks.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`text-cream text-4xl font-black tracking-tight uppercase
                hover:text-accent transition-all duration-300
                ${menuOpen ? 'animate-fade-up' : 'opacity-0'}
              `}
              style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="mt-4 bg-accent text-white text-lg font-semibold px-8 py-3 rounded-full
              hover:bg-accent/90 transition-all duration-300"
          >
            Lavoriamo insieme
          </a>
          <Link
            to="/admin"
            onClick={() => setMenuOpen(false)}
            className="text-cream/30 hover:text-cream text-xs font-semibold tracking-widest uppercase transition-colors duration-300"
          >
            Admin
          </Link>
        </nav>

        <div className="absolute bottom-12 flex items-center gap-8">
          {['Instagram', 'Vimeo', 'LinkedIn'].map((s) => (
            <a
              key={s}
              href="#"
              className="text-cream/40 hover:text-cream text-xs font-medium tracking-widest uppercase transition-colors"
            >
              {s}
            </a>
          ))}
        </div>
      </div>
    </>
  )
}
