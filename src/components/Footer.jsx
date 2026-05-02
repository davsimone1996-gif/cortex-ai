import { Link } from 'react-router-dom'

const socials = [
  { label: 'Instagram', href: '#' },
  { label: 'Vimeo', href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'YouTube', href: '#' },
]

const links = {
  Agenzia: [
    { label: 'Chi siamo', href: '/about' },
    { label: 'Lavori', href: '/#projects' },
    { label: 'News', href: '/news' },
    { label: 'Contatti', href: '/contact' },
  ],
  Servizi: [
    { label: 'Video Production', href: '#' },
    { label: 'Brand Film', href: '#' },
    { label: 'Documentari', href: '#' },
    { label: 'Social Content', href: '#' },
    { label: 'Motion Graphics', href: '#' },
  ],
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-dark border-t border-cream/10">
      {/* Top section */}
      <div className="px-6 lg:px-16 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
          {/* Brand col */}
          <div className="lg:col-span-2">
            <Link to="/" className="text-cream font-black text-3xl tracking-tight mb-6 inline-block">
              HERO<span className="text-accent">.</span>COLLECTIVE
            </Link>
            <p className="text-cream/40 text-sm leading-relaxed max-w-sm mb-8">
              Agenzia creativa di produzione video con base a Milano.
              Creiamo contenuti che connettono brand e persone attraverso storie autentiche.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-6">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="text-cream/30 hover:text-cream text-xs font-semibold tracking-widest uppercase transition-colors duration-300 hover-underline"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-cream/30 text-xs font-semibold tracking-widest uppercase mb-6">
                {title}
              </h4>
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-cream/60 hover:text-cream text-sm font-medium hover-underline transition-colors duration-300"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-cream/10 px-6 lg:px-16 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-cream/20 text-xs font-medium tracking-wide">
          © {year} Hero Collective. Tutti i diritti riservati.
        </p>
        <div className="flex items-center gap-6">
          <a href="#" className="text-cream/20 hover:text-cream/40 text-xs transition-colors duration-300">
            Privacy Policy
          </a>
          <a href="#" className="text-cream/20 hover:text-cream/40 text-xs transition-colors duration-300">
            Cookie Policy
          </a>
          <Link to="/admin" className="text-cream/10 hover:text-cream/30 text-xs transition-colors duration-300">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
