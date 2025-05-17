"use client"

import { useState, useEffect } from "react"
import { Check, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ColorPalette {
  id: string
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
  }
}

const defaultPalettes: ColorPalette[] = [
  {
    id: "default",
    name: "Default",
    colors: {
      primary: "#0ea5e9",
      secondary: "#f97316",
      accent: "#8b5cf6",
    },
  },
  {
    id: "forest",
    name: "Forest",
    colors: {
      primary: "#10b981",
      secondary: "#84cc16",
      accent: "#059669",
    },
  },
  {
    id: "sunset",
    name: "Sunset",
    colors: {
      primary: "#f43f5e",
      secondary: "#f97316",
      accent: "#8b5cf6",
    },
  },
  {
    id: "ocean",
    name: "Ocean",
    colors: {
      primary: "#0ea5e9",
      secondary: "#06b6d4",
      accent: "#3b82f6",
    },
  },
  {
    id: "monochrome",
    name: "Monochrome",
    colors: {
      primary: "#525252",
      secondary: "#737373",
      accent: "#404040",
    },
  },
  {
    id: "vibrant",
    name: "Vibrant",
    colors: {
      primary: "#8b5cf6",
      secondary: "#ec4899",
      accent: "#f43f5e",
    },
  },
]

export function ColorPaletteSelector() {
  const [selectedPalette, setSelectedPalette] = useState<string>("default")
  const [palettes, setPalettes] = useState<ColorPalette[]>(defaultPalettes)

  // Load selected palette from localStorage on component mount
  useEffect(() => {
    const savedPalette = localStorage.getItem("selectedColorPalette")
    if (savedPalette) {
      setSelectedPalette(savedPalette)
      applyPalette(savedPalette)
    }
  }, [])

  const applyPalette = (paletteId: string) => {
    const palette = palettes.find((p) => p.id === paletteId)
    if (!palette) return

    // Create CSS variables for the palette colors
    const cssVars = `
      :root {
        --color-primary: ${palette.colors.primary};
        --color-secondary: ${palette.colors.secondary};
        --color-accent: ${palette.colors.accent};
      }
    `

    // Create or update the custom style element
    let styleEl = document.getElementById("color-palette-styles")
    if (!styleEl) {
      styleEl = document.createElement("style")
      styleEl.id = "color-palette-styles"
      document.head.appendChild(styleEl)
    }

    styleEl.textContent = cssVars

    // Store the selected palette
    localStorage.setItem("selectedColorPalette", paletteId)

    // Set data attribute for the color palette
    document.documentElement.setAttribute("data-color-palette", paletteId)

    toast.success(`Color palette "${palette.name}" applied`)
  }

  const handlePaletteChange = (paletteId: string) => {
    setSelectedPalette(paletteId)
    applyPalette(paletteId)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Palette className="h-4 w-4" />
        <h3 className="text-lg font-medium">Color Palettes</h3>
      </div>

      <p className="text-sm text-muted-foreground">Choose a color palette to customize the look of your dashboard.</p>

      <RadioGroup
        value={selectedPalette}
        onValueChange={handlePaletteChange}
        className="grid grid-cols-2 gap-4 md:grid-cols-3"
      >
        {palettes.map((palette) => (
          <div key={palette.id} className="relative">
            <RadioGroupItem value={palette.id} id={`palette-${palette.id}`} className="sr-only" />
            <Label
              htmlFor={`palette-${palette.id}`}
              className={cn(
                "flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground",
                selectedPalette === palette.id && "border-primary",
              )}
            >
              {selectedPalette === palette.id && <Check className="absolute right-2 top-2 h-4 w-4 text-primary" />}
              <div className="mb-2 flex gap-2">
                <div className="h-5 w-5 rounded-full" style={{ backgroundColor: palette.colors.primary }} />
                <div className="h-5 w-5 rounded-full" style={{ backgroundColor: palette.colors.secondary }} />
                <div className="h-5 w-5 rounded-full" style={{ backgroundColor: palette.colors.accent }} />
              </div>
              <span className="text-center text-sm font-medium">{palette.name}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>

      <div className="pt-2">
        <Button
          variant="outline"
          onClick={() => {
            handlePaletteChange("default")
            toast.success("Reset to default color palette")
          }}
        >
          Reset to Default
        </Button>
      </div>
    </div>
  )
}
