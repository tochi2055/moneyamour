"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useFirebaseAuth } from "@/contexts/firebase-auth-context"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useFirebaseAuth()
  const router = useRouter()
  const pathname = usePathname()

  // List of public routes that don't require authentication
  const publicRoutes = ["/login", "/signup", "/forgot-password", "/forget-me"]
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  useEffect(() => {
    // If not loading anymore and no user and not on a public route
    if (!loading && !user && !isPublicRoute) {
      router.push("/login")
    }

    // If user is logged in and trying to access auth pages, redirect to dashboard
    if (!loading && user && isPublicRoute) {
      router.push("/")
    }
  }, [user, loading, router, pathname, isPublicRoute])

  // Show nothing while loading or redirecting
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  // For public routes or authenticated users on protected routes
  if (isPublicRoute || user) {
    return <>{children}</>
  }

  // Default case - should not render anything while redirecting
  return null
}
