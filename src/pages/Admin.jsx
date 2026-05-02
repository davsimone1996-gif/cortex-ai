import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, BUCKETS } from '../lib/supabase'

const TABS = ['Progetti', 'News', 'Reel', 'Richieste', 'Impostazioni']

function UploadButton({ onUpload, accept, label, bucket, path }) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [url, setUrl] = useState(null)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  async function handleChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)
    setProgress(10)

    const filePath = path ? `${path}/${Date.now()}-${file.name}` : `${Date.now()}-${file.name}`

    const { data, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      setError(uploadError.message)
      setUploading(false)
      return
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath)
    setUrl(urlData.publicUrl)
    setProgress(100)
    setUploading(false)
    onUpload?.(urlData.publicUrl, file.name)
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className={`w-full flex items-center justify-center gap-3 border-2 border-dashed rounded-xl py-6 px-4
          transition-all duration-300 text-sm font-semibold
          ${uploading
            ? 'border-accent/40 text-accent/60 bg-accent/5 cursor-wait'
            : 'border-cream/20 text-cream/40 hover:border-accent/50 hover:text-cream hover:bg-accent/5 cursor-pointer'
          }`}
      >
        {uploading ? (
          <>
            <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            Caricamento...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            {label}
          </>
        )}
      </button>
      {uploading && (
        <div className="w-full bg-cream/10 rounded-full h-1.5">
          <div className="bg-accent h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      )}
      {url && (
        <p className="text-teal text-xs font-medium flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          File caricato con successo
        </p>
      )}
      {error && (
        <p className="text-accent text-xs">{error}</p>
      )}
    </div>
  )
}

function Input({ label, value, onChange, placeholder, type = 'text', required }) {
  return (
    <div>
      <label className="block text-cream/50 text-xs font-semibold tracking-widest uppercase mb-2">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-cream/5 border border-cream/10 rounded-lg px-4 py-3 text-cream text-sm
          focus:outline-none focus:border-accent/50 focus:bg-cream/[0.07] transition-all duration-300
          placeholder:text-cream/20"
      />
    </div>
  )
}

function Textarea({ label, value, onChange, placeholder, rows = 4 }) {
  return (
    <div>
      <label className="block text-cream/50 text-xs font-semibold tracking-widest uppercase mb-2">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-cream/5 border border-cream/10 rounded-lg px-4 py-3 text-cream text-sm
          focus:outline-none focus:border-accent/50 focus:bg-cream/[0.07] transition-all duration-300
          placeholder:text-cream/20 resize-none"
      />
    </div>
  )
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-cream/50 text-xs font-semibold tracking-widest uppercase mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-cream/5 border border-cream/10 rounded-lg px-4 py-3 text-cream text-sm
          focus:outline-none focus:border-accent/50 transition-all duration-300 appearance-none cursor-pointer"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-dark">{o}</option>
        ))}
      </select>
    </div>
  )
}

