"use client"

import Link from "next/link"
import { Music, Play, Users, Heart, MessageSquare, Headphones, Mic2, Radio } from "lucide-react"
import { Appbar } from "@/components/Appbar"
import { Spotlight } from "@/components/ui/spotlight"
import { motion } from "motion/react"
import { useSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const { data: session } = useSession()
  const router = useRouter()

  // Function to handle Start Creating button click
  const handleStartCreating = () => {
    if (session?.user) {
      router.push('/dashboard')
    } else {
      signIn()
    }
  }

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 }
  }

  const fadeInLeft = {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 }
  }

  const fadeInRight = {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 }
  }

  const scaleIn = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 }
  }

  const staggerContainer = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const staggerItem = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 }
  }

  return (
    <motion.div 
    initial={{
      opacity: 0,
    }}
    whileInView={{
      opacity: 1,
    }}
    className="flex justify-center items-center min-h-screen flex-col bg-black">
      <header className="hover:cursor-pointer flex justify-center items-center mx-auto py-3 px-4 sm:px-7 sticky top-0 z-40 w-full border-0 bg-black backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <div className="container flex h-16 items-center space-x-2 sm:space-x-4 sm:justify-between">
          <div className="flex gap-2 items-center text-lg sm:text-xl font-bold">
            <Radio className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />
            <Link href="/" className="text-white">WatchMax</Link>
          </div>
          <div className="flex items-center space-x-2">
            <Appbar />
          </div>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 sm:py-20 md:py-32 lg:py-48 xl:py-64 bg-gradient-to-b from-black rounded-4xl">
          <Spotlight
           className="-top-40 left-0 md:-top-20 md:left-60"
           fill="purple"
          />
          <div className="container px-4 sm:px-6 md:px-6">
            <motion.div 
              className="flex flex-col items-center justify-center text-center space-y-6 sm:space-y-8"
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3}}
              viewport={{ once: true }}
            >
              <div className="max-w-4xl space-y-4 sm:space-y-6">
                <motion.h1 
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tighter text-white px-4"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  Where Friends Choose the Content, <span className="text-purple-600">Live</span>
                </motion.h1>
                <motion.p 
                  className="max-w-[600px] mx-auto text-muted-foreground text-base sm:text-lg md:text-xl px-4"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  viewport={{ once: true }}
                >
                  WatchMax connects creators with fans in real-time streams where the audience influences what
                  plays next. Create, listen, and engage like never before.
                </motion.p>
                <motion.div 
                  className="flex flex-col gap-2 min-[400px]:flex-row justify-center px-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  viewport={{ once: true }}
                >
                  <motion.button
                  initial={{
                    opacity: 0
                  }}
                  animate={{
                    opacity: 1
                  }}
                  whileHover={{
                    rotateX: 15,
                    rotateY: 5,
                    boxShadow: "0px 20px 50px rgba(147, 51, 234, 0.7)",
                    y: -5
                  }}
                  whileTap={{
                    y: 0
                  }}
                  onClick={handleStartCreating}
                  className="group relative bg-purple-600 text-white hover:bg-purple-900 rounded-lg px-6 py-3 sm:px-4 sm:py-2 cursor-pointer text-sm sm:text-base">
                    <span className="group-hover:text-white transition-colors duration-300" >
                      {session?.user ? 'Start Creating' : 'Create Now'}
                    </span>
                  </motion.button>
                  {/* <Button variant="outline" className="text-white">Join as a Fan</Button> */}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <motion.section 
          id="how-it-works" 
          className="rounded-lg w-full py-8 sm:py-12 md:py-24 lg:py-32"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="rounded-lg container px-4 sm:px-6 md:px-6">
            <motion.div 
              className="flex flex-col items-center justify-center space-y-4 text-center"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="space-y-2">
                <motion.div 
                  className="inline-block rounded-lg bg-purple-100 px-3 py-1 text-sm dark:bg-purple-800/30 text-purple-600"
                  variants={scaleIn}
                  initial="initial"
                  whileInView="animate"
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  How It Works
                </motion.div>
                <motion.h2 
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-white px-4"
                  variants={fadeInUp}
                  initial="initial"
                  whileInView="animate"
                  transition={{ duration: 0.8, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  Interactive Streaming
                </motion.h2>
                <motion.p 
                  className="max-w-[900px] text-muted-foreground text-base sm:text-lg md:text-xl px-4"
                  variants={fadeInUp}
                  initial="initial"
                  whileInView="animate"
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  WatchMax brings creators and fans together in a unique experience where the friends helps shape
                  the streams by their votes.
                </motion.p>
              </div>
            </motion.div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 sm:gap-8 py-8 sm:py-12 lg:grid-cols-2 lg:gap-12">
              <motion.div 
                className="flex flex-col justify-center space-y-4 px-4"
                variants={fadeInLeft}
                initial="initial"
                whileInView="animate"
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="space-y-2">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-black">
                    <Mic2 className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">For Creators</h3>
                </div>
                <motion.ul 
                  className="space-y-4"
                  variants={staggerContainer}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                >
                  <motion.li 
                    className="flex items-start space-x-3"
                    variants={staggerItem}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-black">
                      <span className="text-sm font-medium text-purple-600">1</span>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-semibold text-white">Set Up Your Stream</h4>
                      <p className="text-muted-foreground">
                        Create your channel, upload your library, and customize your stream settings.
                      </p>
                    </div>
                  </motion.li>
                  <motion.li 
                    className="flex items-start space-x-3"
                    variants={staggerItem}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-black">
                      <span className="text-sm font-medium text-purple-600">2</span>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-semibold text-white">Go Live</h4>
                      <p className="text-muted-foreground">
                        Start your stream with a single click and connect with your friends in real-time.
                      </p>
                    </div>
                  </motion.li>
                  <motion.li 
                    className="flex items-start space-x-3"
                    variants={staggerItem}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-black">
                      <span className="text-sm font-medium text-purple-600">3</span>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-semibold text-white">Engage With everyone</h4>
                      <p className="text-muted-foreground">
                        Interact with your friends as they vote on songs and influence your playlist.
                      </p>
                    </div>
                  </motion.li>
                </motion.ul>
              </motion.div>
              <motion.div 
                className="flex flex-col justify-center space-y-4 px-4"
                variants={fadeInRight}
                initial="initial"
                whileInView="animate"
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="space-y-2">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-black">
                    <Headphones className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">For Fans</h3>
                </div>
                <motion.ul 
                  className="space-y-4"
                  variants={staggerContainer}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                >
                  <motion.li 
                    className="flex items-start space-x-3"
                    variants={staggerItem}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-black">
                      <span className="text-sm font-medium text-purple-600">1</span>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-semibold text-white">Discover Streams</h4>
                      <p className="text-muted-foreground">
                        Browse live streams by genre, artist, or popularity to find your vibe.
                      </p>
                    </div>
                  </motion.li>
                  <motion.li 
                    className="flex items-start space-x-3"
                    variants={staggerItem}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-black">
                      <span className="text-sm font-medium text-purple-600">2</span>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-semibold text-white">Join the Experience</h4>
                      <p className="text-muted-foreground">
                        Enter a stream and start listening and watching to music curated by creators and other fans.
                      </p>
                    </div>
                  </motion.li>
                  <motion.li 
                    className="flex items-start space-x-3"
                    variants={staggerItem}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-black">
                      <span className="text-sm font-medium text-purple-600">3</span>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-semibold text-white">Influence the Room</h4>
                      <p className="text-muted-foreground">
                        Vote on upcoming songs, request tracks, and chat with the creator and other listeners.
                      </p>
                    </div>
                  </motion.li>
                </motion.ul>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section 
          id="features" 
          className="w-full py-8 sm:py-12 md:py-24 lg:py-32 bg-gradient-to-b from-zinc-900 to-black rounded-4xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="container px-4 sm:px-6 md:px-6">
            <motion.div 
              className="flex flex-col items-center justify-center space-y-4 text-center"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="space-y-2">
                <motion.div 
                  className="inline-block rounded-lg bg-purple-100 px-3 py-1 text-sm dark:bg-purple-800/30 text-purple-600"
                  variants={scaleIn}
                  initial="initial"
                  whileInView="animate"
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  Features
                </motion.div>
                <motion.h2 
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-white px-4"
                  variants={fadeInUp}
                  initial="initial"
                  whileInView="animate"
                  transition={{ duration: 0.8, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  Why Choose WatchMax?
                </motion.h2>
                <motion.p 
                  className="max-w-[900px] text-muted-foreground text-base sm:text-lg md:text-xl px-4"
                  variants={fadeInUp}
                  initial="initial"
                  whileInView="animate"
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  Our platform offers unique features that transform how creators and fans experience music together.
                </motion.p>
              </div>
            </motion.div>
            <motion.div 
              className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:gap-6 py-8 sm:py-12 sm:grid-cols-2 lg:grid-cols-3"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.div 
                className="flex flex-col items-center space-y-2 rounded-lg border border-zinc-800 bg-gradient-to-b from-zinc-900 to-black p-6 shadow-[0_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)]"
                variants={staggerItem}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-800/30">
                  <Play className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-purple-400">Live Streaming</h3>
                <p className="text-center text-muted-foreground">
                  High-quality audio streaming with minimal latency for the best listening experience.
                </p>
              </motion.div>
              <motion.div 
                className="flex flex-col items-center space-y-2 rounded-lg border border-zinc-800 bg-gradient-to-b from-zinc-900 to-black p-6 shadow-md"
                variants={staggerItem}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-800/30">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-purple-400">Fan Participation</h3>
                <p className="text-center text-muted-foreground">
                  Democratic song selection where fans vote on what plays next during the stream.
                </p>
              </motion.div>
              <motion.div 
                className="flex flex-col items-center space-y-2 rounded-lg border border-zinc-800 bg-gradient-to-b from-zinc-900 to-black p-6 shadow-md"
                variants={staggerItem}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-800/30">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-purple-400">Real-time Chat</h3>
                <p className="text-center text-muted-foreground">
                  Connect with creators and other fans through live chat during streams.
                </p>
              </motion.div>
              <motion.div 
                className="flex flex-col items-center space-y-2 rounded-lg border border-zinc-800 bg-gradient-to-b from-zinc-900 to-black p-6 shadow-md"
                variants={staggerItem}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-800/30">
                  <Music className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-purple-400">Music Library</h3>
                <p className="text-center text-muted-foreground">
                  Upload and organize your content for easy access during streams.
                </p>
              </motion.div>
              <motion.div 
                className="flex flex-col items-center space-y-2 rounded-lg border border-zinc-800 bg-gradient-to-b from-zinc-900 to-black p-6 shadow-md"
                variants={staggerItem}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-800/30">
                  <Heart className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-purple-400">Support Creators</h3>
                <p className="text-center text-muted-foreground">
                  Show appreciation with virtual gifts, tips, and subscriptions.
                </p>
              </motion.div>
              <motion.div 
                className="flex flex-col items-center space-y-2 rounded-lg border border-zinc-800 bg-gradient-to-b from-zinc-900 to-black p-6 shadow-md"
                variants={staggerItem}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-800/30">
                  <Radio className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-purple-400">Discover New Music</h3>
                <p className="text-center text-muted-foreground">
                  Find new artists and songs through personalized recommendations.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          className="w-full py-8 sm:py-12 md:py-24 lg:py-32 bg-gradient-to-r from-zinc-900 to-black text-white rounded-t-4xl"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="container px-4 sm:px-6 md:px-6">
            <motion.div 
              className="flex flex-col items-center justify-center space-y-4 text-center"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="space-y-2">
                <motion.h2 
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter px-4"
                  variants={fadeInUp}
                  initial="initial"
                  whileInView="animate"
                  transition={{ duration: 0.8, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  Ready to Transform Your Experience?
                </motion.h2>
                <motion.p 
                  className="mx-auto max-w-[700px] text-base sm:text-lg md:text-xl px-4"
                  variants={fadeInUp}
                  initial="initial"
                  whileInView="animate"
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  Join thousands of creators and fans already connecting through interactive streams.
                </motion.p>
              </div>
              <motion.div 
                className="flex flex-col gap-2 min-[400px]:flex-row px-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <motion.button
                initial={{
                  opacity: 0
                }}
                animate={{
                  opacity: 1
                }}
                whileHover={{
                  rotateX: 15,
                  rotateY: 5,
                  boxShadow: "0px 20px 50px rgba(147, 51, 234, 0.7)",
                  y: -5
                }}
                whileTap={{
                  y: 0
                }}
                onClick={handleStartCreating}
                className="group relative bg-white text-purple-600 hover:bg-gray-100 rounded-lg px-6 py-3 sm:px-4 sm:py-2 cursor-pointer text-sm sm:text-base">
                  <span className="group-hover:text-purple-600 transition-colors duration-300" >
                    {session?.user ? 'Start Creating' : 'Sign In to Create'}
                  </span>
                </motion.button>
                {/* <Button variant="outline" className="border-white text-white hover:bg-purple-700">Join as a Fan</Button> */}
              </motion.div>
              <motion.p 
                className="text-sm text-purple-100"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                viewport={{ once: true }}
              >
                No credit card required. Free to get started.
              </motion.p>
            </motion.div>
          </div>
        </motion.section>
      </main>
      <motion.footer 
        className="flex justify-center items-center w-full border-t border-zinc-800 bg-black py-6 sm:py-8 md:py-12"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container flex flex-col items-center justify-center gap-4 px-4 sm:px-6 md:px-6 md:flex-row md:justify-between">
          <div className="flex gap-2 items-center text-lg sm:text-xl font-bold">
            <Radio className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />
            <span className="text-white">WatchMax</span>
          </div>
          <div className="flex gap-3 sm:gap-4">
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
          <p className="text-xs sm:text-sm text-muted-foreground text-center md:text-left">© {new Date().getFullYear()} WatchMax. All rights reserved.</p>
        </div>
      </motion.footer>
    </motion.div>
  )
}

