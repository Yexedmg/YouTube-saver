import { useState } from 'react'
import { extractVideoId, fetchVideoMetadata, fetchVideoDuration, parseDuration, getThumbnailUrl, getMaxResThumbnailUrl } from '../utils/youtube'

export default function AddVideoForm({ categories, selectedCategoryId, apiKey, onAdd }) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const lines = input.split(/[\n,]+/).map(s => s.trim()).filter(Boolean)
    if (lines.length === 0) return

    setLoading(true)
    const results = []

    for (const line of lines) {
      const videoId = extractVideoId(line)
      if (!videoId) {
        setError(`Could not extract video ID from: "${line}"`)
        continue
      }

      try {
        const meta = await fetchVideoMetadata(videoId)
        let duration = null
        if (apiKey) {
          try {
            const rawDuration = await fetchVideoDuration(videoId, apiKey)
            duration = parseDuration(rawDuration)
          } catch {
            // duration stays null
          }
        }

        results.push({
          id: crypto.randomUUID(),
          videoId,
          title: meta.title,
          authorName: meta.authorName,
          thumbnailUrl: getMaxResThumbnailUrl(videoId),
          duration,
          categoryId: selectedCategoryId || null,
          addedAt: new Date().toISOString(),
        })
      } catch (err) {
        setError(`Failed to load video: ${line}`)
      }
    }

    if (results.length > 0) {
      onAdd(results)
      setInput('')
    }
    setLoading(false)
  }

  return (
    <form className="add-video-form" onSubmit={handleSubmit}>
      <div className="add-video-input-row">
        <input
          className="add-video-input"
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Paste YouTube link(s)… separate multiple with newlines or commas"
          disabled={loading}
          autoFocus
        />
        <button className="add-video-btn" type="submit" disabled={loading || !input.trim()}>
          {loading ? (
            <span className="spinner" />
          ) : (
            <>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              Add
            </>
          )}
        </button>
      </div>
      {error && <p className="add-video-error">{error}</p>}
    </form>
  )
}
