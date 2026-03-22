import { useState } from 'react'

export default function SettingsModal({ apiKey, onSave, onClose }) {
  const [key, setKey] = useState(apiKey || '')

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Settings</h3>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <div className="settings-section">
          <label className="settings-label">
            YouTube Data API v3 Key
            <span className="settings-optional">(optional — enables video duration)</span>
          </label>
          <input
            className="settings-input"
            type="password"
            value={key}
            onChange={e => setKey(e.target.value)}
            placeholder="AIzaSy..."
            autoComplete="off"
          />
          <p className="settings-hint">
            Get a free API key from the{' '}
            <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer">
              Google Cloud Console
            </a>{' '}
            → Enable "YouTube Data API v3" → Credentials → Create API Key.
            Without a key, video titles and thumbnails still work.
          </p>
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button
            className="btn-primary"
            onClick={() => { onSave(key.trim()); onClose() }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
