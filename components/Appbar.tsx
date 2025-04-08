"use client"
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Appbar() {
    const session = useSession();

    return <div>
        <div className="flex flex-1 items-center justify-end space-x-4">
                    <nav className="flex items-center space-x-2">
                      <Link
                        href="#features"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                      >
                        Features
                      </Link>
                      <Link
                        href="#how-it-works"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                      >
                        How It Works
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