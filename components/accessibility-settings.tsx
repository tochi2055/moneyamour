"use client"

import { useState, useEffect } from "react"
import { Accessibility, Check, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface AccessibilitySettings {
  highContrast: boolean
  reducedMotion: boolean
  largerText: boolean
  textSpacing: boolean
  focusIndicators: boolean
  keyboardNavigation: {
    enabled: boolean
    shortcutsEnabled: boolean
  }
  screenReader: {
    optimized: boolean
    announceToasts: boolean
  }
  colorBlindMode: string
  cursorSize: number
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  reducedMotion: false,
  largerText: false,
  textSpacing: false,
  focusIndicators: true,
  keyboardNavigation: {
    enabled: true,
    shortcutsEnabled: true,
  },
  screenReader: {
    optimized: false,
    announceToasts: true,
  },
  colorBlindMode: "none",
  cursorSize: 1,
}

export function AccessibilitySettings() {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings)

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("accessibilitySettings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("accessibilitySettings", JSON.stringify(settings))
  }, [settings])

  // Apply accessibility settings
  useEffect(() => {
    // High Contrast Mode
    if (settings.highContrast) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }

    // Reduced Motion
    if (settings.reducedMotion) {
      document.documentElement.classList.add("reduced-motion")
    } else {
      document.documentElement.classList.remove("reduced-motion")
    }

    // Larger Text
    if (settings.largerText) {
      document.documentElement.classList.add("larger-text")
    } else {
      document.documentElement.classList.remove("larger-text")
    }

    // Text Spacing
    if (settings.textSpacing) {
      document.documentElement.classList.add("increased-spacing")
    } else {
      document.documentElement.classList.remove("increased-spacing")
    }

    // Focus Indicators
    if (settings.focusIndicators) {
      document.documentElement.classList.add("focus-visible")
    } else {
      document.documentElement.classList.remove("focus-visible")
    }

    // Color Blind Mode
    document.documentElement.setAttribute("data-color-blind-mode", settings.colorBlindMode)

    // Cursor Size
    document.documentElement.style.setProperty("--cursor-size", `${settings.cursorSize}`)

    // Create or update the custom style element
    let styleEl = document.getElementById("accessibility-styles")
    if (!styleEl) {
      styleEl = document.createElement("style")
      styleEl.id = "accessibility-styles"
      document.head.appendChild(styleEl)
    }

    styleEl.textContent = `
      .high-contrast {
        --background: #000000;
        --foreground: #ffffff;
        --primary: #ffff00;
        --primary-foreground: #000000;
        --secondary: #ffffff;
        --secondary-foreground: #000000;
        --muted: #333333;
        --muted-foreground: #ffffff;
        --accent: #ffff00;
        --accent-foreground: #000000;
        --border: #ffffff;
      }
      
      .reduced-motion * {
        animation-duration: 0.001ms !important;
        transition-duration: 0.001ms !important;
      }
      
      .larger-text {
        font-size: 120%;
      }
      
      .increased-spacing {
        letter-spacing: 0.12em;
        word-spacing: 0.16em;
        line-height: 1.8;
      }
      
      .focus-visible :focus {
        outline: 3px solid var(--primary);
        outline-offset: 2px;
      }
      
      [data-color-blind-mode="protanopia"] {
        filter: url('#protanopia-filter');
      }
      
      [data-color-blind-mode="deuteranopia"] {
        filter: url('#deuteranopia-filter');
      }
      
      [data-color-blind-mode="tritanopia"] {
        filter: url('#tritanopia-filter');
      }
      
      [data-color-blind-mode="achromatopsia"] {
        filter: grayscale(100%);
      }
      
      html {
        --cursor-size: ${settings.cursorSize};
      }
      
      .custom-cursor * {
        cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${24 * settings.cursorSize}" height="${24 * settings.cursorSize}" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>') 0 0, auto;
      }
    `

    // Add SVG filters for color blindness simulation
    if (!document.getElementById("color-blind-filters")) {
      const filtersSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
      filtersSvg.id = "color-blind-filters"
      filtersSvg.style.display = "none"
      filtersSvg.innerHTML = `
        <filter id="protanopia-filter">
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="0.567, 0.433, 0,     0, 0
                    0.558, 0.442, 0,     0, 0
                    0,     0.242, 0.758, 0, 0
                    0,     0,     0,     1, 0"/>
        </filter>
        <filter id="deuteranopia-filter">
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="0.625, 0.375, 0,   0, 0
                    0.7, 0.3,   0,   0, 0
                    0,   0.3,   0.7, 0, 0
                    0,   0,     0,   1, 0"/>
        </filter>
        <filter id="tritanopia-filter">
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="0.95, 0.05,  0,     0, 0
                    0,    0.433, 0.567, 0, 0
                    0,    0.475, 0.525, 0, 0
                    0,    0,     0,     1, 0"/>
        </filter>
      `
      document.body.appendChild(filtersSvg)
    }

    // Apply cursor settings
    if (settings.cursorSize !== 1) {
      document.documentElement.classList.add("custom-cursor")
    } else {
      document.documentElement.classList.remove("custom-cursor")
    }
  }, [settings])

  const updateSettings = <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const updateNestedSettings = (parent: keyof AccessibilitySettings, key: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof AccessibilitySettings],
        [key]: value,
      },
    }))
  }

  const applySettings = () => {
    // Settings are already applied via useEffect
    toast.success("Accessibility settings applied")
  }

  const resetToDefaults = () => {
    setSettings(defaultSettings)
    toast.success("Accessibility settings reset to defaults")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Accessibility className="h-4 w-4" />
          <h3 className="text-lg font-medium">Accessibility Settings</h3>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Customize accessibility options to make the dashboard more usable for your needs.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h4 className="text-sm font-medium mb-2">Visual Preferences</h4>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="high-contrast">High Contrast Mode</Label>
                <p className="text-xs text-muted-foreground">Increases contrast for better visibility</p>
              </div>
              <Switch
                id="high-contrast"
                checked={settings.highContrast}
                onCheckedChange={(checked) => updateSettings("highContrast", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="reduced-motion">Reduced Motion</Label>
                <p className="text-xs text-muted-foreground">Minimizes animations and transitions</p>
              </div>
              <Switch
                id="reduced-motion"
                checked={settings.reducedMotion}
                onCheckedChange={(checked) => updateSettings("reducedMotion", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="larger-text">Larger Text</Label>
                <p className="text-xs text-muted-foreground">Increases text size throughout the interface</p>
              </div>
              <Switch
                id="larger-text"
                checked={settings.largerText}
                onCheckedChange={(checked) => updateSettings("largerText", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="text-spacing">Increased Text Spacing</Label>
                <p className="text-xs text-muted-foreground">Adds more space between letters and lines</p>
              </div>
              <Switch
                id="text-spacing"
                checked={settings.textSpacing}
                onCheckedChange={(checked) => updateSettings("textSpacing", checked)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color-blind-mode">Color Blind Mode</Label>
              <Select
                value={settings.colorBlindMode}
                onValueChange={(value) => updateSettings("colorBlindMode", value)}
              >
                <SelectTrigger id="color-blind-mode">
                  <SelectValue placeholder="Select color blind mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="protanopia">Protanopia (Red-Blind)</SelectItem>
                  <SelectItem value="deuteranopia">Deuteranopia (Green-Blind)</SelectItem>
                  <SelectItem value="tritanopia">Tritanopia (Blue-Blind)</SelectItem>
                  <SelectItem value="achromatopsia">Achromatopsia (Monochromacy)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="cursor-size">Cursor Size ({settings.cursorSize}x)</Label>
              </div>
              <Slider
                id="cursor-size"
                min={1}
                max={3}
                step={0.5}
                value={[settings.cursorSize]}
                onValueChange={(value) => updateSettings("cursorSize", value[0])}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <h4 className="text-sm font-medium mb-2">Navigation & Interaction</h4>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="focus-indicators">Focus Indicators</Label>
                <p className="text-xs text-muted-foreground">Highlights focused elements for keyboard navigation</p>
              </div>
              <Switch
                id="focus-indicators"
                checked={settings.focusIndicators}
                onCheckedChange={(checked) => updateSettings("focusIndicators", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="keyboard-navigation">Keyboard Navigation</Label>
                <p className="text-xs text-muted-foreground">Enhanced keyboard controls for navigation</p>
              </div>
              <Switch
                id="keyboard-navigation"
                checked={settings.keyboardNavigation.enabled}
                onCheckedChange={(checked) => updateNestedSettings("keyboardNavigation", "enabled", checked)}
              />
            </div>

            <div className="flex items-center justify-between pl-6">
              <div className="space-y-0.5">
                <Label htmlFor="keyboard-shortcuts">Keyboard Shortcuts</Label>
                <p className="text-xs text-muted-foreground">Enable keyboard shortcuts for common actions</p>
              </div>
              <Switch
                id="keyboard-shortcuts"
                checked={settings.keyboardNavigation.shortcutsEnabled}
                onCheckedChange={(checked) => updateNestedSettings("keyboardNavigation", "shortcutsEnabled", checked)}
                disabled={!settings.keyboardNavigation.enabled}
              />
            </div>

            <h4 className="text-sm font-medium mt-6 mb-2">Screen Reader Support</h4>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="screen-reader-optimized">Screen Reader Optimized</Label>
                <p className="text-xs text-muted-foreground">Enhances content for screen readers</p>
              </div>
              <Switch
                id="screen-reader-optimized"
                checked={settings.screenReader.optimized}
                onCheckedChange={(checked) => updateNestedSettings("screenReader", "optimized", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="announce-toasts">Announce Notifications</Label>
                <p className="text-xs text-muted-foreground">Screen readers announce toast notifications</p>
              </div>
              <Switch
                id="announce-toasts"
                checked={settings.screenReader.announceToasts}
                onCheckedChange={(checked) => updateNestedSettings("screenReader", "announceToasts", checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={resetToDefaults}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset to Defaults
        </Button>
        <Button onClick={applySettings}>
          <Check className="mr-2 h-4 w-4" />
          Apply Settings
        </Button>
      </div>
    </div>
  )
}
