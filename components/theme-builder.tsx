"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Palette, Save, Trash2, Download, Upload, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

function invertColor(hex: string): string {
  // Simple color inversion for dark mode
  if (hex.startsWith("#")) {
    hex = hex.slice(1)
  }

  // Convert to RGB
  let r = Number.parseInt(hex.slice(0, 2), 16)
  let g = Number.parseInt(hex.slice(2, 4), 16)
  let b = Number.parseInt(hex.slice(4, 6), 16)

  // Invert colors
  r = Math.abs(255 - r)
  g = Math.abs(255 - g)
  b = Math.abs(255 - b)

  // Convert back to hex
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
}

interface CustomTheme {
  id: string
  name: string
  colors: {
    background: string
    foreground: string
    primary: string
    primaryForeground: string
    secondary: string
    secondaryForeground: string
    muted: string
    mutedForeground: string
    accent: string
    accentForeground: string
    border: string
  }
}

const defaultTheme: CustomTheme = {
  id: "default",
  name: "New Theme",
  colors: {
    background: "#ffffff",
    foreground: "#0f172a",
    primary: "#0ea5e9",
    primaryForeground: "#f8fafc",
    secondary: "#f97316",
    secondaryForeground: "#0f172a",
    muted: "#f1f5f9",
    mutedForeground: "#64748b",
    accent: "#f1f5f9",
    accentForeground: "#0f172a",
    border: "#e2e8f0",
  },
}

