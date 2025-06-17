"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const SUGGESTED_TAGS = {
  video: ["video-editing", "video-production", "cinematic", "color-grading"],
  youtube: ["youtube-editing", "youtube-thumbnails", "youtube-optimization", "content-creation"],
  social: ["social-media", "instagram-reels", "tiktok-editing", "short-form"],
  wedding: ["wedding-videos", "cinematic-wedding", "wedding-highlights", "romantic"],
  corporate: ["corporate-videos", "business-videos", "professional", "presentations"],
  music: ["music-videos", "lyric-videos", "concert-editing", "audio-sync"],
  gaming: ["gaming-videos", "twitch-highlights", "esports", "gameplay-editing"],
  motion: ["motion-graphics", "after-effects", "animations", "visual-effects"],
  color: ["color-correction", "color-grading", "cinematic-look", "film-look"],
  audio: ["audio-editing", "sound-design", "voice-over", "audio-mixing"],
}

export function TagAutocomplete({ value, onChange, onAdd, disabled, placeholder }) {
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (value.length > 1) {
      const allTags = Object.values(SUGGESTED_TAGS).flat()
      const filtered = allTags
        .filter(
          (tag) => tag.toLowerCase().includes(value.toLowerCase()) && !value.toLowerCase().includes(tag.toLowerCase()),
        )
        .slice(0, 6)
      setSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setShowSuggestions(false)
    }
  }, [value])

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion)
    setShowSuggestions(false)
    onAdd()
  }

  return (
    <div className="relative">
      <div className="flex gap-3">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), onAdd())}
          onFocus={() => value.length > 1 && setShowSuggestions(suggestions.length > 0)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="h-12 text-base"
        />
        <Button
          type="button"
          onClick={onAdd}
          variant="outline"
          disabled={disabled || !value.trim()}
          className="h-12 px-4"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {showSuggestions && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              className="w-full px-4 py-3 text-left text-base hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
