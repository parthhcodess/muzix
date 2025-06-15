"use client"
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSmoothScroll } from "@/hooks/useSmoothScroll"
import { useRouter } from "next/navigation"

export function Appbar() {
    const logSession = useSession();
    const { handleSmoothScroll } = useSmoothScroll();
    const router = useRouter()

    // Function to handle Dashboard navigation
    const handleDashboardClick = (e: React.MouseEvent) => {
        e.preventDefault()
        if (logSession.data?.user) {
            router.push('/dashboard')
        } else {
            signIn()
        }
    }

    return <div>
        <div className="flex flex-1 items-center justify-end space-x-4">
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
    </div>
}