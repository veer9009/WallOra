import { ChangeEvent, FormEvent, useMemo, useState } from 'react'

type Wallpaper = {
  id: number
  title: string
  creator: string
  category: string
  size: string
  image: string
  accent: string
  downloads: string
  featured?: boolean
}

const starterWallpapers: Wallpaper[] = [
  { id: 1, title: 'Quiet Geometry', creator: 'Mira Chen', category: 'Abstract', size: '4K', image: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&w=1200&q=85', accent: '#d4f1df', downloads: '12.8k', featured: true },
  { id: 2, title: 'Afterglow', creator: 'WallOra Studio', category: 'Gradient', size: '4K', image: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=85', accent: '#ffd9ba', downloads: '9.4k' },
  { id: 3, title: 'Tokyo Stillness', creator: 'Kenji Ito', category: 'City', size: 'HD', image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=1200&q=85', accent: '#f5e6b8', downloads: '7.1k' },
  { id: 4, title: 'Moss & Morning', creator: 'Nora West', category: 'Nature', size: '4K', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=85', accent: '#cfe6bd', downloads: '6.8k' },
  { id: 5, title: 'Soft Current', creator: 'Ari Sol', category: 'Minimal', size: 'HD', image: 'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1200&q=85', accent: '#d6e9e7', downloads: '5.3k' },
  { id: 6, title: 'Desert Frequency', creator: 'Leo Park', category: 'Texture', size: '4K', image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85', accent: '#f0d0b0', downloads: '4.7k' },
  { id: 7, title: 'Night Bloom', creator: 'Yuna Vale', category: 'Nature', size: 'HD', image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1200&q=85', accent: '#c5d5f0', downloads: '3.9k' },
  { id: 8, title: 'Low Tide', creator: 'Sage House', category: 'Minimal', size: '4K', image: 'https://images.unsplash.com/photo-1507527765035-2e9c6f1f8a1f?auto=format&fit=crop&w=1200&q=85', accent: '#bcdde0', downloads: '3.4k' },
]

const categories = ['All walls', 'Abstract', 'Nature', 'City', 'Minimal', 'Gradient']

function App() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All walls')
  const [query, setQuery] = useState('')
  const [wallpapers, setWallpapers] = useState(starterWallpapers)
  const [notice, setNotice] = useState('')

  const visibleWallpapers = useMemo(() => wallpapers.filter((wallpaper) => {
    const matchesCategory = activeCategory === 'All walls' || wallpaper.category === activeCategory
    const searchText = `${wallpaper.title} ${wallpaper.creator} ${wallpaper.category}`.toLowerCase()
    return matchesCategory && searchText.includes(query.toLowerCase())
  }), [activeCategory, query, wallpapers])

  function handleDownload(title: string) {
    setNotice(`${title} is ready to download.`)
    window.setTimeout(() => setNotice(''), 2600)
  }

  function addWallpaper(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const image = form.get('image') as File
    const imageUrl = image?.size ? URL.createObjectURL(image) : 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=85'
    const newWallpaper: Wallpaper = {
      id: Date.now(), title: String(form.get('title') || 'Untitled wall'), creator: 'WallOra Admin', category: String(form.get('category') || 'Abstract'), size: '4K', image: imageUrl, accent: '#e8d5c4', downloads: '0',
    }
    setWallpapers((current) => [newWallpaper, ...current])
    event.currentTarget.reset()
    setNotice('Wallpaper published to the gallery.')
    window.setTimeout(() => setNotice(''), 2600)
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="WallOra home"><span className="brand-mark">W</span><span>Wall<span>Ora</span></span></a>
        <nav className="main-nav" aria-label="Main navigation"><a className={!isAdmin ? 'active' : ''} href="#gallery" onClick={() => setIsAdmin(false)}>Explore</a><a href="#collections">Collections</a><a href="#about">About</a></nav>
        <div className="top-actions"><button className="icon-button" aria-label="Search" onClick={() => document.getElementById('search')?.focus()}>⌕</button><button className={`admin-switch ${isAdmin ? 'selected' : ''}`} onClick={() => setIsAdmin(!isAdmin)}><span className="status-dot" />{isAdmin ? 'Admin view' : 'Admin login'}</button></div>
      </header>

      {isAdmin ? <AdminPanel onSubmit={addWallpaper} onBack={() => setIsAdmin(false)} /> : <>
        <section className="hero" id="top"><div className="hero-copy"><p className="eyebrow"><span /> Curated for your screen</p><h1>Give your screen<br /><em>some feeling.</em></h1><p className="hero-text">A considered collection of wallpapers for the moments between work, wonder, and everything in between.</p><a className="text-link" href="#gallery">Browse all walls <span>↘</span></a></div><div className="hero-art" aria-label="Featured wallpaper preview"><div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" /><div className="art-sun" /><div className="art-landscape" /><div className="art-caption"><span>01 / 08</span><strong>Quiet Geometry</strong></div></div></section>
        <section className="gallery-section" id="gallery"><div className="section-heading"><div><p className="eyebrow">The wall library</p><h2>Find your <em>next backdrop.</em></h2></div><div className="search-wrap"><span>⌕</span><input id="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search walls" aria-label="Search wallpapers" /></div></div><div className="category-row" role="tablist">{categories.map((category) => <button key={category} className={activeCategory === category ? 'category active' : 'category'} onClick={() => setActiveCategory(category)}>{category}</button>)}</div><div className="wall-grid">{visibleWallpapers.map((wallpaper) => <WallpaperCard key={wallpaper.id} wallpaper={wallpaper} onDownload={handleDownload} />)}</div>{visibleWallpapers.length === 0 && <div className="empty-state">No walls found. Try a different search.</div>}</section>
        <section className="manifesto" id="about"><p className="eyebrow">Why WallOra</p><h2>Less noise.<br /><em>More atmosphere.</em></h2><p>We believe the image behind your windows should feel like a small daily ritual. Every wall is selected for mood, detail, and the way it holds up over time.</p><span className="manifesto-line" /></section>
        <footer><span>© 2026 WallOra</span><span>Made for the in-between moments</span><a href="#top">Back to top ↑</a></footer>
      </>}
      {notice && <div className="toast" role="status"><span>✓</span>{notice}</div>}
    </main>
  )
}

function WallpaperCard({ wallpaper, onDownload }: { wallpaper: Wallpaper; onDownload: (title: string) => void }) {
  return <article className="wall-card"><div className="wall-image" style={{ backgroundImage: `url(${wallpaper.image})`, backgroundColor: wallpaper.accent }}><span className="size-tag">{wallpaper.size}</span><button className="download-button" onClick={() => onDownload(wallpaper.title)} aria-label={`Download ${wallpaper.title}`}>↓</button></div><div className="card-meta"><div><h3>{wallpaper.title}</h3><p>{wallpaper.creator} <span>·</span> {wallpaper.category}</p></div><span className="downloads">↓ {wallpaper.downloads}</span></div></article>
}

function AdminPanel({ onSubmit, onBack }: { onSubmit: (event: FormEvent<HTMLFormElement>) => void; onBack: () => void }) {
  const [preview, setPreview] = useState('')
  function handleFile(event: ChangeEvent<HTMLInputElement>) { const file = event.target.files?.[0]; if (file) setPreview(URL.createObjectURL(file)) }
  return <section className="admin-panel"><div className="admin-heading"><div><p className="eyebrow">Private workspace</p><h1>WallOra <em>Admin.</em></h1><p>Publish a new wall to the library.</p></div><button className="back-button" onClick={onBack}>← Back to gallery</button></div><div className="admin-content"><form className="upload-form" onSubmit={onSubmit}><label>Wall title<input name="title" required placeholder="e.g. Soft Horizon" /></label><label>Category<select name="category" defaultValue="Abstract"><option>Abstract</option><option>Nature</option><option>City</option><option>Minimal</option><option>Gradient</option><option>Texture</option></select></label><label>Wallpaper file<div className={`file-drop ${preview ? 'has-preview' : ''}`} style={preview ? { backgroundImage: `url(${preview})` } : undefined}><input name="image" type="file" accept="image/*" onChange={handleFile} required={!preview} />{!preview && <><span className="upload-symbol">＋</span><strong>Choose an image</strong><small>PNG, JPG up to 20MB</small></>}</div></label><button className="publish-button" type="submit">Publish wallpaper <span>↗</span></button></form><aside className="admin-aside"><div className="admin-stat"><span>Total walls</span><strong>128</strong><small>+12 this month</small></div><div className="admin-stat"><span>Downloads</span><strong>84.6k</strong><small>Across the library</small></div><div className="admin-note"><span>✦</span><p>Keep the library feeling intentional. A good wall makes a room, even when it is only a desktop.</p></div></aside></div></section>
}

export default App