// ─── Progetti Tab ─────────────────────────────────────────────────────────────
function ProjectsTab() {
  const [form, setForm] = useState({
    title: '', client: '', category: 'Brand Film', year: String(new Date().getFullYear()),
    description: '', slug: '', thumbnail_url: '', video_url: '', featured: false,
  })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  function slugify(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const payload = { ...form, slug: form.slug || slugify(form.title) }
    const { error: dbError } = await supabase.from('projects').insert([payload])

    if (dbError) {
      if (dbError.code === '23505') {
        setError('Esiste già un progetto con questo slug. Modifica il campo "Slug URL" per renderlo univoco (es. aggiungi l\'anno o il cliente).')
      } else {
        setError(dbError.message)
      }
    } else {
      setSuccess(true)
      setForm({ title: '', client: '', category: 'Brand Film', year: String(new Date().getFullYear()), description: '', slug: '', thumbnail_url: '', video_url: '', featured: false })
      setTimeout(() => setSuccess(false), 4000)
    }
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Titolo" value={form.title} onChange={(v) => setForm({ ...form, title: v, slug: slugify(v) })} placeholder="Es. Brand Film Nike" required />
        <Input label="Cliente" value={form.client} onChange={(v) => setForm({ ...form, client: v })} placeholder="Nome del cliente" required />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Select label="Categoria" value={form.category} onChange={(v) => setForm({ ...form, category: v })} options={['Brand Film', 'Documentario', 'Social', 'Spot']} />
        <Input label="Anno" value={form.year} onChange={(v) => setForm({ ...form, year: v })} placeholder="2024" />
        <Input label="Slug URL" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} placeholder="brand-film-nike" />
      </div>
      <Textarea label="Descrizione" value={form.description} onChange={(v) => setForm({ ...form, description: v })} placeholder="Descrivi il progetto..." />
      <div>
        <label className="block text-cream/50 text-xs font-semibold tracking-widest uppercase mb-2">
          Thumbnail (immagine di copertina)
        </label>
        <UploadButton
          bucket={BUCKETS.IMAGES}
          path="projects"
          accept="image/*"
          label="Carica immagine di copertina"
          onUpload={(url) => setForm({ ...form, thumbnail_url: url })}
        />
        {form.thumbnail_url && (
          <input type="text" value={form.thumbnail_url} readOnly
            className="mt-2 w-full bg-teal/10 border border-teal/20 rounded px-3 py-2 text-teal text-xs font-mono" />
        )}
      </div>
      <div>
        <label className="block text-cream/50 text-xs font-semibold tracking-widest uppercase mb-2">
          Video del progetto
        </label>
        <UploadButton
          bucket={BUCKETS.VIDEOS}
          path="projects"
          accept="video/*"
          label="Carica video (MP4, MOV, WebM)"
          onUpload={(url) => setForm({ ...form, video_url: url })}
        />
        {form.video_url && (
          <input type="text" value={form.video_url} readOnly
            className="mt-2 w-full bg-teal/10 border border-teal/20 rounded px-3 py-2 text-teal text-xs font-mono" />
        )}
      </div>
      <div className="flex items-center gap-3">
        <input type="checkbox" id="featured" checked={form.featured}
          onChange={(e) => setForm({ ...form, featured: e.target.checked })}
          className="w-4 h-4 accent-accent cursor-pointer" />
        <label htmlFor="featured" className="text-cream/60 text-sm cursor-pointer">
          In evidenza sulla home
        </label>
      </div>
      {error && <p className="text-accent text-sm bg-accent/10 border border-accent/20 rounded-lg px-4 py-3">{error}</p>}
      {success && <p className="text-teal text-sm bg-teal/10 border border-teal/20 rounded-lg px-4 py-3">✓ Progetto salvato con successo!</p>}
      <button type="submit" disabled={saving || !form.title || !form.client}
        className="bg-accent text-white font-bold text-sm px-8 py-3 rounded-full
          hover:bg-accent/90 hover:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
        {saving ? 'Salvataggio...' : 'Pubblica progetto'}
      </button>
    </form>
  )
}

// ─── News Tab ─────────────────────────────────────────────────────────────────
function NewsTab() {
  const [form, setForm] = useState({
    title: '', excerpt: '', content: '', category: 'Behind the scenes',
    date: new Date().toISOString().split('T')[0], slug: '', image_url: '',
  })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  function slugify(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const payload = { ...form, slug: form.slug || slugify(form.title) }
    const { error: dbError } = await supabase.from('articles').insert([payload])
    if (dbError) { setError(dbError.message) }
    else {
      setSuccess(true)
      setForm({ title: '', excerpt: '', content: '', category: 'Behind the scenes', date: new Date().toISOString().split('T')[0], slug: '', image_url: '' })
      setTimeout(() => setSuccess(false), 4000)
    }
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Titolo" value={form.title} onChange={(v) => setForm({ ...form, title: v, slug: slugify(v) })} placeholder="Titolo articolo" required />
        <Select label="Categoria" value={form.category} onChange={(v) => setForm({ ...form, category: v })} options={['Behind the scenes', 'Industry', 'Case study', 'Tips', 'News']} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Data pubblicazione" value={form.date} onChange={(v) => setForm({ ...form, date: v })} type="date" />
        <Input label="Slug URL" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} placeholder="titolo-articolo" />
      </div>
      <Textarea label="Sommario (excerpt)" value={form.excerpt} onChange={(v) => setForm({ ...form, excerpt: v })} placeholder="Breve descrizione visualizzata in anteprima..." rows={2} />
      <Textarea label="Contenuto completo" value={form.content} onChange={(v) => setForm({ ...form, content: v })} placeholder="Testo completo dell'articolo..." rows={8} />
      <div>
        <label className="block text-cream/50 text-xs font-semibold tracking-widest uppercase mb-2">Immagine articolo</label>
        <UploadButton bucket={BUCKETS.IMAGES} path="articles" accept="image/*" label="Carica immagine di copertina" onUpload={(url) => setForm({ ...form, image_url: url })} />
        {form.image_url && (
          <input type="text" value={form.image_url} readOnly className="mt-2 w-full bg-teal/10 border border-teal/20 rounded px-3 py-2 text-teal text-xs font-mono" />
        )}
      </div>
      {error && <p className="text-accent text-sm bg-accent/10 border border-accent/20 rounded-lg px-4 py-3">{error}</p>}
      {success && <p className="text-teal text-sm bg-teal/10 border border-teal/20 rounded-lg px-4 py-3">✓ Articolo pubblicato con successo!</p>}
      <button type="submit" disabled={saving || !form.title}
        className="bg-accent text-white font-bold text-sm px-8 py-3 rounded-full hover:bg-accent/90 hover:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
        {saving ? 'Salvataggio...' : 'Pubblica articolo'}
      </button>
    </form>
  )
}

