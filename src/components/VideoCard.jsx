import { useState } from 'react'
import { buildWatchUrl } from '../utils/youtube'

export default function VideoCard({ video, categories, onDelete, onEditCategory, onToggleWatchLater, onToggleWatched }) {
  const [imgError, setImgError] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const category = categories.find(c => c.id === video.categoryId)
  const watchUrl = buildWatchUrl(video.videoId)

  return (
    <div className={`video-card ${video.watched ? 'video-card--watched' : ''}`}>
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
          {video.watched && (
            <div className="video-watched-overlay">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              <span>Watched</span>
            </div>
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
                <button onClick={() => { setMenuOpen(false); onToggleWatched(video.id) }}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    {video.watched
                      ? <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                      : <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    }
                  </svg>
                  {video.watched ? 'Mark as unwatched' : 'Mark as watched'}
                </button>
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

        <div className="video-badges">
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

      <button
        className={`video-watch-later-btn ${video.watchLater ? 'active' : ''}`}
        onClick={e => { e.preventDefault(); onToggleWatchLater(video.id) }}
        title={video.watchLater ? 'Remove from Watch Later' : 'Save to Watch Later'}
        aria-label={video.watchLater ? 'Remove from Watch Later' : 'Save to Watch Later'}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          {video.watchLater
            ? <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
            : <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"/>
          }
        </svg>
      </button>
    </div>
  )
}
