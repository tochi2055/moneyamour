"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import {
  type User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth"
import { auth, isFirebaseConfigured } from "@/lib/firebase/firebase"
import { getDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase/firebase"
import { FirebaseStorage } from "firebase/storage"

interface FirebaseAuthContextType {
  user: User | null
  loading: boolean
  isConfigured: boolean
  signUp: (email: string, password: string, displayName: string) => Promise<User>
  signIn: (email: string, password: string) => Promise<User>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>
  reauthenticate: (password: string) => Promise<boolean>
  deleteAccount: () => Promise<void>
}

const FirebaseAuthContext = createContext<FirebaseAuthContextType | undefined>(undefined)

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isConfigured, setIsConfigured] = useState(false)

  // <false | FirebaseStorage>

  useEffect(() => {
    // Check if Firebase is configured
    const configured = isFirebaseConfigured()
    setIsConfigured(!!configured)

    if (configured) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user)
        setLoading(false)
      })

      return () => unsubscribe()
    } else {
      console.warn("Firebase is not configured. Authentication will not work.")
      setLoading(false)
    }
  }, [])

  const signUp = async (email: string, password: string, displayName: string) => {
    if (!isConfigured) {
      throw new Error("Firebase not configured")
    }
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(userCredential.user, { displayName })
    return userCredential.user
  }

  // Sync user theme preferences after login
  const syncUserThemePreferences = async (user: User) => {
    if (!isConfigured) return

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        if (userData.themePreferences) {
          // Apply theme preferences from Firestore
          localStorage.setItem("theme-preferences", JSON.stringify(userData.themePreferences))
          // Dispatch event to notify theme system
          window.dispatchEvent(new Event("storage"))
        }
      }
    } catch (error) {
      console.error("Error syncing theme preferences:", error)
    }
  }

  // Update the signIn function to sync theme preferences
  const signIn = async (email: string, password: string) => {
    if (!isConfigured) {
      throw new Error("Firebase not configured")
    }
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    await syncUserThemePreferences(userCredential.user)
    return userCredential.user
  }

  const logout = async () => {
    if (!isConfigured) {
      throw new Error("Firebase not configured")
    }
    await signOut(auth)
  }

  const resetPassword = async (email: string) => {
    if (!isConfigured) {
      throw new Error("Firebase not configured")
    }
    await sendPasswordResetEmail(auth, email)
  }

  const updateUserProfile = async (displayName: string, photoURL?: string) => {
    if (!user) throw new Error("No user logged in")
    if (!isConfigured) {
      throw new Error("Firebase not configured")
    }
    await updateProfile(user, { displayName, photoURL: photoURL || user.photoURL })
  }

  const reauthenticate = async (password: string) => {
    if (!user || !user.email) return false
    if (!isConfigured) {
      throw new Error("Firebase not configured")
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, password)
      await reauthenticateWithCredential(user, credential)
      return true
    } catch (error) {
      console.error("Reauthentication failed:", error)
      return false
    }
  }

  const deleteAccount = async () => {
    if (!user) throw new Error("No user logged in")
    if (!isConfigured) {
      throw new Error("Firebase not configured")
    }
    await deleteUser(user)
  }

  return (
    <FirebaseAuthContext.Provider
      value={{
        user,
        loading,
        isConfigured,
        signUp,
        signIn,
        logout,
        resetPassword,
        updateUserProfile,
        reauthenticate,
        deleteAccount,
      }}
    >
      {children}
    </FirebaseAuthContext.Provider>
  )
}

export function useFirebaseAuth() {
  const context = useContext(FirebaseAuthContext)
  if (context === undefined) {
    throw new Error("useFirebaseAuth must be used within a FirebaseAuthProvider")
  }
  return context
}