// ─── Reel Tab ─────────────────────────────────────────────────────────────────
function ReelTab() {
  const [reelUrl, setReelUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  async function handleSave() {
    if (!reelUrl) return
    setSaving(true)
    setError(null)
    const { error: dbError } = await supabase.from('settings').upsert([{ key: 'reel_url', value: reelUrl }], { onConflict: 'key' })
    if (dbError) { setError(dbError.message) }
    else { setSuccess(true); setTimeout(() => setSuccess(false), 4000) }
    setSaving(false)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <p className="text-cream/40 text-sm leading-relaxed">
        Carica il video showreel che verrà mostrato nella sezione principale del sito.
        Usa un video MP4 o WebM per la massima compatibilità.
      </p>
      <div>
        <label className="block text-cream/50 text-xs font-semibold tracking-widest uppercase mb-2">Video Showreel</label>
        <UploadButton bucket={BUCKETS.VIDEOS} path="reel" accept="video/*" label="Carica Showreel (MP4, MOV, WebM)" onUpload={(url) => setReelUrl(url)} />
      </div>
      {reelUrl && (
        <>
          <div>
            <label className="block text-cream/50 text-xs font-semibold tracking-widest uppercase mb-2">URL del reel</label>
            <input type="text" value={reelUrl} readOnly className="w-full bg-teal/10 border border-teal/20 rounded-lg px-4 py-3 text-teal text-xs font-mono" />
          </div>
          <div className="rounded-xl overflow-hidden aspect-video bg-dark-blue-2">
            <video src={reelUrl} controls className="w-full h-full object-cover" />
          </div>
        </>
      )}
      {error && <p className="text-accent text-sm bg-accent/10 border border-accent/20 rounded-lg px-4 py-3">{error}</p>}
      {success && <p className="text-teal text-sm bg-teal/10 border border-teal/20 rounded-lg px-4 py-3">✓ Reel aggiornato con successo!</p>}
      <button onClick={handleSave} disabled={!reelUrl || saving}
        className="bg-accent text-white font-bold text-sm px-8 py-3 rounded-full hover:bg-accent/90 hover:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
        {saving ? 'Salvataggio...' : 'Salva reel'}
      </button>
    </div>
  )
}

// ─── Richieste Tab ────────────────────────────────────────────────────────────
function ContactsTab() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchContacts() {
    const { data } = await supabase.from('contacts').select('*').order('created_at', { ascending: false })
    if (data) setContacts(data)
    setLoading(false)
  }

  async function toggleRead(id, current) {
    await supabase.from('contacts').update({ read: !current }).eq('id', id)
    setContacts((prev) => prev.map((c) => c.id === id ? { ...c, read: !current } : c))
  }

  useState(() => { fetchContacts() }, [])

  const unread = contacts.filter((c) => !c.read).length

  if (loading) return <p className="text-cream/30 text-sm">Caricamento...</p>

  if (contacts.length === 0) return (
    <div className="text-center py-16 text-cream/20">
      <p className="text-4xl mb-4">📭</p>
      <p className="text-sm">Nessuna richiesta ricevuta.</p>
    </div>
  )

  return (
    <div className="space-y-4 max-w-3xl">
      {unread > 0 && (
        <p className="text-accent text-xs font-semibold tracking-widest uppercase">
          {unread} {unread === 1 ? 'nuova richiesta' : 'nuove richieste'}
        </p>
      )}
      {contacts.map((c) => (
        <div
          key={c.id}
          className={`border rounded-xl p-6 transition-all duration-300
            ${c.read ? 'border-cream/10 bg-cream/[0.02]' : 'border-accent/30 bg-accent/5'}`}
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-cream font-bold">{c.name}</span>
                {!c.read && (
                  <span className="text-[10px] font-bold tracking-widest uppercase bg-accent text-white px-2 py-0.5 rounded-full">
                    Nuovo
                  </span>
                )}
              </div>
              <a href={`mailto:${c.email}`} className="text-teal text-sm hover:underline">{c.email}</a>
              {c.company && <span className="text-cream/30 text-sm ml-3">· {c.company}</span>}
            </div>
            <div className="text-right shrink-0">
              <p className="text-cream/30 text-xs">
                {new Date(c.created_at).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
              {c.budget && (
                <span className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-teal/10 text-teal">
                  {c.budget}
                </span>
              )}
            </div>
          </div>

          <p className="text-cream/60 text-sm leading-relaxed whitespace-pre-wrap border-t border-cream/10 pt-4">
            {c.message}
          </p>

          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-cream/10">
            <a
              href={`mailto:${c.email}?subject=Re: la tua richiesta`}
              className="text-xs font-semibold text-cream/40 hover:text-cream transition-colors tracking-widest uppercase"
            >
              Rispondi via email
            </a>
            <button
              onClick={() => toggleRead(c.id, c.read)}
              className="text-xs font-semibold text-cream/40 hover:text-cream transition-colors tracking-widest uppercase ml-auto"
            >
              {c.read ? 'Segna come non letto' : 'Segna come letto'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Impostazioni Tab ─────────────────────────────────────────────────────────
function SettingsTab() {
  return (
    <div className="space-y-8 max-w-2xl">
      <div className="bg-cream/5 border border-cream/10 rounded-xl p-6">
        <h3 className="text-cream font-bold mb-2">Connessione Supabase</h3>
        <p className="text-cream/40 text-sm mb-4">
          Configura le credenziali Supabase nel file <code className="text-teal bg-teal/10 px-1.5 py-0.5 rounded text-xs">.env</code>.
        </p>
        <div className="bg-dark rounded-lg p-4 font-mono text-xs space-y-1">
          <p className="text-cream/40"># .env (crea questo file nella root del progetto)</p>
          <p className="text-teal">VITE_SUPABASE_URL<span className="text-cream/40">=</span><span className="text-cream">https://xxx.supabase.co</span></p>
          <p className="text-teal">VITE_SUPABASE_ANON_KEY<span className="text-cream/40">=</span><span className="text-cream">eyJ...</span></p>
        </div>
      </div>
      <div className="bg-cream/5 border border-cream/10 rounded-xl p-6">
        <h3 className="text-cream font-bold mb-2">Schema database SQL</h3>
        <p className="text-cream/40 text-sm mb-4">
          Esegui questo SQL nel tuo progetto Supabase (SQL Editor):
        </p>
        <div className="bg-dark rounded-lg p-4 font-mono text-xs text-cream/50 space-y-1 overflow-auto max-h-64">
          <p className="text-cream/30">-- Tabella progetti</p>
          <p>CREATE TABLE projects (</p>
          <p className="pl-4">id BIGSERIAL PRIMARY KEY,</p>
          <p className="pl-4">title TEXT NOT NULL,</p>
          <p className="pl-4">client TEXT,</p>
          <p className="pl-4">category TEXT,</p>
          <p className="pl-4">year TEXT,</p>
          <p className="pl-4">description TEXT,</p>
          <p className="pl-4">slug TEXT UNIQUE NOT NULL,</p>
          <p className="pl-4">thumbnail_url TEXT,</p>
          <p className="pl-4">video_url TEXT,</p>
          <p className="pl-4">featured BOOLEAN DEFAULT false,</p>
          <p className="pl-4">created_at TIMESTAMPTZ DEFAULT now()</p>
          <p>);</p>
          <p className="mt-2 text-cream/30">-- Tabella articoli</p>
          <p>CREATE TABLE articles (</p>
          <p className="pl-4">id BIGSERIAL PRIMARY KEY,</p>
          <p className="pl-4">title TEXT NOT NULL,</p>
          <p className="pl-4">excerpt TEXT,</p>
          <p className="pl-4">content TEXT,</p>
          <p className="pl-4">category TEXT,</p>
          <p className="pl-4">date DATE,</p>
          <p className="pl-4">slug TEXT UNIQUE NOT NULL,</p>
          <p className="pl-4">image_url TEXT,</p>
          <p className="pl-4">created_at TIMESTAMPTZ DEFAULT now()</p>
          <p>);</p>
          <p className="mt-2 text-cream/30">-- Tabella impostazioni</p>
          <p>CREATE TABLE settings (</p>
          <p className="pl-4">key TEXT PRIMARY KEY,</p>
          <p className="pl-4">value TEXT</p>
          <p>);</p>
          <p className="mt-2 text-cream/30">-- Abilita Row Level Security (opzionale per lettura pubblica)</p>
          <p>ALTER TABLE projects ENABLE ROW LEVEL SECURITY;</p>
          <p>ALTER TABLE articles ENABLE ROW LEVEL SECURITY;</p>
          <p>ALTER TABLE settings ENABLE ROW LEVEL SECURITY;</p>
          <p className="mt-2 text-cream/30">-- Policy di lettura pubblica</p>
          <p>CREATE POLICY "Public read" ON projects FOR SELECT USING (true);</p>
          <p>CREATE POLICY "Public read" ON articles FOR SELECT USING (true);</p>
          <p>CREATE POLICY "Public read" ON settings FOR SELECT USING (true);</p>
        </div>
      </div>
      <div className="bg-cream/5 border border-cream/10 rounded-xl p-6">
        <h3 className="text-cream font-bold mb-2">Storage Buckets</h3>
        <p className="text-cream/40 text-sm mb-4">Crea questi bucket nel pannello Storage di Supabase:</p>
        <div className="space-y-2">
          {[
            { name: 'videos', desc: 'Video showreel e video dei progetti', public: true },
            { name: 'images', desc: 'Thumbnail progetti e immagini articoli', public: true },
          ].map((b) => (
            <div key={b.name} className="flex items-center justify-between bg-dark rounded-lg px-4 py-3">
              <div>
                <span className="text-teal font-mono text-sm">{b.name}</span>
                <span className="text-cream/30 text-xs ml-3">{b.desc}</span>
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-teal/10 text-teal">Pubblico</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────
export default function Admin() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Progetti')

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const tabContent = {
    'Progetti': <ProjectsTab />,
    'News': <NewsTab />,
    'Reel': <ReelTab />,
    'Richieste': <ContactsTab />,
    'Impostazioni': <SettingsTab />,
  }

  return (
    <div className="min-h-screen bg-dark text-cream">
      {/* Header */}
      <div className="border-b border-cream/10 px-6 lg:px-16 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-cream font-black text-xl">
            HERO<span className="text-accent">.</span>COLLECTIVE — Admin
          </h1>
          <p className="text-cream/30 text-xs mt-0.5">Pannello di gestione contenuti</p>
        </div>
        <div className="flex items-center gap-4">
          <a href="/" className="text-cream/40 hover:text-cream text-xs font-semibold tracking-widest uppercase transition-colors">
            ← Vai al sito
          </a>
          <button
            onClick={handleLogout}
            className="text-cream/40 hover:text-accent text-xs font-semibold tracking-widest uppercase transition-colors"
          >
            Esci
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <div className="lg:w-56 border-b lg:border-b-0 lg:border-r border-cream/10 p-4 lg:p-6 flex lg:flex-col gap-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
                ${activeTab === tab
                  ? 'bg-accent text-white'
                  : 'text-cream/40 hover:text-cream hover:bg-cream/5'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-6 lg:p-12">
          <h2 className="text-cream text-2xl font-black mb-2">{activeTab}</h2>
          <p className="text-cream/30 text-sm mb-8 border-b border-cream/10 pb-8">
            {activeTab === 'Progetti' && 'Aggiungi e gestisci i tuoi lavori nel portfolio.'}
            {activeTab === 'News' && 'Pubblica articoli, case study e contenuti editoriali.'}
            {activeTab === 'Reel' && 'Carica il tuo showreel principale.'}
            {activeTab === 'Richieste' && 'Messaggi ricevuti dal form di contatto.'}
            {activeTab === 'Impostazioni' && 'Configurazione tecnica di Supabase e database.'}
          </p>
          {tabContent[activeTab]}
        </div>
      </div>
    </div>
  )
}
