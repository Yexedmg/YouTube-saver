import { useState } from 'react'

export default function EditCategoryModal({ video, categories, onSave, onClose }) {
  const [selectedId, setSelectedId] = useState(video.categoryId || '')

  const parents = categories.filter(c => !c.parentId)
  const childrenOf = id => categories.filter(c => c.parentId === id)

  function renderOption(cat, isChild = false) {
    return (
      <label
        key={cat.id}
        className={`modal-category-option ${isChild ? 'modal-category-option--sub' : ''}`}
      >
        <input
          type="radio"
          name="category"
          value={cat.id}
          checked={selectedId === cat.id}
          onChange={() => setSelectedId(cat.id)}
        />
        {isChild && <span className="modal-sub-indent" />}
        <span className="modal-category-dot" style={{ backgroundColor: cat.color }} />
        {cat.name}
      </label>
    )
  }

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
          {parents.map(parent => (
            <>
              {renderOption(parent, false)}
              {childrenOf(parent.id).map(child => renderOption(child, true))}
            </>
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
