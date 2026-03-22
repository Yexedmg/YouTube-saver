import { useState } from 'react'

const PRESET_COLORS = [
  '#FF4444', '#FF8C00', '#FFD700', '#4CAF50',
  '#00BCD4', '#2196F3', '#9C27B0', '#E91E63',
  '#795548', '#607D8B',
]

export default function CategorySidebar({
  categories,
  selectedId,
  videos,
  onSelect,
  onAdd,
  onRename,
  onDelete,
}) {
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(PRESET_COLORS[0])
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editColor, setEditColor] = useState('')

  function submitAdd(e) {
    e.preventDefault()
    if (!newName.trim()) return
    onAdd({ id: crypto.randomUUID(), name: newName.trim(), color: newColor })
    setNewName('')
    setNewColor(PRESET_COLORS[0])
    setAdding(false)
  }

  function startEdit(cat) {
    setEditingId(cat.id)
    setEditName(cat.name)
    setEditColor(cat.color)
  }

  function submitEdit(e) {
    e.preventDefault()
    if (!editName.trim()) return
    onRename(editingId, editName.trim(), editColor)
    setEditingId(null)
  }

  function countForCategory(catId) {
    if (catId === null) return videos.filter(v => !v.categoryId).length
    return videos.filter(v => v.categoryId === catId).length
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="#FF0000">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-2.47 12.35 12.35 0 00-10.15 0A4.83 4.83 0 012.41 6.69 49.15 49.15 0 001 12a49.15 49.15 0 001.41 5.31 4.83 4.83 0 013.77 2.47 12.35 12.35 0 0010.15 0 4.83 4.83 0 013.77-2.47A49.15 49.15 0 0023 12a49.15 49.15 0 00-1.41-5.31zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
        </svg>
        <span className="sidebar-title">YT Saver</span>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`sidebar-item ${selectedId === 'all' ? 'active' : ''}`}
          onClick={() => onSelect('all')}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          All videos
          <span className="sidebar-count">{videos.length}</span>
        </button>

        <button
          className={`sidebar-item ${selectedId === 'uncategorised' ? 'active' : ''}`}
          onClick={() => onSelect('uncategorised')}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M20 6h-2.18c.07-.44.18-.9.18-1.37C18 2.53 15.47 0 12.37 0H12c-3.1 0-5.63 2.53-5.63 5.63 0 .47.11.93.18 1.37H4.5A2.5 2.5 0 002 8.5v11A2.5 2.5 0 004.5 22h15a2.5 2.5 0 002.5-2.5v-11A2.5 2.5 0 0020 6z"/>
          </svg>
          Uncategorised
          <span className="sidebar-count">{countForCategory(null)}</span>
        </button>

        <button
          className={`sidebar-item ${selectedId === 'watch-later' ? 'active' : ''}`}
          onClick={() => onSelect('watch-later')}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"/>
          </svg>
          Watch Later
          <span className="sidebar-count">{videos.filter(v => v.watchLater).length}</span>
        </button>

        <button
          className={`sidebar-item ${selectedId === 'watched' ? 'active' : ''}`}
          onClick={() => onSelect('watched')}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
          </svg>
          Watched
          <span className="sidebar-count">{videos.filter(v => v.watched).length}</span>
        </button>

        <div className="sidebar-divider" />

        <div className="sidebar-section-label">Categories</div>

        {categories.map(cat => (
          <div key={cat.id} className="sidebar-category-row">
            {editingId === cat.id ? (
              <form className="sidebar-edit-form" onSubmit={submitEdit}>
                <span
                  className="sidebar-color-dot"
                  style={{ backgroundColor: editColor }}
                />
                <input
                  className="sidebar-edit-input"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  autoFocus
                />
                <div className="color-picker-row">
                  {PRESET_COLORS.map(c => (
                    <button
                      key={c}
                      type="button"
                      className={`color-swatch ${editColor === c ? 'selected' : ''}`}
                      style={{ backgroundColor: c }}
                      onClick={() => setEditColor(c)}
                    />
                  ))}
                </div>
                <div className="sidebar-edit-actions">
                  <button type="submit" className="btn-primary btn-sm">Save</button>
                  <button type="button" className="btn-secondary btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </form>
            ) : (
              <button
                className={`sidebar-item ${selectedId === cat.id ? 'active' : ''}`}
                onClick={() => onSelect(cat.id)}
              >
                <span className="sidebar-color-dot" style={{ backgroundColor: cat.color }} />
                <span className="sidebar-cat-name">{cat.name}</span>
                <span className="sidebar-count">{countForCategory(cat.id)}</span>
                <span className="sidebar-cat-actions">
                  <span
                    role="button"
                    tabIndex={0}
                    className="icon-btn"
                    title="Edit"
                    onClick={e => { e.stopPropagation(); startEdit(cat) }}
                    onKeyDown={e => e.key === 'Enter' && startEdit(cat)}
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                  </span>
                  <span
                    role="button"
                    tabIndex={0}
                    className="icon-btn danger"
                    title="Delete"
                    onClick={e => { e.stopPropagation(); onDelete(cat.id) }}
                    onKeyDown={e => e.key === 'Enter' && onDelete(cat.id)}
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                  </span>
                </span>
              </button>
            )}
          </div>
        ))}

        {adding ? (
          <form className="sidebar-add-form" onSubmit={submitAdd}>
            <input
              className="sidebar-add-input"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Category name"
              autoFocus
            />
            <div className="color-picker-row">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  className={`color-swatch ${newColor === c ? 'selected' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setNewColor(c)}
                />
              ))}
            </div>
            <div className="sidebar-edit-actions">
              <button type="submit" className="btn-primary btn-sm">Add</button>
              <button type="button" className="btn-secondary btn-sm" onClick={() => setAdding(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          <button className="sidebar-add-category-btn" onClick={() => setAdding(true)}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            New category
          </button>
        )}
      </nav>

      <div className="sidebar-footer">
        <a
          href="#settings"
          className="sidebar-settings-link"
          onClick={e => { e.preventDefault(); document.dispatchEvent(new Event('open-settings')) }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
          </svg>
          Settings
        </a>
      </div>
    </aside>
  )
}