export function ThemeBuilder() {
  const { theme, setTheme } = useTheme()
  const [customThemes, setCustomThemes] = useState<CustomTheme[]>([])
  const [currentTheme, setCurrentTheme] = useState<CustomTheme>({ ...defaultTheme })
  const [previewMode, setPreviewMode] = useState<"light" | "dark">("light")

  // Load custom themes from localStorage on component mount
  useEffect(() => {
    const savedThemes = localStorage.getItem("customThemes")
    if (savedThemes) {
      setCustomThemes(JSON.parse(savedThemes))
    }
  }, [])

  // Save custom themes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("customThemes", JSON.stringify(customThemes))
  }, [customThemes])

  const createNewTheme = () => {
    setCurrentTheme({
      ...defaultTheme,
      id: Date.now().toString(),
      name: `Custom Theme ${customThemes.length + 1}`,
    })
  }

  const updateCurrentTheme = (key: keyof CustomTheme["colors"], value: string) => {
    setCurrentTheme((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [key]: value,
      },
    }))
  }

  const saveTheme = () => {
    // Check if theme already exists
    const existingIndex = customThemes.findIndex((t) => t.id === currentTheme.id)

    if (existingIndex >= 0) {
      // Update existing theme
      const updatedThemes = [...customThemes]
      updatedThemes[existingIndex] = currentTheme
      setCustomThemes(updatedThemes)
    } else {
      // Add new theme
      setCustomThemes([...customThemes, currentTheme])
    }

    toast.success(`Theme "${currentTheme.name}" saved successfully`)
  }

  const deleteTheme = (id: string) => {
    setCustomThemes(customThemes.filter((theme) => theme.id !== id))

    if (currentTheme.id === id) {
      createNewTheme()
    }

    toast.success("Theme deleted successfully")
  }

  const selectTheme = (theme: CustomTheme) => {
    setCurrentTheme({ ...theme })
  }

  const applyTheme = (customTheme: CustomTheme) => {
    // Create CSS variables from the theme colors
    const cssVars = `
      :root {
        --background: ${customTheme.colors.background};
        --foreground: ${customTheme.colors.foreground};
        --primary: ${customTheme.colors.primary};
        --primary-foreground: ${customTheme.colors.primaryForeground};
        --secondary: ${customTheme.colors.secondary};
        --secondary-foreground: ${customTheme.colors.secondaryForeground};
        --muted: ${customTheme.colors.muted};
        --muted-foreground: ${customTheme.colors.mutedForeground};
        --accent: ${customTheme.colors.accent};
        --accent-foreground: ${customTheme.colors.accentForeground};
        --border: ${customTheme.colors.border};
      }
      
      .dark {
        --background: ${invertColor(customTheme.colors.background)};
        --foreground: ${invertColor(customTheme.colors.foreground)};
        --primary: ${customTheme.colors.primary};
        --primary-foreground: ${customTheme.colors.primaryForeground};
        --secondary: ${customTheme.colors.secondary};
        --secondary-foreground: ${customTheme.colors.secondaryForeground};
        --muted: ${invertColor(customTheme.colors.muted)};
        --muted-foreground: ${invertColor(customTheme.colors.mutedForeground)};
        --accent: ${invertColor(customTheme.colors.accent)};
        --accent-foreground: ${invertColor(customTheme.colors.accentForeground)};
        --border: ${invertColor(customTheme.colors.border)};
      }
    `

    // Create or update the custom style element
    let styleEl = document.getElementById("custom-theme-styles")
    if (!styleEl) {
      styleEl = document.createElement("style")
      styleEl.id = "custom-theme-styles"
      document.head.appendChild(styleEl)
    }

    styleEl.textContent = cssVars

    // Store the active custom theme
    localStorage.setItem("activeCustomTheme", JSON.stringify(customTheme))

    // Set theme to light or dark as appropriate
    setTheme(previewMode)

    // Remove any color theme data attribute
    document.documentElement.removeAttribute("data-color-theme")

    // Set custom theme attribute
    document.documentElement.setAttribute("data-custom-theme", customTheme.id)

    toast.success(`Theme "${customTheme.name}" applied`)
  }

  const exportTheme = () => {
    const dataStr = JSON.stringify(currentTheme)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

    const exportFileDefaultName = `${currentTheme.name.toLowerCase().replace(/\s+/g, "-")}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string) as CustomTheme

        // Validate the imported theme
        if (!imported.name || !imported.colors) {
          throw new Error("Invalid theme format")
        }

        // Generate a new ID to avoid conflicts
        imported.id = Date.now().toString()

        setCurrentTheme(imported)
        toast.success(`Theme "${imported.name}" imported successfully`)
      } catch (error) {
        toast.error("Failed to import theme. Invalid format.")
      }
    }
    reader.readAsText(file)

    // Reset the input
    event.target.value = ""
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Palette className="h-4 w-4" />
          <h3 className="text-lg font-medium">Custom Theme Builder</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={createNewTheme}>
            <Plus className="mr-2 h-4 w-4" />
            New Theme
          </Button>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">Create and customize your own themes with precise color control.</p>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-1 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="theme-name">Theme Name</Label>
            <Input
              id="theme-name"
              value={currentTheme.name}
              onChange={(e) => setCurrentTheme({ ...currentTheme, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Saved Themes</Label>
            <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
              {customThemes.length === 0 ? (
                <p className="text-sm text-muted-foreground">No saved themes yet</p>
              ) : (
                customThemes.map((theme) => (
                  <div
                    key={theme.id}
                    className={cn(
                      "flex items-center justify-between p-2 rounded-md cursor-pointer",
                      currentTheme.id === theme.id ? "bg-primary/10" : "hover:bg-muted",
                    )}
                    onClick={() => selectTheme(theme)}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.colors.primary }} />
                      <span>{theme.name}</span>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation()
                          applyTheme(theme)
                        }}
                      >
                        <Palette className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteTheme(theme.id)
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <Button onClick={saveTheme}>
              <Save className="mr-2 h-4 w-4" />
              Save Theme
            </Button>
            <Button variant="outline" onClick={exportTheme}>
              <Download className="mr-2 h-4 w-4" />
              Export Theme
            </Button>
            <div className="relative">
              <Button variant="outline" className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                Import Theme
              </Button>
              <Input
                type="file"
                accept=".json"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={importTheme}
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="colors" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="colors">Colors</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="colors" className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="background-color">Background</Label>
                  <div className="flex space-x-2">
                    <div
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: currentTheme.colors.background }}
                    />
                    <Input
                      id="background-color"
                      type="text"
                      value={currentTheme.colors.background}
                      onChange={(e) => updateCurrentTheme("background", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="foreground-color">Foreground</Label>
                  <div className="flex space-x-2">
                    <div
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: currentTheme.colors.foreground }}
                    />
                    <Input
                      id="foreground-color"
                      type="text"
                      value={currentTheme.colors.foreground}
                      onChange={(e) => updateCurrentTheme("foreground", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary</Label>
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 rounded border" style={{ backgroundColor: currentTheme.colors.primary }} />
                    <Input
                      id="primary-color"
                      type="text"
                      value={currentTheme.colors.primary}
                      onChange={(e) => updateCurrentTheme("primary", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primary-foreground-color">Primary Foreground</Label>
                  <div className="flex space-x-2">
                    <div
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: currentTheme.colors.primaryForeground }}
                    />
                    <Input
                      id="primary-foreground-color"
                      type="text"
                      value={currentTheme.colors.primaryForeground}
                      onChange={(e) => updateCurrentTheme("primaryForeground", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondary-color">Secondary</Label>
                  <div className="flex space-x-2">
                    <div
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: currentTheme.colors.secondary }}
                    />
                    <Input
                      id="secondary-color"
                      type="text"
                      value={currentTheme.colors.secondary}
                      onChange={(e) => updateCurrentTheme("secondary", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondary-foreground-color">Secondary Foreground</Label>
                  <div className="flex space-x-2">
                    <div
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: currentTheme.colors.secondaryForeground }}
                    />
                    <Input
                      id="secondary-foreground-color"
                      type="text"
                      value={currentTheme.colors.secondaryForeground}
                      onChange={(e) => updateCurrentTheme("secondaryForeground", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="muted-color">Muted</Label>
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 rounded border" style={{ backgroundColor: currentTheme.colors.muted }} />
                    <Input
                      id="muted-color"
                      type="text"
                      value={currentTheme.colors.muted}
                      onChange={(e) => updateCurrentTheme("muted", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="muted-foreground-color">Muted Foreground</Label>
                  <div className="flex space-x-2">
                    <div
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: currentTheme.colors.mutedForeground }}
                    />
                    <Input
                      id="muted-foreground-color"
                      type="text"
                      value={currentTheme.colors.mutedForeground}
                      onChange={(e) => updateCurrentTheme("mutedForeground", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accent-color">Accent</Label>
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 rounded border" style={{ backgroundColor: currentTheme.colors.accent }} />
                    <Input
                      id="accent-color"
                      type="text"
                      value={currentTheme.colors.accent}
                      onChange={(e) => updateCurrentTheme("accent", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accent-foreground-color">Accent Foreground</Label>
                  <div className="flex space-x-2">
                    <div
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: currentTheme.colors.accentForeground }}
                    />
                    <Input
                      id="accent-foreground-color"
                      type="text"
                      value={currentTheme.colors.accentForeground}
                      onChange={(e) => updateCurrentTheme("accentForeground", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="border-color">Border</Label>
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 rounded border" style={{ backgroundColor: currentTheme.colors.border }} />
                    <Input
                      id="border-color"
                      type="text"
                      value={currentTheme.colors.border}
                      onChange={(e) => updateCurrentTheme("border", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preview">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">Preview Mode</h4>
                  <div className="flex space-x-2">
                    <Button
                      variant={previewMode === "light" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPreviewMode("light")}
                    >
                      Light
                    </Button>
                    <Button
                      variant={previewMode === "dark" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPreviewMode("dark")}
                    >
                      Dark
                    </Button>
                  </div>
                </div>

                <div
                  className="rounded-lg border p-4"
                  style={{
                    backgroundColor: previewMode === "light" ? currentTheme.colors.background : "#1e293b",
                    color: previewMode === "light" ? currentTheme.colors.foreground : "#f8fafc",
                    borderColor: previewMode === "light" ? currentTheme.colors.border : "#334155",
                  }}
                >
                  <h4 className="text-lg font-semibold mb-4">Theme Preview: {currentTheme.name}</h4>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        className="px-4 py-2 rounded-md text-sm font-medium"
                        style={{
                          backgroundColor: currentTheme.colors.primary,
                          color: currentTheme.colors.primaryForeground,
                        }}
                      >
                        Primary Button
                      </button>

                      <button
                        className="px-4 py-2 rounded-md text-sm font-medium"
                        style={{
                          backgroundColor: currentTheme.colors.secondary,
                          color: currentTheme.colors.secondaryForeground,
                        }}
                      >
                        Secondary Button
                      </button>

                      <button
                        className="px-4 py-2 rounded-md text-sm font-medium border"
                        style={{
                          backgroundColor: "transparent",
                          borderColor: currentTheme.colors.border,
                        }}
                      >
                        Outline Button
                      </button>

                      <button
                        className="px-4 py-2 rounded-md text-sm font-medium"
                        style={{
                          backgroundColor: currentTheme.colors.muted,
                          color: currentTheme.colors.mutedForeground,
                        }}
                      >
                        Muted Button
                      </button>
                    </div>

                    <div
                      className="p-4 rounded-md"
                      style={{
                        backgroundColor: currentTheme.colors.muted,
                        color: currentTheme.colors.mutedForeground,
                      }}
                    >
                      <p className="text-sm">This is a muted card with some sample text.</p>
                    </div>

                    <div
                      className="p-4 rounded-md"
                      style={{
                        backgroundColor: currentTheme.colors.accent,
                        color: currentTheme.colors.accentForeground,
                      }}
                    >
                      <p className="text-sm">This is an accent card with some sample text.</p>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <button
                        className="px-4 py-2 rounded-md text-sm font-medium"
                        style={{
                          backgroundColor: "transparent",
                          color: currentTheme.colors.primary,
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 rounded-md text-sm font-medium"
                        style={{
                          backgroundColor: currentTheme.colors.primary,
                          color: currentTheme.colors.primaryForeground,
                        }}
                      >
                        Apply Theme
                      </button>
                    </div>
                  </div>
                </div>

                <Button className="w-full" onClick={() => applyTheme(currentTheme)}>
                  Apply This Theme
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
