"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ThumbsUp, ThumbsDown, Music, Youtube, Radio, Headphones, Share2, SkipBack, SkipForward } from "lucide-react"
import axios from "axios"

// Types for our queue items
type MediaType = "youtube" | "spotify"

interface QueueItem {
  id: string
  title: string
  thumbnail: string
  url: string
  votes: number
  type: MediaType
}

const REFRESH_INTERVAL_MS = 10 * 1000;

export default function MusicVotingQueue() {
  const [currentUrl, setCurrentUrl] = useState("")
  const [inputUrl, setInputUrl] = useState("")
  const [previewUrl, setPreviewUrl] = useState("")
  const [currentType, setCurrentType] = useState<MediaType>("youtube")
  // Track history of played items
  const [history, setHistory] = useState<QueueItem[]>([])
  const [queue, setQueue] = useState<QueueItem[]>([
    {
      id: "1",
      title: "Rick Astley - Never Gonna Give You Up",
      thumbnail: "/placeholder.svg?height=90&width=120",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      votes: 15,
      type: "youtube",
    },
    {
      id: "2",
      title: "Dua Lipa - Levitating",
      thumbnail: "/placeholder.svg?height=90&width=120",
      url: "https://www.youtube.com/embed/TUVcZfQe-Kw",
      votes: 12,
      type: "youtube",
    },
    {
      id: "3",
      title: "The Weeknd - Blinding Lights",
      thumbnail: "/placeholder.svg?height=90&width=120",
      url: "https://open.spotify.com/embed/track/0VjIjW4GlUZAMYd2vXMi3b",
      votes: 8,
      type: "spotify",
    },
  ])

  async function refereshStreams() {
    const res = await fetch(`/api/streams/my`, {
      credentials: "include"
    })
    console.log(res)
  }

  useEffect(() => {
    refereshStreams();
    const interval = setInterval(() => {

    }, REFRESH_INTERVAL_MS)
  }, [])

  // Set the current playing media
  const playNext = () => {
    if (queue.length > 0) {
      const sortedQueue = [...queue].sort((a, b) => b.votes - a.votes)
      const nextItem = sortedQueue[0]
      
      // If there's currently a song playing, add it to history
      if (currentUrl) {
        // Find the current item based on URL
        const currentItem = {
          id: Date.now().toString(), // Generate new ID to avoid conflicts
          title: `Previously Playing Track`,
          thumbnail: "/placeholder.svg?height=90&width=120",
          url: currentUrl,
          votes: 0,
          type: currentType,
        }
        setHistory([currentItem, ...history])
      }
      
      setCurrentUrl(nextItem.url)
      setCurrentType(nextItem.type)
      setQueue(queue.filter((item) => item.id !== nextItem.id))
    }
  }
  
  // Play the previous media from history
  const playPrevious = () => {
    if (history.length > 0) {
      const prevItem = history[0]
      
      // Add current song back to queue if one is playing
      if (currentUrl) {
        const currentItem = {
          id: Date.now().toString(),
          title: `Previously Playing Track`,
          thumbnail: "/placeholder.svg?height=90&width=120",
          url: currentUrl,
          votes: 0,
          type: currentType,
        }
        setQueue([currentItem, ...queue])
      }
      
      setCurrentUrl(prevItem.url)
      setCurrentType(prevItem.type)
      setHistory(history.slice(1))
    }
  }

  // Handle voting
  const handleVote = (id: string, increment: boolean) => {
    setQueue(
      queue.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            votes: increment ? item.votes + 1 : Math.max(0, item.votes - 1),
          }
        }
        return item
      }),
    )

    fetch("/api/stream/upvote", {
      method: "POST",
      body: JSON.stringify({
        streamId: id
      })
    })
  }

  // Handle URL input and preview
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputUrl(e.target.value)
  }

  const handlePreview = () => {
    if (inputUrl) {
      setPreviewUrl(inputUrl)
    }
  }

  // Determine if URL is YouTube or Spotify and format for embedding
  const formatUrl = (url: string): { formattedUrl: string; type: MediaType } => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      // Extract YouTube ID and format for embedding
      let videoId = ""
      if (url.includes("youtube.com/watch?v=")) {
        videoId = url.split("v=")[1]?.split("&")[0] || ""
      } else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1]?.split("?")[0] || ""
      }
      return {
        formattedUrl: `https://www.youtube.com/embed/${videoId}`,
        type: "youtube",
      }
    } else if (url.includes("spotify.com")) {
      // Extract Spotify ID and format for embedding
      let trackId = ""
      if (url.includes("track/")) {
        trackId = url.split("track/")[1]?.split("?")[0] || ""
      }
      return {
        formattedUrl: `https://open.spotify.com/embed/track/${trackId}`,
        type: "spotify",
      }
    }
    return { formattedUrl: url, type: "youtube" }
  }

  // Add new item to queue
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputUrl) {
      const { formattedUrl, type } = formatUrl(inputUrl)
      const newItem: QueueItem = {
        id: Date.now().toString(),
        title: `New ${type === "youtube" ? "YouTube" : "Spotify"} Track`,
        thumbnail: "/placeholder.svg?height=90&width=120",
        url: formattedUrl,
        votes: 0,
        type,
      }
      setQueue([...queue, newItem])
      setInputUrl("")
      setPreviewUrl("")
    }
  }

  // If no current URL is set, play the next item
  if (!currentUrl && queue.length > 0) {
    playNext()
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto p-4 max-w-5xl pt-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Where Fans Choose the <span className="text-[#9333ea] font-bold">Music</span>
            </h1>
            <p className="text-gray-300">
              Muzix connects music creators with fans in real-time streams where the audience influences what plays next.
            </p>
          </div>
          <Button 
            className="bg-[#9333ea] hover:bg-[#7928ca] flex items-center gap-2" 
            onClick={() => {
              // Create a shareable URL
              const shareUrl = window.location.href;
              // Copy to clipboard
              navigator.clipboard.writeText(shareUrl);
              alert("Link copied to clipboard! Share with your fans.");
            }}
          >
            <Share2 className="h-4 w-4" />
            Share with Fans
          </Button>
        </div>

        {/* Current Playing Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Headphones className="text-[#9333ea] h-5 w-5" />
            <span>Now Playing</span>
          </h2>
          <div className="aspect-video bg-muted rounded-lg overflow-hidden border border-border">
            {currentUrl ? (
              currentType === "youtube" ? (
                <iframe
                  className="w-full h-full"
                  src={currentUrl}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <iframe
                  className="w-full h-full"
                  src={currentUrl}
                  title="Spotify player"
                  allow="encrypted-media"
                  allowFullScreen
                ></iframe>
              )
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <Music className="h-12 w-12 mx-auto mb-2 text-[#9333ea]/50" />
                  <p>No media currently playing</p>
                </div>
              </div>
            )}
          </div>
          {currentUrl && (
            <div className="mt-2 flex justify-end gap-2">
              <Button
                onClick={playPrevious}
                variant="outline"
                className="border-[#9333ea]/30 text-[#9333ea] hover:bg-[#9333ea]/10 flex items-center gap-1"
                disabled={history.length === 0}
              >
                <SkipBack size={16} />
                Previous
              </Button>
              <Button
                onClick={playNext}
                variant="outline"
                className="border-[#9333ea]/30 text-[#9333ea] hover:bg-[#9333ea]/10 flex items-center gap-1"
                disabled={queue.length === 0}
              >
                Next
                <SkipForward size={16} />
              </Button>
            </div>
          )}
        </div>

        {/* Submission Form */}
        <div className="mb-8 bg-black border border-gray-800 rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Music className="text-[#9333ea] h-5 w-5" />
              <span>Submit a Song</span>
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Paste YouTube or Spotify link"
                  value={inputUrl}
                  onChange={handleUrlChange}
                  className="flex-1 bg-[#111] text-white border border-gray-800 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#9333ea]"
                />
                <button
                  type="button"
                  onClick={handlePreview}
                  className="px-4 py-2 border border-[#9333ea]/30 text-[#9333ea] rounded-md hover:bg-[#9333ea]/10"
                >
                  Preview
                </button>
                <button type="submit" className="px-4 py-2 bg-[#9333ea] text-white rounded-md hover:bg-[#9333ea]/90">
                  Submit
                </button>
              </div>

              {previewUrl && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Preview:</h3>
                  <div className="aspect-video bg-black rounded-lg overflow-hidden border border-gray-800">
                    {formatUrl(previewUrl).type === "youtube" ? (
                      <iframe
                        className="w-full h-full"
                        src={formatUrl(previewUrl).formattedUrl}
                        title="YouTube video preview"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <iframe
                        className="w-full h-full"
                        src={formatUrl(previewUrl).formattedUrl}
                        title="Spotify preview"
                        allow="encrypted-media"
                        allowFullScreen
                      ></iframe>
                    )}
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Queue Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Radio className="text-[#9333ea] h-5 w-5" />
            <span>Up Next</span>
          </h2>
          {queue.length === 0 ? (
            <div className="text-center py-12 text-gray-400 bg-black rounded-lg border border-gray-800">
              <Music className="h-12 w-12 mx-auto mb-2 text-[#9333ea]/50" />
              <p>Queue is empty. Submit a song to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...queue]
                .sort((a, b) => b.votes - a.votes)
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-800 bg-black hover:bg-gray-900 transition"
                  >
                    <div className="flex-shrink-0 relative">
                      <img
                        src={item.thumbnail || "/placeholder.svg"}
                        alt={item.title}
                        className="w-24 h-16 object-cover rounded"
                      />
                      <div className="absolute bottom-0 right-0 bg-black bg-opacity-70 p-1 rounded-tl">
                        {item.type === "youtube" ? (
                          <Youtube size={14} className="text-[#9333ea]" />
                        ) : (
                          <Music size={14} className="text-[#9333ea]" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{item.title}</h3>
                      <div className="text-sm text-gray-400 truncate">{item.url}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleVote(item.id, true)}
                        className="h-8 w-8 flex items-center justify-center text-[#9333ea] hover:bg-[#9333ea]/10 rounded-full"
                      >
                        <ThumbsUp size={16} />
                      </button>
                      <span className="text-sm font-medium w-8 text-center bg-gray-900 rounded-md py-1">{item.votes}</span>
                      <button
                        onClick={() => handleVote(item.id, false)}
                        className="h-8 w-8 flex items-center justify-center text-gray-400 hover:bg-[#9333ea]/10 hover:text-[#9333ea] rounded-full"
                      >
                        <ThumbsDown size={16} />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

