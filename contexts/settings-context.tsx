"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useFirebaseAuth } from "./firebase-auth-context"
import { getUserSettings, saveUserSettings } from "@/lib/firebase/firestore"

export interface UserSettings {
  avatar: string
  fullName: string
  email: string
  phone: string
  timezone: string
  language: string
  currency: string
  dateFormat: string
  fontSize: number
  theme: "light" | "dark" | "system"
  layout: "default" | "compact" | "expanded"
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
    accountActivity: boolean
    newFeatures: boolean
    marketing: boolean
    frequency: "real-time" | "daily" | "weekly"
    quietHoursStart: string
    quietHoursEnd: string
  }
  privacy: {
    analyticsSharing: boolean
    personalizedAds: boolean
    visibility: "public" | "private"
    dataRetention: "6-months" | "1-year" | "2-years" | "indefinite"
  }
}

const defaultSettings: UserSettings = {
  avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/38184074.jpg-M4vCjTSSWVw5RwWvvmrxXBcNVU8MBU.jpeg",
  fullName: "Dollar Singh",
  email: "dollar.singh@example.com",
  phone: "+1 (555) 123-4567",
  timezone: "utc-8",
  language: "en",
  currency: "usd",
  dateFormat: "mm-dd-yyyy",
  fontSize: 16,
  theme: "system",
  layout: "default",
  notifications: {
    email: true,
    push: true,
    sms: false,
    accountActivity: true,
    newFeatures: true,
    marketing: false,
    frequency: "real-time",
    quietHoursStart: "22:00",
    quietHoursEnd: "07:00",
  },
  privacy: {
    analyticsSharing: true,
    personalizedAds: false,
    visibility: "public",
    dataRetention: "1-year",
  },
}

interface SettingsContextType {
  settings: UserSettings
  updateSettings: (newSettings: Partial<UserSettings>) => void
  updateNotificationSettings: (settings: Partial<UserSettings["notifications"]>) => void
  updatePrivacySettings: (settings: Partial<UserSettings["privacy"]>) => void
  isLoading: boolean
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useFirebaseAuth()
  const [settings, setSettings] = useState<UserSettings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)

  // Load settings from Firestore when user changes
  useEffect(() => {
    const loadSettings = async () => {
      if (!user) {
        // If no user is logged in, use default settings or localStorage
        const savedSettings = localStorage.getItem("userSettings")
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings))
        } else {
          setSettings(defaultSettings)
        }
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const userSettings = await getUserSettings(user.uid)

        if (userSettings) {
          // Merge with default settings to ensure all fields exist
          setSettings({ ...defaultSettings, ...userSettings })
        } else {
          // If no settings exist in Firestore, initialize with defaults
          // and user info from Firebase Auth
          const initialSettings = {
            ...defaultSettings,
            fullName: user.displayName || defaultSettings.fullName,
            email: user.email || defaultSettings.email,
            avatar: user.photoURL || defaultSettings.avatar,
          }

          setSettings(initialSettings)
          // Save initial settings to Firestore
          await saveUserSettings(user.uid, initialSettings)
        }
      } catch (error) {
        console.error("Error loading user settings:", error)
        // Fallback to default settings
        setSettings(defaultSettings)
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [user])

  // Save settings to Firestore and localStorage
  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    const updatedSettings = { ...settings, ...newSettings }
    setSettings(updatedSettings)

    // Save to localStorage for offline access
    localStorage.setItem("userSettings", JSON.stringify(updatedSettings))

    // Save to Firestore if user is logged in
    if (user) {
      try {
        await saveUserSettings(user.uid, updatedSettings)
      } catch (error) {
        console.error("Error saving user settings:", error)
      }
    }
  }

  const updateNotificationSettings = async (notificationSettings: Partial<UserSettings["notifications"]>) => {
    const updatedSettings = {
      ...settings,
      notifications: { ...settings.notifications, ...notificationSettings },
    }

    setSettings(updatedSettings)

    // Save to localStorage
    localStorage.setItem("userSettings", JSON.stringify(updatedSettings))

    // Save to Firestore if user is logged in
    if (user) {
      try {
        await saveUserSettings(user.uid, updatedSettings)
      } catch (error) {
        console.error("Error saving notification settings:", error)
      }
    }
  }

  const updatePrivacySettings = async (privacySettings: Partial<UserSettings["privacy"]>) => {
    const updatedSettings = {
      ...settings,
      privacy: { ...settings.privacy, ...privacySettings },
    }

    setSettings(updatedSettings)

    // Save to localStorage
    localStorage.setItem("userSettings", JSON.stringify(updatedSettings))

    // Save to Firestore if user is logged in
    if (user) {
      try {
        await saveUserSettings(user.uid, updatedSettings)
      } catch (error) {
        console.error("Error saving privacy settings:", error)
      }
    }
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        updateNotificationSettings,
        updatePrivacySettings,
        isLoading,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
