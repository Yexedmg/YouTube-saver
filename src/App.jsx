import { useState, useEffect, useCallback } from 'react'
import CategorySidebar from './components/CategorySidebar'
import VideoCard from './components/VideoCard'
import AddVideoForm from './components/AddVideoForm'
import EditCategoryModal from './components/EditCategoryModal'
import SettingsModal from './components/SettingsModal'

const STORAGE_KEY_VIDEOS = 'yt-saver-videos'
const STORAGE_KEY_CATEGORIES = 'yt-saver-categories'
const STORAGE_KEY_API_KEY = 'yt-saver-api-key'

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export default function App() {
  const [videos, setVideos] = useState(() => load(STORAGE_KEY_VIDEOS, []))
  const [categories, setCategories] = useState(() => load(STORAGE_KEY_CATEGORIES, []))
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(STORAGE_KEY_API_KEY) || '')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [editingVideo, setEditingVideo] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [search, setSearch] = useState('')

  // Persist to localStorage
  useEffect(() => { localStorage.setItem(STORAGE_KEY_VIDEOS, JSON.stringify(videos)) }, [videos])
  useEffect(() => { localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories)) }, [categories])
  useEffect(() => { localStorage.setItem(STORAGE_KEY_API_KEY, apiKey) }, [apiKey])

  // Listen for settings event from sidebar
  useEffect(() => {
    const handler = () => setShowSettings(true)
    document.addEventListener('open-settings', handler)
    return () => document.removeEventListener('open-settings', handler)
  }, [])

  function handleAddVideos(newVideos) {
    setVideos(prev => {
      const existingIds = new Set(prev.map(v => v.videoId))
      const toAdd = newVideos.filter(v => !existingIds.has(v.videoId))
      if (toAdd.length === 0) return prev
      return [toAdd[0], ...prev, ...toAdd.slice(1)]
    })
  }

  function handleDeleteVideo(id) {
    setVideos(prev => prev.filter(v => v.id !== id))
  }

  function handleSaveCategory(videoId, categoryId) {
    setVideos(prev => prev.map(v => v.id === videoId ? { ...v, categoryId } : v))
    setEditingVideo(null)
  }

  function handleAddCategory(cat) {
    setCategories(prev => [...prev, cat])
  }

  function handleRenameCategory(id, name, color) {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, name, color } : c))
  }

  function handleDeleteCategory(id) {
    setCategories(prev => prev
      .filter(c => c.id !== id)
      // Promote subcategories to top-level when their parent is deleted
      .map(c => c.parentId === id ? { ...c, parentId: null } : c)
    )
    setVideos(prev => prev.map(v => v.categoryId === id ? { ...v, categoryId: null } : v))
    if (selectedCategory === id) setSelectedCategory('all')
  }

  function handleReparent(id, newParentId) {
    setCategories(prev => prev.map(c => {
      if (c.id === id) return { ...c, parentId: newParentId }
      // Promote any existing subcategories of the moved category to top-level
      if (c.parentId === id && newParentId !== null) return { ...c, parentId: null }
      return c
    }))
  }

  function handleToggleWatchLater(id) {
    setVideos(prev => prev.map(v => v.id === id ? { ...v, watchLater: !v.watchLater } : v))
  }

  function handleToggleWatched(id) {
    setVideos(prev => prev.map(v => v.id === id ? { ...v, watched: !v.watched } : v))
  }

  function handleExport() {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      videos,
      categories,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `yt-saver-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport(file) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        if (!Array.isArray(data.videos) || !Array.isArray(data.categories)) {
          alert('Invalid backup file: missing videos or categories.')
          return
        }
        if (!window.confirm(`This will replace all your current data with ${data.videos.length} video(s) and ${data.categories.length} category/categories from the backup. Continue?`)) return
        setVideos(data.videos)
        setCategories(data.categories)
        setSelectedCategory('all')
      } catch {
        alert('Failed to read backup file. Make sure it is a valid JSON backup.')
      }
    }
    reader.readAsText(file)
  }

  const subcategoryIds = new Set(
    categories.filter(c => c.parentId === selectedCategory).map(c => c.id)
  )

  const filteredVideos = videos.filter(v => {
    const matchesCategory =
      selectedCategory === 'all' ? true :
      selectedCategory === 'uncategorised' ? !v.categoryId :
      selectedCategory === 'watch-later' ? !!v.watchLater :
      selectedCategory === 'watched' ? !!v.watched :
      v.categoryId === selectedCategory || subcategoryIds.has(v.categoryId)

    const q = search.toLowerCase()
    const matchesSearch = !q ||
      v.title.toLowerCase().includes(q) ||
      v.authorName?.toLowerCase().includes(q)

    return matchesCategory && matchesSearch
  })

  const currentCategoryName = selectedCategory === 'all'
    ? 'All videos'
    : selectedCategory === 'uncategorised'
    ? 'Uncategorised'
    : selectedCategory === 'watch-later'
    ? 'Watch Later'
    : selectedCategory === 'watched'
    ? 'Watched'
    : categories.find(c => c.id === selectedCategory)?.name ?? 'Videos'

  return (
    <div className="app">
      <CategorySidebar
        categories={categories}
        selectedId={selectedCategory}
        videos={videos}
        onSelect={setSelectedCategory}
        onAdd={handleAddCategory}
        onRename={handleRenameCategory}
        onDelete={handleDeleteCategory}
        onReparent={handleReparent}
      />

      <main className="main">
        <header className="main-header">
          <div className="main-header-left">
            <h1 className="main-title">{currentCategoryName}</h1>
            {filteredVideos.length > 0 && (
              <span className="main-count">{filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''}</span>
            )}
          </div>
          <div className="main-search-wrapper">
            <svg className="search-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input
              className="main-search"
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search videos…"
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch('')}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            )}
          </div>
        </header>

        <div className="add-video-wrapper">
          <AddVideoForm
            categories={categories}
            selectedCategoryId={selectedCategory !== 'all' && selectedCategory !== 'uncategorised' && selectedCategory !== 'watch-later' && selectedCategory !== 'watched' ? selectedCategory : null}
            apiKey={apiKey}
            onAdd={handleAddVideos}
          />
        </div>

        {filteredVideos.length === 0 ? (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" width="64" height="64" fill="#444">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
            </svg>
            <p>{search ? 'No videos match your search.' : 'No videos yet. Paste a YouTube link above to get started.'}</p>
          </div>
        ) : (
          <div className="video-grid">
            {filteredVideos.map(video => (
              <VideoCard
                key={video.id}
                video={video}
                categories={categories}
                onDelete={handleDeleteVideo}
                onEditCategory={setEditingVideo}
                onToggleWatchLater={handleToggleWatchLater}
                onToggleWatched={handleToggleWatched}
              />
            ))}
          </div>
        )}
      </main>

      {editingVideo && (
        <EditCategoryModal
          video={editingVideo}
          categories={categories}
          onSave={handleSaveCategory}
          onClose={() => setEditingVideo(null)}
        />
      )}

      {showSettings && (
        <SettingsModal
          apiKey={apiKey}
          onSave={setApiKey}
          onClose={() => setShowSettings(false)}
          onExport={handleExport}
          onImport={handleImport}
        />
      )}
    </div>
  )
}
