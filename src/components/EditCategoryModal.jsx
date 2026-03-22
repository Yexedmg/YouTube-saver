import { useState } from 'react'

export default function EditCategoryModal({ video, categories, onSave, onClose }) {
  const [selectedId, setSelectedId] = useState(video.categoryId || '')

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Move to category</h3>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <p className="modal-subtitle" title={video.title}>{video.title}</p>

        <div className="modal-category-list">
          <label className="modal-category-option">
            <input
              type="radio"
              name="category"
              value=""
              checked={selectedId === ''}
              onChange={() => setSelectedId('')}
            />
            <span className="modal-category-dot" style={{ backgroundColor: '#aaa' }} />
            Uncategorised
          </label>
          {categories.map(cat => (
            <label key={cat.id} className="modal-category-option">
              <input
                type="radio"
                name="category"
                value={cat.id}
                checked={selectedId === cat.id}
                onChange={() => setSelectedId(cat.id)}
              />
              <span className="modal-category-dot" style={{ backgroundColor: cat.color }} />
              {cat.name}
            </label>
          ))}
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button
            className="btn-primary"
            onClick={() => onSave(video.id, selectedId || null)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
