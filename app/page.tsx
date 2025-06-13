import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Music, Play, Users, Heart, MessageSquare, Headphones, Mic2, Radio } from "lucide-react"
import { Appbar } from "@/components/Appbar"
import { Redirect } from "@/components/Redirect"
import { Spotlight } from "@/components/ui/spotlight"

export default function LandingPage() {
  return (
    <div className="flex justify-center items-center min-h-screen flex-col bg-black">
      <header className="flex justify-center items-center mx-auto py-3 px-7 sticky top-0 z-40 w-full border-0 bg-black backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-2 items-center text-xl font-bold">
            <Radio className="h-6 w-6 text-purple-500" />
            <Link href="/" className="text-white">WatchMax</Link>
          </div>
            <Appbar />
            <Redirect />
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-black to-zinc-900 rounded-4xl">
          <Spotlight
           className="-top-40 left-0 md:-top-20 md:left-60"
           fill="purple"
          />
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_600px] lg:gap-12 xl:grid-cols-[1fr_700px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white">
                    Where Fans Choose the Content, <span className="text-purple-600">Live</span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Muzix connects music creators with fans in real-time streams where the audience influences what
                    plays next. Create, listen, and engage like never before.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="bg-purple-600 hover:bg-purple-700">Start Creating</Button>
                  <Button variant="outline" className="text-white">Join as a Fan</Button>
                </div>
                
              </div>
              <div className="relative flex items-center justify-center">
                <div className="relative h-[450px] w-full overflow-hidden rounded-xl">
                  <Image
                    src="/placeholder.svg?height=450&width=700"
                    width={700}
                    height={450}
                    alt="Muzix App Screenshot"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-transparent rounded-xl"></div>
                </div>
                <div className="absolute -bottom-6 -left-6 h-[250px] w-[250px] overflow-hidden rounded-xl border-4 border-background shadow-xl">
                  <Image
                    src="/placeholder.svg?height=250&width=250"
                    width={250}
                    height={250}
                    alt="Fan interaction screenshot"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="rounded-lg w-full py-12 md:py-24 lg:py-32 ">
          <div className="rounded-lg container px-4 md:px-6 ">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-purple-100 px-3 py-1 text-sm dark:bg-purple-800/30 text-purple-600">
                  How It Works
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">Interactive Music Streaming</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Muzix brings creators and fans together in a unique music experience where the audience helps shape
                  the stream.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-black">
                    <Mic2 className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">For Creators</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-black">
                      <span className="text-sm font-medium text-purple-600">1</span>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-semibold text-white">Set Up Your Stream</h4>
                      <p className="text-muted-foreground">
                        Create your channel, upload your music library, and customize your stream settings.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-black">
                      <span className="text-sm font-medium text-purple-600">2</span>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-semibold text-white">Go Live</h4>
                      <p className="text-muted-foreground">
                        Start your stream with a single click and connect with your audience in real-time.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-black">
                      <span className="text-sm font-medium text-purple-600">3</span>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-semibold text-white">Engage With Fans</h4>
                      <p className="text-muted-foreground">
                        Interact with your audience as they vote on songs and influence your playlist.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-black">
                    <Headphones className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">For Fans</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-black">
                      <span className="text-sm font-medium text-purple-600">1</span>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-semibold text-white">Discover Streams</h4>
                      <p className="text-muted-foreground">
                        Browse live streams by genre, artist, or popularity to find your vibe.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-black">
                      <span className="text-sm font-medium text-purple-600">2</span>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-semibold text-white">Join the Experience</h4>
                      <p className="text-muted-foreground">
                        Enter a stream and start listening to music curated by creators and other fans.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-black">
                      <span className="text-sm font-medium text-purple-600">3</span>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-semibold text-white">Influence the Music</h4>
                      <p className="text-muted-foreground">
                        Vote on upcoming songs, request tracks, and chat with the creator and other listeners.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-zinc-900 to-black rounded-4xl">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-purple-100 px-3 py-1 text-sm dark:bg-purple-800/30 text-purple-600">
                  Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">Why Choose Muzix?</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform offers unique features that transform how creators and fans experience music together.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3 ">
              <div className="flex flex-col items-center space-y-2 rounded-lg border border-zinc-800 bg-gradient-to-b from-zinc-900 to-black p-6 shadow-[0_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] ">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-800/30">
                  <Play className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-purple-400">Live Streaming</h3>
                <p className="text-center text-muted-foreground">
                  High-quality audio streaming with minimal latency for the best listening experience.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border border-zinc-800 bg-gradient-to-b from-zinc-900 to-black p-6 shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-800/30">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-purple-400">Fan Participation</h3>
                <p className="text-center text-muted-foreground">
                  Democratic song selection where fans vote on what plays next during the stream.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border border-zinc-800 bg-gradient-to-b from-zinc-900 to-black p-6 shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-800/30">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-purple-400">Real-time Chat</h3>
                <p className="text-center text-muted-foreground">
                  Connect with creators and other fans through live chat during streams.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border border-zinc-800 bg-gradient-to-b from-zinc-900 to-black p-6 shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-800/30">
                  <Music className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-purple-400">Music Library</h3>
                <p className="text-center text-muted-foreground">
                  Upload and organize your music for easy access during streams.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border border-zinc-800 bg-gradient-to-b from-zinc-900 to-black p-6 shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-800/30">
                  <Heart className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-purple-400">Support Creators</h3>
                <p className="text-center text-muted-foreground">
                  Show appreciation with virtual gifts, tips, and subscriptions.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border border-zinc-800 bg-gradient-to-b from-zinc-900 to-black p-6 shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-800/30">
                  <Radio className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-purple-400">Discover New Music</h3>
                <p className="text-center text-muted-foreground">
                  Find new artists and songs through personalized recommendations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-zinc-900 to-black text-white rounded-4xl">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Transform Your Music Experience?
                </h2>
                <p className="mx-auto max-w-[700px] md:text-xl">
                  Join thousands of creators and fans already connecting through interactive music streams.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button className="bg-white text-purple-600 hover:bg-gray-100">Start Creating</Button>
                <Button variant="outline" className="border-white text-white hover:bg-purple-700">
                  Join as a Fan
                </Button>
              </div>
              <p className="text-sm text-purple-100">No credit card required. Free to get started.</p>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex justify-center items-center w-full border-t border-zinc-800 bg-black py-6 md:py-12">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6 md:flex-row md:justify-between">
          <div className="flex gap-2 items-center text-xl font-bold">
            <Radio className="h-6 w-6 text-purple-500" />
            <span className="text-white">WatchMax</span>
          </div>
          <div className="flex gap-4">
            <Link href="" className="text-sm text-muted-foreground hover:text-white">
              Terms
            </Link>
            <Link href="" className="text-sm text-muted-foreground hover:text-white">
              Privacy
            </Link>
            <Link href="https://x.com/parthcodess" className="text-sm text-muted-foreground hover:text-white">
              Contact
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Muzix. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

