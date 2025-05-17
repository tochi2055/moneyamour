"use client"

import { useState, useEffect } from "react"
import { Clock, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"

interface ScheduleItem {
  id: string
  enabled: boolean
  startTime: string
  endTime: string
  theme: string
  colorTheme: string
  days: string[]
}

export function ThemeScheduler() {
  const { setTheme } = useTheme()
  const [scheduleEnabled, setScheduleEnabled] = useState(false)
  const [schedules, setSchedules] = useState<ScheduleItem[]>([])

  // Load schedules from localStorage on component mount
  useEffect(() => {
    const savedSchedules = localStorage.getItem("themeSchedules")
    const savedScheduleEnabled = localStorage.getItem("themeScheduleEnabled")

    if (savedSchedules) {
      setSchedules(JSON.parse(savedSchedules))
    }

    if (savedScheduleEnabled) {
      setScheduleEnabled(savedScheduleEnabled === "true")
    }
  }, [])

  // Save schedules to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("themeSchedules", JSON.stringify(schedules))
    localStorage.setItem("themeScheduleEnabled", scheduleEnabled.toString())
  }, [schedules, scheduleEnabled])

  // Check schedules and apply theme based on current time
  useEffect(() => {
    if (!scheduleEnabled) return

    const checkSchedule = () => {
      const now = new Date()
      const currentDay = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][now.getDay()]
      const currentTime = now.toTimeString().substring(0, 5) // HH:MM format

      // Find active schedule
      const activeSchedule = schedules.find((schedule) => {
        if (!schedule.enabled) return false
        if (!schedule.days.includes(currentDay)) return false

        // Check if current time is within schedule time range
        return schedule.startTime <= currentTime && currentTime <= schedule.endTime
      })

      if (activeSchedule) {
        // Apply theme
        setTheme(activeSchedule.theme)

        // Apply color theme by setting data attribute
        document.documentElement.setAttribute("data-color-theme", activeSchedule.colorTheme)

        // Store the active theme info for persistence
        localStorage.setItem(
          "activeThemeSchedule",
          JSON.stringify({
            theme: activeSchedule.theme,
            colorTheme: activeSchedule.colorTheme,
            appliedAt: new Date().toISOString(),
          }),
        )
      }
    }

    // Check immediately and then every minute
    checkSchedule()
    const interval = setInterval(checkSchedule, 60 * 1000)

    return () => clearInterval(interval)
  }, [scheduleEnabled, schedules, setTheme])

  const addSchedule = () => {
    const newSchedule: ScheduleItem = {
      id: Date.now().toString(),
      enabled: true,
      startTime: "08:00",
      endTime: "17:00",
      theme: "light",
      colorTheme: "default",
      days: ["mon", "tue", "wed", "thu", "fri"],
    }

    setSchedules([...schedules, newSchedule])
  }

  const updateSchedule = (id: string, updates: Partial<ScheduleItem>) => {
    setSchedules(schedules.map((schedule) => (schedule.id === id ? { ...schedule, ...updates } : schedule)))
  }

  const removeSchedule = (id: string) => {
    setSchedules(schedules.filter((schedule) => schedule.id !== id))
  }

  const toggleDay = (scheduleId: string, day: string) => {
    const schedule = schedules.find((s) => s.id === scheduleId)
    if (!schedule) return

    const updatedDays = schedule.days.includes(day) ? schedule.days.filter((d) => d !== day) : [...schedule.days, day]

    updateSchedule(scheduleId, { days: updatedDays })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4" />
          <h3 className="text-lg font-medium">Theme Scheduling</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Switch checked={scheduleEnabled} onCheckedChange={setScheduleEnabled} id="schedule-enabled" />
          <Label htmlFor="schedule-enabled">Enable scheduling</Label>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">Schedule automatic theme changes based on time of day.</p>

      <div className="space-y-4">
        {schedules.map((schedule) => (
          <Card key={schedule.id} className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => removeSchedule(schedule.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <CardContent className="pt-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={schedule.enabled}
                      onCheckedChange={(checked) => updateSchedule(schedule.id, { enabled: checked })}
                    />
                    <Label>Active</Label>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label htmlFor={`start-time-${schedule.id}`}>Start Time</Label>
                      <Input
                        id={`start-time-${schedule.id}`}
                        type="time"
                        value={schedule.startTime}
                        onChange={(e) => updateSchedule(schedule.id, { startTime: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`end-time-${schedule.id}`}>End Time</Label>
                      <Input
                        id={`end-time-${schedule.id}`}
                        type="time"
                        value={schedule.endTime}
                        onChange={(e) => updateSchedule(schedule.id, { endTime: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label>Days</Label>
                    <div className="flex flex-wrap gap-1">
                      {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((day) => (
                        <Button
                          key={day}
                          variant={schedule.days.includes(day) ? "default" : "outline"}
                          size="sm"
                          className="h-8 px-2 text-xs"
                          onClick={() => toggleDay(schedule.id, day)}
                        >
                          {day.charAt(0).toUpperCase() + day.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor={`theme-${schedule.id}`}>Theme</Label>
                    <Select
                      value={schedule.theme}
                      onValueChange={(value) => updateSchedule(schedule.id, { theme: value })}
                    >
                      <SelectTrigger id={`theme-${schedule.id}`}>
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor={`color-theme-${schedule.id}`}>Color Theme</Label>
                    <Select
                      value={schedule.colorTheme}
                      onValueChange={(value) => updateSchedule(schedule.id, { colorTheme: value })}
                    >
                      <SelectTrigger id={`color-theme-${schedule.id}`}>
                        <SelectValue placeholder="Select color theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="blue">Blue</SelectItem>
                        <SelectItem value="green">Green</SelectItem>
                        <SelectItem value="purple">Purple</SelectItem>
                        <SelectItem value="orange">Orange</SelectItem>
                        <SelectItem value="pink">Pink</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button variant="outline" className="w-full" onClick={addSchedule}>
          <Plus className="mr-2 h-4 w-4" />
          Add Schedule
        </Button>
      </div>
    </div>
  )
}
