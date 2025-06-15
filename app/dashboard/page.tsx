"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown, Music, Youtube, Radio, Headphones, Share2, SkipForward, X } from "lucide-react"
import axios from "axios"
import Link from "next/link"
// @ts-expect-error - youtube types not available
import YouTubePlayer from "youtube-player"
import { motion } from "framer-motion";

// Types for our queue items
type MediaType = "youtube" | "spotify"

interface QueueItem {
  id: string
  title: string
  thumbnail: string
  url: string
  votes: number
  type: MediaType
  haveUpvoted?: boolean // Track if current user has upvoted
}

export default function MusicVotingQueue() {
  const { data: session, status } = useSession()
  const logSession = useSession()
  const router = useRouter()
  const [currentUrl, setCurrentUrl] = useState("")
  const [inputUrl, setInputUrl] = useState("")
  const [previewUrl, setPreviewUrl] = useState("")
  const [currentType, setCurrentType] = useState<MediaType>("youtube")
  // Track history of played items
  const [history, setHistory] = useState<QueueItem[]>([])
  const [queue, setQueue] = useState<QueueItem[]>([])
  // Add error state for better user experience
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  // YouTube Player state
  const [player, setPlayer] = useState<{ loadVideoById: (id: string) => Promise<void>; on: (event: string, callback: (event: { data: number }) => void) => void } | null>(null)
  const [currentVideoId, setCurrentVideoId] = useState<string>("")

  // Load queue from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedQueue = localStorage.getItem('musicQueue')
      const savedCurrentUrl = localStorage.getItem('currentUrl')
      const savedCurrentType = localStorage.getItem('currentType')
      const savedCurrentVideoId = localStorage.getItem('currentVideoId')
      
      if (savedQueue) {
        try {
          setQueue(JSON.parse(savedQueue))
        } catch (error) {
          console.error('Error parsing saved queue:', error)
        }
      }
      
      if (savedCurrentUrl) setCurrentUrl(savedCurrentUrl)
      if (savedCurrentType) setCurrentType(savedCurrentType as MediaType)
      if (savedCurrentVideoId) setCurrentVideoId(savedCurrentVideoId)
    }
  }, [])

  // Save queue to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('musicQueue', JSON.stringify(queue))
    }
  }, [queue])

  // Save current playing state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentUrl', currentUrl)
      localStorage.setItem('currentType', currentType)
      localStorage.setItem('currentVideoId', currentVideoId)
    }
  }, [currentUrl, currentType, currentVideoId])

  async function refreshStreams() {
    try {
      setIsLoading(true)
      setError(null)
      
      const res = await fetch(`/api/streams/my`, {
        method: 'GET',
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      })
      
      if (res.ok) {
        const data = await res.json()

        // The API returns { streams: [...] }, not a direct array
        const streams = data.streams || []
        
        const queueItems = streams.map((stream: { id: string; title?: string; smallImg?: string; url: string; upvotes?: number; type: string; haveUpvoted?: boolean }) => ({
        id: stream.id,
        title: stream.title || "Unknown Track",
        thumbnail: stream.smallImg,
        url: formatUrl(stream.url).formattedUrl,
          votes: stream.upvotes || 0, // API returns 'upvotes', not 'votes'
        type: stream.type === "Youtube" ? "youtube" : "spotify" as MediaType,
        haveUpvoted: stream.haveUpvoted || false // Track voting status
      }))
        
      setQueue(queueItems)
      } else {
        // Handle non-ok responses (like 403 for unauthenticated users)
        const errorData = await res.json().catch(() => ({ message: 'Unknown error' }))
        console.warn('Failed to refresh streams:', res.status, errorData.message)
        
        if (res.status === 403) {
          setError("Please sign in to view your streams")
          setQueue([])
        } else {
          setError(`Failed to load streams: ${errorData.message}`)
        }
      }
    } catch (error) {
      console.error('Error refreshing streams:', error)
      setError("Unable to connect to server. Please check your internet connection.")
    } finally {
      setIsLoading(false)
    }
  }

  // useEffect(() => {
  //   refreshStreams(); // Load once on mount
  //   // Remove the interval - no more automatic refreshing
  //   // const interval = setInterval(() => {
  //   //   refreshStreams()
  //   // }, REFRESH_INTERVAL_MS)

  //   // return () => clearInterval(interval)
  // }, [])
  
  

  // Extract YouTube video ID from URL
  const extractYouTubeId = (url: string): string => {
    if (url.includes("youtube.com/watch?v=")) {
      return url.split("v=")[1]?.split("&")[0] || ""
    } else if (url.includes("youtu.be/")) {
      return url.split("youtu.be/")[1]?.split("?")[0] || ""
    } else if (url.includes("youtube.com/embed/")) {
      return url.split("embed/")[1]?.split("?")[0] || ""
    }
    return ""
  }

  // Initialize YouTube player
  useEffect(() => {
    if (typeof window !== 'undefined' && currentType === "youtube" && currentVideoId) {
      const initPlayer = async () => {
        try {
          const ytPlayer = YouTubePlayer('youtube-player')
          
          await ytPlayer.loadVideoById(currentVideoId)
          
          // Listen for state changes
          ytPlayer.on('stateChange', (event: { data: number }) => {
            // 0 = ended, 1 = playing, 2 = paused, 3 = buffering, 5 = video cued
            if (event.data === 0) { // Video ended
              console.log('Video ended, playing next...')
              playNext()
            }
          })
          
          setPlayer(ytPlayer)
        } catch (error) {
          console.error('Error initializing YouTube player:', error)
        }
      }
      
      initPlayer()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentVideoId, currentType])

  // Set the current playing media
  const playNext = async () => {
    if (queue.length > 0) {
      const sortedQueue = [...queue].sort((a, b) => b.votes - a.votes)
      const nextItem = sortedQueue[0]
      
      // If there's currently a song playing, add it to history
      if (currentUrl) {
        const currentItem = {
          id: Date.now().toString(),
          title: `Previously Playing Track`,
          thumbnail: "/placeholder.svg?height=90&width=120",
          url: currentUrl,
          votes: 0,
          type: currentType,
        }
        setHistory([currentItem, ...history])
      }
      
      // Delete the stream from database to prevent it from appearing again
      try {
        await fetch(`/api/streams/${nextItem.id}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        console.log(`Stream ${nextItem.id} deleted from database`)
      } catch (error) {
        console.error('Error deleting stream from database:', error)
      }
      
      setCurrentUrl(nextItem.url)
      setCurrentType(nextItem.type)
      
      // Extract video ID for YouTube player
      if (nextItem.type === "youtube") {
        const videoId = extractYouTubeId(nextItem.url)
        setCurrentVideoId(videoId)
        
        // If player exists, load the new video
        if (player) {
          try {
            await player.loadVideoById(videoId)
          } catch (error) {
            console.error('Error loading video:', error)
          }
        }
      }
      
      setQueue(queue.filter((item) => item.id !== nextItem.id))
    } else {
      // No more videos in queue
      setCurrentUrl("")
      setCurrentVideoId("")
      setCurrentType("youtube")
    }
  }

  // Handle voting
  const handleVote = async (id: string, increment: boolean) => {
    // Check if user has already voted on this item
    const item = queue.find(q => q.id === id)
    if (!item) return
    
    // If trying to upvote but already upvoted, or trying to downvote but not upvoted, return
    if (increment && item.haveUpvoted) {
      console.log('User has already upvoted this item')
      return
    }
    if (!increment && !item.haveUpvoted) {
      console.log('User has not upvoted this item, cannot downvote')
      return
    }

    setQueue(
      queue.map((queueItem) => {
        if (queueItem.id === id) {
          return {
            ...queueItem,
            votes: increment ? queueItem.votes + 1 : Math.max(0, queueItem.votes - 1),
            haveUpvoted: increment ? true : false
          }
        }
        return queueItem
      }),
    )

    try {
      const endpoint = increment ? "/api/streams/upvote" : "/api/streams/downvote"
      const response = await fetch(endpoint, {
      method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      body: JSON.stringify({
        streamId: id
      })
    })

      if (!response.ok) {
        // Only revert for non-403/404 errors (stream might not exist anymore)
        if (response.status !== 403 && response.status !== 404) {
          const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
          console.error('Voting failed:', response.status, errorData.message)
          
          // Revert the optimistic update
          setQueue(
            queue.map((item) => {
              if (item.id === id) {
                return {
                  ...item,
                  votes: increment ? item.votes - 1 : item.votes + 1,
                }
              }
              return item
            }),
          )
        }
        // For 403/404 errors, just log silently - stream probably doesn't exist
        else {
          console.log(`Stream ${id} no longer exists for voting (${response.status})`)
        }
      }
    } catch (error) {
      console.error('Error voting:', error)
      // Revert the optimistic update for network errors
      setQueue(
        queue.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              votes: increment ? item.votes - 1 : item.votes + 1,
            }
          }
          return item
        }),
      )
    }
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (inputUrl) {
      try {
        const { formattedUrl, type } = formatUrl(inputUrl)

        // Check if user is authenticated
        if (!session?.user?.email) {
          alert("Please sign in to submit songs")
          return
        }

        const response = await axios.post("/api/streams", {
          url: inputUrl,
          creatorId: session.user.email // Use session email as identifier
        }, {
          withCredentials: true
        })
        
        const newItem: QueueItem = {
        id: response.data.id,
        title: response.data.title || `New ${type === "youtube" ? "YouTube" : "Spotify"} Track`,
        thumbnail: response.data.smallImg || "/placeholder.svg?height=90&width=120",
        url: formattedUrl,
        votes: 0,
        type,
        haveUpvoted: false // New items haven't been voted on
      }
        
      setQueue([...queue, newItem])
      setInputUrl("")
      setPreviewUrl("")
        
      } catch (error: unknown) {
        console.error('Error adding song:', error)
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Error adding song to the queue. Please try again"
        
        // Show a less intrusive error message
        console.error('Submit error:', errorMessage)
        // You could replace this with a toast notification instead of alert
        alert(errorMessage)
      }
    }
  }

  // Handle deleting a stream
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/streams/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        // Remove from local queue after successful database deletion
        setQueue(queue.filter(item => item.id !== id))
      } else {
        // Handle errors gracefully
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
        console.error('Delete failed:', response.status, errorData.message)
        
        // Still remove from local queue even if database deletion fails
        setQueue(queue.filter(item => item.id !== id))
      }
    } catch (error) {
      console.error('Error deleting stream:', error)
      
      // Still remove from local queue even if there's a network error
      setQueue(queue.filter(item => item.id !== id))
    }
  }

  // Auto-play first video when queue has items but nothing is playing
  useEffect(() => {
    if (!currentUrl && queue.length > 0) {
      playNext()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue, currentUrl])

  // Handle logout with redirect
  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  return (
    <div className="mx-auto min-h-screen bg-black text-white">
      <header className="flex justify-center items-center mx-auto py-3 px-4 sm:px-7 sticky top-0 z-40 w-full border-0 bg-black backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <div className="container flex h-16 items-center space-x-2 sm:space-x-4 justify-between">
          <div className="flex gap-2 items-center text-lg sm:text-xl font-bold">
            <Radio className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />
            <Link href="/" className="text-white hover:text-purple-400 transition-colors" title="Back to Home">WatchMax</Link>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link 
              href="/" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-white hidden sm:block"
            >
              Home
            </Link>
            {logSession.data?.user && <Button size="sm" className="bg-black text-slate-500 border-2 px-2 sm:px-4 py-2 border-slate-500 hover:border-white hover:bg-black hover:text-white hover:cursor-pointer text-xs sm:text-sm" onMouseDown={handleLogout}>
              Log Out
            </Button>}

            {!logSession.data?.user && <Button size="sm" className="bg-purple-600 hover:bg-purple-700 px-2 sm:px-4 text-xs sm:text-sm" onMouseDown={() => signIn()}>
              Sign up
            </Button>}
          </div>
        </div>
      </header>
      <div className="container mx-auto p-4 sm:p-6 max-w-5xl pt-4 sm:pt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
              Where Friends Choose the <span className="text-[#9333ea] font-bold">Content</span>
            </h1>
            <p className="text-gray-300 text-sm sm:text-base">
              WatchMax connects content creators with fans in real-time streams where the audience influences what plays next.
            </p>
          </div>
          <motion.button
            whileHover={{
              scale: 1.1,
              translate: -2,
              backgroundColor: "#7928ca",
              boxShadow: "0px 5px 10px rgba(0, 0, 0, 0..2)",
              transition: {
                duration: 0.3
              }
            }}
            whileTap={{
              scale: 1
            }}
            className="hover:cursor-pointer px-3 sm:px-4 py-2 rounded-lg bg-[#9333ea] hover:bg-purple-900 flex items-center gap-2 text-sm sm:text-base whitespace-nowrap" 
            onClick={() => {
              // shareable URL
              const shareUrl = window.location.href;
              // Copy to clipboard
              navigator.clipboard.writeText(shareUrl);
              alert("Link copied to clipboard! Share with your fans.");
            }}
          >
            <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
            Share
          </motion.button>
        </div>

        {/* Current Playing Section */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
            <Headphones className="text-[#9333ea] h-4 w-4 sm:h-5 sm:w-5" />
            <span>Now Playing</span>
          </h2>
          <div className="aspect-video bg-muted rounded-lg overflow-hidden border border-border">
            {currentUrl ? (
              currentType === "youtube" ? (
                <div 
                  id="youtube-player"
                  className="w-full h-full"
                />
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
              <div className="flex items-center justify-center h-full text-muted-foreground px-4">
                <div className="text-center">
                  <Music className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 text-[#9333ea]/50" />
                  <p className="text-sm sm:text-base">No media currently playing</p>
                </div>
              </div>
            )}
          </div>
          {currentUrl && (
            <div className="mt-2 flex justify-end gap-2">
              <Button
                onClick={playNext}
                variant="outline"
                className="hover:cursor-pointer border-[#9333ea]/30 text-[#9333ea] hover:bg-[#9333ea]/10 flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3"
                disabled={queue.length === 0}
              >
                Next
                <SkipForward size={14} className="sm:hidden" />
                <SkipForward size={16} className="hidden sm:block" />
              </Button>
            </div>
          )}
        </div>

        {/* Submission Form */}
        <div className="mb-6 sm:mb-8 bg-black border border-gray-800 rounded-lg overflow-hidden">
          <div className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
              <Music className="text-[#9333ea] h-4 w-4 sm:h-5 sm:w-5" />
              <span>Submit a Song</span>
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Paste YouTube link"
                  value={inputUrl}
                  onChange={handleUrlChange}
                  className="flex-1 bg-[#111] text-white border border-gray-800 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#9333ea] text-sm sm:text-base"
                />
                <div className="flex gap-2">
                  <motion.button
                    whileTap={{
                      scale: 0
                    }}
                    type="button"
                    onClick={handlePreview}
                    className="hover:cursor-pointer px-3 sm:px-4 py-2 border border-[#9333ea]/30 text-[#9333ea] rounded-md hover:bg-slate-900 text-xs sm:text-sm flex-1 sm:flex-none"
                  >
                    Preview
                  </motion.button>
                  <motion.button
                  whileTap={{
                    scale: 0
                  }} 
                  type="submit" 
                  className="hover:cursor-pointer px-3 sm:px-4 py-2 bg-[#9333ea] text-white rounded-md hover:bg-purple-900 text-xs sm:text-sm flex-1 sm:flex-none">
                    Submit
                  </motion.button>
                </div>
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
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
            <Radio className="text-[#9333ea] h-4 w-4 sm:h-5 sm:w-5" />
            <span>Up Next</span>
          </h2>
          
          {isLoading && (
            <div className="text-center py-8 sm:py-12 text-gray-400 bg-black rounded-lg border border-gray-800">
              <div className="animate-spin h-6 w-6 sm:h-8 sm:w-8 border-2 border-[#9333ea] border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-sm sm:text-base">Loading streams...</p>
            </div>
          )}
          
          {error && !isLoading && (
            <div className="text-center py-8 sm:py-12 text-red-400 bg-black rounded-lg border border-red-800/30 px-4">
              <Music className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 text-red-400/50" />
              <p className="text-sm sm:text-base mb-3">{error}</p>
              <button 
                onClick={refreshStreams}
                className="mt-2 px-3 sm:px-4 py-2 bg-[#9333ea] text-white rounded-md hover:bg-[#9333ea]/90 text-xs sm:text-sm"
              >
                Retry
              </button>
            </div>
          )}
          
          {!isLoading && !error && queue.length == 0 && (
            <div className="text-center py-8 sm:py-12 text-gray-400 bg-black rounded-lg border border-gray-800 px-4">
              <Music className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 text-[#9333ea]/50" />
              {status === "loading" ? (
                <p className="text-sm sm:text-base">Loading...</p>
              ) : !session?.user ? (
                <p className="text-sm sm:text-base">Please sign in to view and submit songs!</p>
              ) : (
              <p className="text-sm sm:text-base">Queue is empty. Submit a song to get started!</p>
              )}
            </div>
          )}
          
          {!isLoading && !error && queue.length >= 0 && (
            <div className="space-y-2 sm:space-y-3">
              {[...queue]
                .sort((a, b) => b.votes - a.votes)
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg border border-gray-800 bg-black hover:bg-gray-900 transition"
                  >
                    <div className="flex-shrink-0 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.thumbnail || "/placeholder.svg"}
                        alt={item.title}
                        className="w-16 h-12 sm:w-24 sm:h-16 object-cover rounded"
                      />
                      <div className="absolute bottom-0 right-0 bg-black bg-opacity-70 p-1 rounded-tl">
                        {item.type === "youtube" ? (
                          <Youtube size={12} className="text-[#9333ea] sm:hidden" />
                        ) : (
                          <Music size={12} className="text-[#9333ea] sm:hidden" />
                        )}
                        {item.type === "youtube" ? (
                          <Youtube size={14} className="text-[#9333ea] hidden sm:block" />
                        ) : (
                          <Music size={14} className="text-[#9333ea] hidden sm:block" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate text-sm sm:text-base">{item.title}</h3>
                      <div className="text-xs sm:text-sm text-gray-400 truncate">{item.url}</div>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button
                        onClick={() => handleVote(item.id, true)}
                        disabled={item.haveUpvoted}
                        className={`h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center rounded-full ${
                          item.haveUpvoted 
                            ? 'text-green-500 bg-green-500/20 cursor-not-allowed' 
                            : 'text-[#9333ea] hover:text-green-500 hover:bg-[#9333ea]/10'
                        }`}
                        title={item.haveUpvoted ? "You have already upvoted this" : "Upvote"}
                      >
                        <ThumbsUp size={14} className="sm:hidden" />
                        <ThumbsUp size={16} className="hidden sm:block" />
                      </button>
                      <span className="text-xs sm:text-sm font-medium w-6 sm:w-8 text-center bg-gray-900 rounded-md py-1">{item.votes}</span>
                      <button
                        onClick={() => handleVote(item.id, false)}
                        disabled={!item.haveUpvoted}
                        className={`h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center rounded-full ${
                          !item.haveUpvoted 
                            ? 'text-gray-600 cursor-not-allowed' 
                            : 'text-gray-400 hover:bg-[#9333ea]/10 hover:text-red-500'
                        }`}
                        title={!item.haveUpvoted ? "You must upvote first to downvote" : "Remove upvote"}
                      >
                        <ThumbsDown size={14} className="sm:hidden" />
                        <ThumbsDown size={16} className="hidden sm:block" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center text-gray-400 hover:bg-red-500/10 hover:text-red-500 rounded-full"
                        title="Delete from queue"
                      >
                        <X size={14} className="sm:hidden" />
                        <X size={16} className="hidden sm:block" />
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

