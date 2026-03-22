import { useState, useRef } from 'react'

export default function SettingsModal({ apiKey, onSave, onClose, onExport, onImport }) {
  const [key, setKey] = useState(apiKey || '')
  const fileInputRef = useRef(null)

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (file) {
      onImport(file)
      e.target.value = ''
    }
  }

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

        <div className="settings-section">
          <label className="settings-label">Backup & Restore</label>
          <p className="settings-hint">
            Export your videos and categories as a JSON file to back up or transfer your data to another device.
          </p>
          <div className="backup-actions">
            <button className="btn-backup" onClick={onExport}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zm-8 2V5h2v6h1.17L12 13.17 9.83 11H11zm-6 7h14v2H5z"/>
              </svg>
              Export backup
            </button>
            <button className="btn-backup btn-backup-import" onClick={() => fileInputRef.current?.click()}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5z"/>
              </svg>
              Import backup
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>
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
