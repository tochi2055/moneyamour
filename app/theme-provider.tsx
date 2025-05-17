"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Check for scheduled themes on mount
  React.useEffect(() => {
    const checkScheduledThemes = () => {
      const scheduleEnabled = localStorage.getItem("themeScheduleEnabled")

      if (scheduleEnabled !== "true") return

      try {
        const schedules = JSON.parse(localStorage.getItem("themeSchedules") || "[]")
        const now = new Date()
        const currentDay = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][now.getDay()]
        const currentTime = now.toTimeString().substring(0, 5) // HH:MM format

        // Find active schedule
        const activeSchedule = schedules.find((schedule: any) => {
          if (!schedule.enabled) return false
          if (!schedule.days.includes(currentDay)) return false
          return schedule.startTime <= currentTime && currentTime <= schedule.endTime
        })

        if (activeSchedule) {
          // Apply theme and color theme
          document.documentElement.setAttribute("data-theme", activeSchedule.theme)
          document.documentElement.setAttribute("data-color-theme", activeSchedule.colorTheme)
        }
      } catch (error) {
        console.error("Error checking scheduled themes:", error)
      }
    }

    // Check immediately and then every minute
    checkScheduledThemes()
    const interval = setInterval(checkScheduledThemes, 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
