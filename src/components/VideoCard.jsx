import { useState } from 'react'
import { buildWatchUrl } from '../utils/youtube'

export default function VideoCard({ video, categories, onDelete, onEditCategory }) {
  const [imgError, setImgError] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const category = categories.find(c => c.id === video.categoryId)
  const watchUrl = buildWatchUrl(video.videoId)

  return (
    <div className="video-card">
      <a
        className="video-thumbnail-link"
        href={watchUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="video-thumbnail-wrapper">
          <img
            className="video-thumbnail"
            src={imgError
              ? `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`
              : video.thumbnailUrl}
            alt={video.title}
            onError={() => setImgError(true)}
          />
          {video.duration && (
            <span className="video-duration">{video.duration}</span>
          )}
        </div>
      </a>

      <div className="video-info">
        <div className="video-title-row">
          <a
            className="video-title"
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={video.title}
          >
            {video.title}
          </a>
          <div className="video-menu-wrapper">
            <button
              className="video-menu-btn"
              onClick={() => setMenuOpen(o => !o)}
              aria-label="More options"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <circle cx="12" cy="5" r="1.5"/>
                <circle cx="12" cy="12" r="1.5"/>
                <circle cx="12" cy="19" r="1.5"/>
              </svg>
            </button>
            {menuOpen && (
              <div className="video-menu" onMouseLeave={() => setMenuOpen(false)}>
                <button onClick={() => { setMenuOpen(false); onEditCategory(video) }}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                  </svg>
                  Move to category
                </button>
                <button className="danger" onClick={() => { setMenuOpen(false); onDelete(video.id) }}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>

        <a
          className="video-author"
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {video.authorName}
        </a>

        {category && (
          <span
            className="video-category-badge"
            style={{ backgroundColor: category.color + '22', color: category.color, borderColor: category.color + '44' }}
          >
            {category.name}
          </span>
        )}
      </div>
    </div>
  )
}
