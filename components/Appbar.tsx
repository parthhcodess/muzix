"use client"
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSmoothScroll } from "@/hooks/useSmoothScroll"

export function Appbar() {
    const session = useSession();
    const { handleSmoothScroll } = useSmoothScroll();

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
                      {session.data?.user && <Button variant="outline" size="sm" className="ml-2 text-white" onMouseDown={() => signOut()}>
                        Log Out
                      </Button>}

                      {!session.data?.user && <Button size="sm" className="bg-purple-600 hover:bg-purple-700" onMouseDown={() => signIn()}>
                        Sign up
                      </Button>}
                    </nav>
        </div>
    </div>
}