"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { signIn, signOut, useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown, Music, Youtube, Radio, Headphones, Share2, SkipForward, Users } from "lucide-react"
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
  haveUpvoted?: boolean
  creatorId: string
}

export default function CreatorStreamPage() {
  const { data: session, status } = useSession()
  const params = useParams()
  const creatorId = params.creatorId as string
  
  const [currentUrl, setCurrentUrl] = useState("")
  const [inputUrl, setInputUrl] = useState("")
  const [previewUrl, setPreviewUrl] = useState("")
  const [currentType, setCurrentType] = useState<MediaType>("youtube")
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [, setPlayer] = useState<{ loadVideoById: (id: string) => Promise<void>; on: (event: string, callback: (event: { data: number }) => void) => void } | null>(null)
  const [currentVideoId, setCurrentVideoId] = useState<string>("")
  const [creatorInfo, setCreatorInfo] = useState<{ name: string; email: string } | null>(null)

  // Load creator-specific streams
  async function refreshStreams() {
    if (!creatorId) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await axios.get(`/api/streams?creatorId=${encodeURIComponent(creatorId)}`, {
        withCredentials: true
      })
      
      if (response.data && Array.isArray(response.data)) {
                 const formattedQueue: QueueItem[] = response.data.map((stream: {
           id: string;
           title: string;
           smallImg: string;
           url: string;
           upvotes: number;
           type: string;
           haveUpvoted: boolean;
           creatorId: string;
         }) => ({
          id: stream.id,
          title: stream.title || `${stream.type === "youtube" ? "YouTube" : "Spotify"} Track`,
          thumbnail: stream.smallImg || "/placeholder.svg?height=90&width=120",
          url: formatUrl(stream.url).formattedUrl,
          votes: stream.upvotes || 0,
                     type: (stream.type || "youtube") as MediaType,
          haveUpvoted: stream.haveUpvoted || false,
          creatorId: stream.creatorId
        }))
        
        setQueue(formattedQueue)
        
        // Set creator info from first stream
        if (formattedQueue.length > 0) {
          setCreatorInfo({
            name: creatorId.split('@')[0] || creatorId,
            email: creatorId
          })
        }
      } else {
        setQueue([])
      }
         } catch (error: unknown) {
             console.error('Error fetching streams:', error)
       const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to load streams. Please try again."
       setError(errorMessage)
      setQueue([])
    } finally {
      setIsLoading(false)
    }
  }

     // Load streams on mount and when creatorId changes
   useEffect(() => {
     if (creatorId) {
       refreshStreams()
     }
     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [creatorId])

  // Extract YouTube ID from URL
  const extractYouTubeId = (url: string): string => {
    if (url.includes("youtube.com/watch?v=")) {
      return url.split("v=")[1]?.split("&")[0] || ""
    } else if (url.includes("youtu.be/")) {
      return url.split("youtu.be/")[1]?.split("?")[0] || ""
    }
    return ""
  }

  // Initialize YouTube Player
  useEffect(() => {
    if (typeof window !== 'undefined' && currentType === "youtube" && currentVideoId) {
      const initPlayer = async () => {
        try {
          const playerInstance = YouTubePlayer('youtube-player')
          await playerInstance.loadVideoById(currentVideoId)
          
          playerInstance.on('stateChange', (event: { data: number }) => {
            if (event.data === 0) { // Video ended
              playNext()
            }
          })
          
          setPlayer(playerInstance)
        } catch (error) {
          console.error('Error initializing YouTube player:', error)
        }
      }
      
             initPlayer()
     }
     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [currentType, currentVideoId])

  // Play next song in queue
  const playNext = async () => {
    if (queue.length > 0) {
      const nextItem = queue[0]
      const { formattedUrl, type } = formatUrl(nextItem.url)
      
      setCurrentUrl(formattedUrl)
      setCurrentType(type)
      
      if (type === "youtube") {
        const videoId = extractYouTubeId(nextItem.url)
        setCurrentVideoId(videoId)
      }
      
      // Remove the played item from queue
      setQueue(queue.slice(1))
    }
  }

  // Handle voting
  const handleVote = async (id: string, increment: boolean) => {
    // Optimistically update the UI
    setQueue(
      queue.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            votes: increment ? item.votes + 1 : item.votes - 1,
            haveUpvoted: increment ? true : false,
          }
        }
        return item
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
          creatorId: creatorId // Submit to the specific creator's stream
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
          haveUpvoted: false,
          creatorId: creatorId
        }
        
        setQueue([...queue, newItem])
        setInputUrl("")
        setPreviewUrl("")
        
      } catch (error: unknown) {
        console.error('Error adding song:', error)
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Error adding song to the queue. Please try again"
        alert(errorMessage)
      }
    }
  }

     // Auto-play first video when queue has items but nothing is playing
   useEffect(() => {
     if (!currentUrl && queue.length > 0) {
       playNext()
     }
     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [queue, currentUrl])

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
            {session?.user && (
              <Link 
                href="/dashboard" 
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-white hidden sm:block"
              >
                My Dashboard
              </Link>
            )}
            {session?.user && <Button size="sm" className="bg-black text-slate-500 border-2 px-2 sm:px-4 py-2 border-slate-500 hover:border-white hover:bg-black hover:text-white hover:cursor-pointer text-xs sm:text-sm" onMouseDown={() => signOut()}>
              Log Out
            </Button>}

            {!session?.user && <Button size="sm" className="bg-purple-600 hover:bg-purple-700 px-2 sm:px-4 text-xs sm:text-sm" onMouseDown={() => signIn()}>
              Sign In
            </Button>}
          </div>
        </div>
      </header>
      
      <div className="container mx-auto p-4 sm:p-6 max-w-5xl pt-4 sm:pt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-purple-500" />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                                 {creatorInfo?.name || 'Creator'}&apos;s <span className="text-[#9333ea] font-bold">Stream</span>
              </h1>
            </div>
            <p className="text-gray-300 text-sm sm:text-base">
              Join the stream and vote on what plays next! Submit your favorite songs and help shape the playlist.
            </p>
          </div>
          <motion.button
            whileHover={{
              scale: 1.1,
              translate: -2,
              backgroundColor: "#7928ca",
              boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.2)",
              transition: {
                duration: 0.3
              }
            }}
            whileTap={{
              scale: 1
            }}
            className="hover:cursor-pointer px-3 sm:px-4 py-2 rounded-lg bg-[#9333ea] hover:bg-purple-900 flex items-center gap-2 text-sm sm:text-base whitespace-nowrap" 
            onClick={() => {
              const shareUrl = window.location.href;
              navigator.clipboard.writeText(shareUrl);
              alert("Link copied to clipboard! Share with your friends.");
            }}
          >
            <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
            Share Stream
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
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">Submit a song to get the party started!</p>
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
                      scale: 0.95
                    }}
                    type="button"
                    onClick={handlePreview}
                    className="hover:cursor-pointer px-3 sm:px-4 py-2 border border-[#9333ea]/30 text-[#9333ea] rounded-md hover:bg-slate-900 text-xs sm:text-sm flex-1 sm:flex-none"
                  >
                    Preview
                  </motion.button>
                  <motion.button
                    whileTap={{
                      scale: 0.95
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
          
          {!isLoading && !error && queue.length === 0 && (
            <div className="text-center py-8 sm:py-12 text-gray-400 bg-black rounded-lg border border-gray-800 px-4">
              <Music className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 text-[#9333ea]/50" />
              {status === "loading" ? (
                <p className="text-sm sm:text-base">Loading...</p>
              ) : !session?.user ? (
                <div>
                  <p className="text-sm sm:text-base mb-2">Join the stream to submit and vote on songs!</p>
                  <Button onClick={() => signIn()} className="bg-purple-600 hover:bg-purple-700">
                    Sign In to Participate
                  </Button>
                </div>
              ) : (
                <p className="text-sm sm:text-base">No songs in queue yet. Be the first to submit one!</p>
              )}
            </div>
          )}
          
          {!isLoading && !error && queue.length > 0 && (
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
                        disabled={item.haveUpvoted || !session?.user}
                        className={`h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center rounded-full ${
                          item.haveUpvoted 
                            ? 'text-green-500 bg-green-500/20 cursor-not-allowed' 
                            : !session?.user
                            ? 'text-gray-600 cursor-not-allowed'
                            : 'text-[#9333ea] hover:text-green-500 hover:bg-[#9333ea]/10'
                        }`}
                        title={
                          !session?.user 
                            ? "Sign in to vote" 
                            : item.haveUpvoted 
                            ? "You have already upvoted this" 
                            : "Upvote"
                        }
                      >
                        <ThumbsUp size={14} className="sm:hidden" />
                        <ThumbsUp size={16} className="hidden sm:block" />
                      </button>
                      <span className="text-xs sm:text-sm font-medium w-6 sm:w-8 text-center bg-gray-900 rounded-md py-1">{item.votes}</span>
                      <button
                        onClick={() => handleVote(item.id, false)}
                        disabled={!item.haveUpvoted || !session?.user}
                        className={`h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center rounded-full ${
                          !item.haveUpvoted || !session?.user
                            ? 'text-gray-600 cursor-not-allowed' 
                            : 'text-gray-400 hover:bg-[#9333ea]/10 hover:text-red-500'
                        }`}
                        title={
                          !session?.user
                            ? "Sign in to vote"
                            : !item.haveUpvoted 
                            ? "You must upvote first to downvote" 
                            : "Remove upvote"
                        }
                      >
                        <ThumbsDown size={14} className="sm:hidden" />
                        <ThumbsDown size={16} className="hidden sm:block" />
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