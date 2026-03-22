/**
 * Extract YouTube video ID from various URL formats
 */
export function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/, // raw video ID
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

/**
 * Get thumbnail URL for a video ID
 */
export function getThumbnailUrl(videoId) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
}

export function getMaxResThumbnailUrl(videoId) {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
}

/**
 * Fetch video metadata via YouTube oEmbed (no API key required)
 * Returns: { title, authorName, thumbnailUrl }
 */
export async function fetchVideoMetadata(videoId) {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch video metadata')
  const data = await res.json()
  return {
    title: data.title,
    authorName: data.author_name,
    thumbnailUrl: getThumbnailUrl(videoId), // oEmbed thumb is low quality; use CDN
  }
}

/**
 * Fetch video duration using YouTube Data API v3 (requires API key)
 * Returns ISO 8601 duration string like "PT4M13S"
 */
export async function fetchVideoDuration(videoId, apiKey) {
  const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${apiKey}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch duration')
  const data = await res.json()
  if (!data.items || data.items.length === 0) throw new Error('Video not found')
  return data.items[0].contentDetails.duration
}

/**
 * Parse ISO 8601 duration (PT1H4M13S) into human-readable string (1:04:13)
 */
export function parseDuration(iso) {
  if (!iso) return null
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return null
  const h = parseInt(match[1] || '0')
  const m = parseInt(match[2] || '0')
  const s = parseInt(match[3] || '0')
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }
  return `${m}:${String(s).padStart(2, '0')}`
}

/**
 * Build the canonical YouTube watch URL from a video ID
 */
export function buildWatchUrl(videoId) {
  return `https://www.youtube.com/watch?v=${videoId}`
}
