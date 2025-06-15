"use client"
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSmoothScroll } from "@/hooks/useSmoothScroll"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function Appbar() {
    const logSession = useSession();
    const { handleSmoothScroll } = useSmoothScroll();
    const router = useRouter()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    // Function to handle Dashboard navigation
    const handleDashboardClick = (e: React.MouseEvent) => {
        e.preventDefault()
        if (logSession.data?.user) {
            router.push('/dashboard')
        } else {
            signIn()
        }
        setIsMenuOpen(false) // Close mobile menu after navigation
    }

    const handleLinkClick = () => {
        setIsMenuOpen(false) // Close mobile menu after navigation
    }

    return <div className="relative">
        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Link
              href="#how-it-works"
              onClick={(e) => handleSmoothScroll(e, 'how-it-works')}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-white"
            >
              How It Works
            </Link>
            <Link
              href="#features"
              onClick={(e) => handleSmoothScroll(e, 'features')}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-white"
            >
              Features
            </Link>
            <a
              href="/dashboard"
              onClick={handleDashboardClick}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-white cursor-pointer"
            >
              {logSession.data?.user ? 'Dashboard' : 'Dashboard'}
            </a>
            {logSession.data?.user && <Button size="sm" className="bg-black text-slate-500 border-2 px-4 py-2 border-slate-500 hover:border-white hover:bg-black hover:text-white hover:cursor-pointer" onMouseDown={() => signOut()}>
              Log Out
            </Button>}

            {!logSession.data?.user && <Button size="sm" className="bg-black border-2 px-4 py-2 border-slate-500 hover:border-white hover:bg-black hover:cursor-pointer" onMouseDown={() => signIn()}>
              Sign up
            </Button>}
          </nav>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-white hover:text-purple-400 transition-colors relative z-50 touch-target"
            whileTap={{ scale: 0.95 }}
            animate={{ rotate: isMenuOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                onClick={() => setIsMenuOpen(false)}
              />
              
              {/* Menu Panel */}
              <motion.div
                initial={{ 
                  opacity: 0, 
                  scale: 0.95,
                  x: 20,
                  y: -10
                }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  x: 0,
                  y: 0
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 0.95,
                  x: 20,
                  y: -10
                }}
                transition={{ 
                  duration: 0.2,
                  ease: "easeOut"
                }}
                className="fixed top-16 right-4 w-72 bg-black/95 backdrop-blur-xl border border-gray-800 rounded-xl shadow-2xl z-50 md:hidden"
              >
                <nav className="flex flex-col p-6 space-y-4">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Link
                      href="#how-it-works"
                      onClick={(e) => {
                        handleSmoothScroll(e, 'how-it-works')
                        handleLinkClick()
                      }}
                      className="block text-sm font-medium text-muted-foreground transition-colors hover:text-white py-3 px-2 rounded-lg hover:bg-gray-800/50"
                    >
                      How It Works
                    </Link>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <Link
                      href="#features"
                      onClick={(e) => {
                        handleSmoothScroll(e, 'features')
                        handleLinkClick()
                      }}
                      className="block text-sm font-medium text-muted-foreground transition-colors hover:text-white py-3 px-2 rounded-lg hover:bg-gray-800/50"
                    >
                      Features
                    </Link>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <a
                      href="/dashboard"
                      onClick={handleDashboardClick}
                      className="block text-sm font-medium text-muted-foreground transition-colors hover:text-white cursor-pointer py-3 px-2 rounded-lg hover:bg-gray-800/50"
                    >
                      {logSession.data?.user ? 'Dashboard' : 'Dashboard'}
                    </a>
                  </motion.div>
                  
                  <motion.div 
                    className="pt-4 border-t border-gray-800"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    {logSession.data?.user && (
                      <Button 
                        size="sm" 
                        className="w-full bg-black text-slate-500 border-2 px-4 py-3 border-slate-500 hover:border-white hover:bg-black hover:text-white hover:cursor-pointer mb-3 touch-target" 
                        onMouseDown={() => {
                          signOut()
                          handleLinkClick()
                        }}
                      >
                        Log Out
                      </Button>
                    )}

                    {!logSession.data?.user && (
                      <Button 
                        size="sm" 
                        className="w-full bg-purple-600 hover:bg-purple-700 border-2 px-4 py-3 border-purple-600 hover:border-purple-500 hover:cursor-pointer touch-target" 
                        onMouseDown={() => {
                          signIn()
                          handleLinkClick()
                        }}
                      >
                        Sign up
                      </Button>
                    )}
                  </motion.div>
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>
    </div>
}