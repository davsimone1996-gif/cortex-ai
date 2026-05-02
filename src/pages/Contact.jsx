import { useState, useRef } from 'react'
import { useInView } from '../hooks/useInView'
import { supabase } from '../lib/supabase'

const RATE_LIMIT_MS = 60_000
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const FIELDS_MAX = { name: 100, email: 254, company: 100, message: 2000 }

function validate(form) {
  if (!form.name.trim() || form.name.length > FIELDS_MAX.name) return 'Nome non valido.'
  if (!EMAIL_RE.test(form.email) || form.email.length > FIELDS_MAX.email) return 'Email non valida.'
  if (form.company.length > FIELDS_MAX.company) return 'Azienda: massimo 100 caratteri.'
  if (!form.message.trim() || form.message.length > FIELDS_MAX.message) return `Messaggio richiesto (max ${FIELDS_MAX.message} caratteri).`
  return null
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', company: '', budget: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [ref, inView] = useInView()
  const lastSubmit = useRef(0)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    const validationError = validate(form)
    if (validationError) { setError(validationError); return }

    const now = Date.now()
    if (now - lastSubmit.current < RATE_LIMIT_MS) {
      setError('Hai già inviato un messaggio di recente. Attendi un minuto.')
      return
    }

    setLoading(true)
    const { data: existing } = await supabase
      .from('contacts')
      .select('id')
      .eq('email', form.email.trim().toLowerCase())
      .limit(1)
      .maybeSingle()

    if (existing) {
      setError('Questa email ha già inviato una richiesta. Ti contatteremo presto.')
      setLoading(false)
      return
    }

    const { error: dbError } = await supabase.from('contacts').insert([{
      name: form.name.trim().slice(0, FIELDS_MAX.name),
      email: form.email.trim().toLowerCase().slice(0, FIELDS_MAX.email),
      company: form.company.trim().slice(0, FIELDS_MAX.company),
      budget: form.budget,
      message: form.message.trim().slice(0, FIELDS_MAX.message),
    }])
    setLoading(false)

    if (dbError) {
      setError("Errore nell'invio. Riprova o scrivici direttamente via email.")
    } else {
      lastSubmit.current = Date.now()
      setSent(true)
    }
  }

  return (
    <main className="bg-dark min-h-screen">
      <div className="pt-28 lg:pt-40 pb-24 px-6 lg:px-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24" ref={ref}>
          {/* Left */}
          <div className={`transition-all duration-700 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <span className="inline-flex items-center gap-2 text-accent text-xs font-semibold tracking-widest uppercase mb-6">
              <span className="w-8 h-px bg-accent" />
              Contatti
            </span>
            <h1 className="text-cream text-5xl lg:text-7xl font-black leading-none tracking-tight mb-8">
              Parliamo del<br />
              <span className="text-accent">tuo progetto.</span>
            </h1>
            <p className="text-cream/40 text-base lg:text-lg leading-relaxed mb-12">
              Che si tratti di un brand film, una campagna social o un documentario,
              siamo pronti ad ascoltare la tua idea e costruire qualcosa di straordinario insieme.
            </p>

            <div className="space-y-6">
              {[
                { label: 'Email', value: 'ciao@herocollective.co', href: 'mailto:ciao@herocollective.co' },
                { label: 'Telefono', value: '+39 02 0000 0000', href: 'tel:+390200000000' },
                { label: 'Sede', value: 'Via Roma 1, Milano (MI)', href: null },
              ].map((c) => (
                <div key={c.label}>
                  <p className="text-cream/30 text-xs font-semibold tracking-widest uppercase mb-1">{c.label}</p>
                  {c.href ? (
                    <a href={c.href} className="text-cream text-lg font-semibold hover:text-accent transition-colors hover-underline">
                      {c.value}
                    </a>
                  ) : (
                    <p className="text-cream text-lg font-semibold">{c.value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div className={`transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center gap-6 bg-cream/5 border border-cream/10 rounded-2xl p-12">
                <div className="w-16 h-16 bg-teal/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-cream text-2xl font-black">Messaggio inviato!</h3>
                <p className="text-cream/40">Ti risponderemo entro 24 ore.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {[
                  { key: 'name', label: 'Nome e cognome *', placeholder: 'Mario Rossi', type: 'text', max: FIELDS_MAX.name },
                  { key: 'email', label: 'Email *', placeholder: 'mario@azienda.com', type: 'email', max: FIELDS_MAX.email },
                  { key: 'company', label: 'Azienda / Brand', placeholder: 'Nome della tua azienda', type: 'text', max: FIELDS_MAX.company },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-cream/40 text-xs font-semibold tracking-widest uppercase mb-2">{f.label}</label>
                    <input
                      type={f.type}
                      value={form[f.key]}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                      maxLength={f.max}
                      className="w-full bg-cream/5 border border-cream/10 rounded-xl px-5 py-4 text-cream text-sm
                        focus:outline-none focus:border-accent/50 focus:bg-cream/[0.07] transition-all duration-300
                        placeholder:text-cream/20"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-cream/40 text-xs font-semibold tracking-widest uppercase mb-2">Budget stimato</label>
                  <select
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                    className="w-full bg-cream/5 border border-cream/10 rounded-xl px-5 py-4 text-cream text-sm
                      focus:outline-none focus:border-accent/50 transition-all duration-300 appearance-none"
                  >
                    <option value="" className="bg-dark text-cream/30">Seleziona...</option>
                    <option className="bg-dark">Meno di 5.000€</option>
                    <option className="bg-dark">5.000€ – 15.000€</option>
                    <option className="bg-dark">15.000€ – 50.000€</option>
                    <option className="bg-dark">Oltre 50.000€</option>
                  </select>
                </div>
                <div>
                  <label className="block text-cream/40 text-xs font-semibold tracking-widest uppercase mb-2">
                    Raccontaci il progetto *
                    <span className="ml-2 text-cream/20 normal-case font-normal">
                      {form.message.length}/{FIELDS_MAX.message}
                    </span>
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Descrivi la tua idea, i tempi e gli obiettivi..."
                    rows={5}
                    maxLength={FIELDS_MAX.message}
                    className="w-full bg-cream/5 border border-cream/10 rounded-xl px-5 py-4 text-cream text-sm
                      focus:outline-none focus:border-accent/50 focus:bg-cream/[0.07] transition-all duration-300
                      placeholder:text-cream/20 resize-none"
                  />
                </div>
                {error && (
                  <p className="text-accent text-sm bg-accent/10 border border-accent/20 rounded-xl px-4 py-3">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={loading || !form.name || !form.email || !form.message}
                  className="w-full bg-accent text-white font-bold text-sm py-4 rounded-full
                    hover:bg-accent/90 hover:scale-[0.98] transition-all duration-300
                    disabled:opacity-50 disabled:cursor-not-allowed tracking-widest uppercase"
                >
                  {loading ? 'Invio in corso...' : 'Invia messaggio'}
                </button>
                <p className="text-cream/20 text-xs text-center">
                  Ti risponderemo entro 24 ore lavorative.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
