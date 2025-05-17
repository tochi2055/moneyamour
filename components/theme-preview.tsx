"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { CreditCard, DollarSign, LineChart, User, Bell } from "lucide-react"
import { cn } from "@/lib/utils"

const colorThemes = [
  { name: "Default", value: "default", primary: "#0ea5e9", secondary: "#f97316" },
  { name: "Blue", value: "blue", primary: "#3b82f6", secondary: "#60a5fa" },
  { name: "Green", value: "green", primary: "#10b981", secondary: "#34d399" },
  { name: "Purple", value: "purple", primary: "#8b5cf6", secondary: "#a78bfa" },
  { name: "Orange", value: "orange", primary: "#f97316", secondary: "#fb923c" },
  { name: "Pink", value: "pink", primary: "#ec4899", secondary: "#f472b6" },
]

export function ThemePreview() {
  const { theme, setTheme } = useTheme()
  const [previewTheme, setPreviewTheme] = useState(theme || "light")
  const [previewColorTheme, setPreviewColorTheme] = useState(
    typeof window !== "undefined" ? localStorage.getItem("colorTheme") || "default" : "default",
  )

  const applyTheme = () => {
    setTheme(previewTheme)
    document.documentElement.setAttribute("data-color-theme", previewColorTheme)
    localStorage.setItem("colorTheme", previewColorTheme)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h3 className="text-lg font-medium">Theme Preview</h3>
        <p className="text-sm text-muted-foreground">
          Preview how your dashboard will look with different themes and colors.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Mode</h4>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={previewTheme === "light" ? "default" : "outline"}
                size="sm"
                onClick={() => setPreviewTheme("light")}
              >
                Light
              </Button>
              <Button
                variant={previewTheme === "dark" ? "default" : "outline"}
                size="sm"
                onClick={() => setPreviewTheme("dark")}
              >
                Dark
              </Button>
              <Button
                variant={previewTheme === "system" ? "default" : "outline"}
                size="sm"
                onClick={() => setPreviewTheme("system")}
              >
                System
              </Button>
            </div>

            <h4 className="text-sm font-medium pt-4">Color Theme</h4>
            <div className="flex flex-wrap gap-2">
              {colorThemes.map((colorTheme) => (
                <Button
                  key={colorTheme.value}
                  variant={previewColorTheme === colorTheme.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewColorTheme(colorTheme.value)}
                  className="relative"
                >
                  {colorTheme.name}
                  <span className="ml-2 h-3 w-3 rounded-full" style={{ backgroundColor: colorTheme.primary }} />
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Button onClick={applyTheme} className="w-full mb-4">
              Apply Theme
            </Button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "rounded-lg border p-4 transition-colors",
          previewTheme === "dark" ? "bg-slate-950 text-slate-50" : "bg-white",
        )}
      >
        <h4 className="text-sm font-medium mb-4">Preview</h4>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h5 className={cn("text-lg font-semibold", `theme-${previewColorTheme}`)}>MoneyAmour Dashboard</h5>
            <div className="flex items-center space-x-2">
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center",
                  previewTheme === "dark" ? "bg-slate-800" : "bg-slate-100",
                )}
              >
                <Bell size={16} className={`theme-${previewColorTheme}-text`} />
              </div>
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center",
                  previewTheme === "dark" ? "bg-slate-800" : "bg-slate-100",
                )}
              >
                <User size={16} className={`theme-${previewColorTheme}-text`} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div
              className={cn(
                "p-2 rounded-md flex items-center space-x-2",
                previewTheme === "dark" ? "bg-slate-900" : "bg-slate-50",
              )}
            >
              <DollarSign size={16} className={`theme-${previewColorTheme}-text`} />
              <span className="text-xs">Balance</span>
            </div>
            <div
              className={cn(
                "p-2 rounded-md flex items-center space-x-2",
                previewTheme === "dark" ? "bg-slate-900" : "bg-slate-50",
              )}
            >
              <CreditCard size={16} className={`theme-${previewColorTheme}-text`} />
              <span className="text-xs">Cards</span>
            </div>
            <div
              className={cn(
                "p-2 rounded-md flex items-center space-x-2",
                previewTheme === "dark" ? "bg-slate-900" : "bg-slate-50",
              )}
            >
              <LineChart size={16} className={`theme-${previewColorTheme}-text`} />
              <span className="text-xs">Analytics</span>
            </div>
          </div>

          <div
            className={cn(
              "h-24 rounded-md flex items-center justify-center",
              previewTheme === "dark" ? "bg-slate-900" : "bg-slate-50",
            )}
          >
            <div className={`theme-${previewColorTheme}-text font-medium`}>Chart Preview</div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              className={cn(previewTheme === "dark" ? "border-slate-700 hover:bg-slate-800" : "")}
            >
              Cancel
            </Button>
            <Button size="sm" className={`theme-${previewColorTheme}-bg`}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
