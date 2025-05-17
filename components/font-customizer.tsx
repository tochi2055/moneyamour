"use client"

import { useState, useEffect } from "react"
import { Type, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

interface FontSettings {
  fontFamily: string
  fontSize: {
    base: number
    headings: {
      h1: number
      h2: number
      h3: number
      h4: number
    }
    body: number
    small: number
  }
  fontWeight: {
    normal: string
    headings: string
    bold: string
  }
  letterSpacing: string
  lineHeight: string
}

const defaultFontSettings: FontSettings = {
  fontFamily: "system-ui",
  fontSize: {
    base: 16,
    headings: {
      h1: 2.25,
      h2: 1.875,
      h3: 1.5,
      h4: 1.25,
    },
    body: 1,
    small: 0.875,
  },
  fontWeight: {
    normal: "400",
    headings: "600",
    bold: "700",
  },
  letterSpacing: "normal",
  lineHeight: "1.5",
}

const fontFamilies = [
  { name: "System UI", value: "system-ui" },
  { name: "Inter", value: "Inter, sans-serif" },
  { name: "Roboto", value: "Roboto, sans-serif" },
  { name: "Open Sans", value: "Open Sans, sans-serif" },
  { name: "Lato", value: "Lato, sans-serif" },
  { name: "Poppins", value: "Poppins, sans-serif" },
  { name: "Montserrat", value: "Montserrat, sans-serif" },
  { name: "Playfair Display", value: "Playfair Display, serif" },
  { name: "Merriweather", value: "Merriweather, serif" },
  { name: "Source Code Pro", value: "Source Code Pro, monospace" },
]

const fontWeights = [
  { name: "Thin (100)", value: "100" },
  { name: "Extra Light (200)", value: "200" },
  { name: "Light (300)", value: "300" },
  { name: "Regular (400)", value: "400" },
  { name: "Medium (500)", value: "500" },
  { name: "Semi Bold (600)", value: "600" },
  { name: "Bold (700)", value: "700" },
  { name: "Extra Bold (800)", value: "800" },
  { name: "Black (900)", value: "900" },
]

const letterSpacings = [
  { name: "Tighter (-0.05em)", value: "-0.05em" },
  { name: "Tight (-0.025em)", value: "-0.025em" },
  { name: "Normal", value: "normal" },
  { name: "Wide (0.025em)", value: "0.025em" },
  { name: "Wider (0.05em)", value: "0.05em" },
  { name: "Widest (0.1em)", value: "0.1em" },
]

const lineHeights = [
  { name: "Tight (1.25)", value: "1.25" },
  { name: "Normal (1.5)", value: "1.5" },
  { name: "Relaxed (1.625)", value: "1.625" },
  { name: "Loose (2)", value: "2" },
]

export function FontCustomizer() {
  const [settings, setSettings] = useState<FontSettings>(defaultFontSettings)
  const [fontPreviewEnabled, setFontPreviewEnabled] = useState(false)
  const [fontsLoaded, setFontsLoaded] = useState(false)

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("fontSettings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }

    // Load Google Fonts
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Lato:wght@100;300;400;700;900&family=Merriweather:wght@300;400;700;900&family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Open+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700;800;900&family=Poppins:wght@100;200;300;400;500;600;700;800;900&family=Roboto:wght@100;300;400;500;700;900&family=Source+Code+Pro:wght@200;300;400;500;600;700;800;900&display=swap"
    document.head.appendChild(link)

    link.onload = () => setFontsLoaded(true)

    return () => {
      // Clean up
      if (fontPreviewEnabled) {
        document.documentElement.removeAttribute("style")
      }
    }
  }, [fontPreviewEnabled])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("fontSettings", JSON.stringify(settings))
  }, [settings])

  // Apply font preview
  useEffect(() => {
    if (!fontsLoaded) return

    if (fontPreviewEnabled) {
      applyFontSettings()
    } else {
      document.documentElement.removeAttribute("style")
    }
  }, [fontPreviewEnabled, settings, fontsLoaded])

  const updateSettings = <K extends keyof FontSettings>(key: K, value: FontSettings[K]) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const updateFontSize = (key: keyof FontSettings["fontSize"], value: number) => {
    if (key === "base") {
      setSettings((prev) => ({
        ...prev,
        fontSize: {
          ...prev.fontSize,
          base: value,
        },
      }))
    } else if (key === "body" || key === "small") {
      setSettings((prev) => ({
        ...prev,
        fontSize: {
          ...prev.fontSize,
          [key]: value,
        },
      }))
    }
  }

  const updateHeadingSize = (key: keyof FontSettings["fontSize"]["headings"], value: number) => {
    setSettings((prev) => ({
      ...prev,
      fontSize: {
        ...prev.fontSize,
        headings: {
          ...prev.fontSize.headings,
          [key]: value,
        },
      },
    }))
  }

  const updateFontWeight = (key: keyof FontSettings["fontWeight"], value: string) => {
    setSettings((prev) => ({
      ...prev,
      fontWeight: {
        ...prev.fontWeight,
        [key]: value,
      },
    }))
  }

  const applyFontSettings = () => {
    const { fontFamily, fontSize, fontWeight, letterSpacing, lineHeight } = settings

    const css = `
      :root {
        --font-family: ${fontFamily};
        --font-size-base: ${fontSize.base}px;
        --font-weight-normal: ${fontWeight.normal};
        --font-weight-bold: ${fontWeight.bold};
        --font-weight-headings: ${fontWeight.headings};
        --letter-spacing: ${letterSpacing};
        --line-height: ${lineHeight};
      }
      
      html {
        font-family: var(--font-family);
        font-size: var(--font-size-base);
        letter-spacing: var(--letter-spacing);
        line-height: var(--line-height);
      }
      
      body {
        font-size: ${fontSize.body}rem;
        font-weight: var(--font-weight-normal);
      }
      
      h1 {
        font-size: ${fontSize.headings.h1}rem;
        font-weight: var(--font-weight-headings);
      }
      
      h2 {
        font-size: ${fontSize.headings.h2}rem;
        font-weight: var(--font-weight-headings);
      }
      
      h3 {
        font-size: ${fontSize.headings.h3}rem;
        font-weight: var(--font-weight-headings);
      }
      
      h4, h5, h6 {
        font-size: ${fontSize.headings.h4}rem;
        font-weight: var(--font-weight-headings);
      }
      
      small {
        font-size: ${fontSize.small}rem;
      }
      
      strong, b {
        font-weight: var(--font-weight-bold);
      }
    `

    // Create or update the custom style element
    let styleEl = document.getElementById("custom-font-styles")
    if (!styleEl) {
      styleEl = document.createElement("style")
      styleEl.id = "custom-font-styles"
      document.head.appendChild(styleEl)
    }

    styleEl.textContent = css

    toast.success("Font settings applied")
  }

  const resetToDefaults = () => {
    setSettings(defaultFontSettings)
    toast.success("Font settings reset to defaults")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Type className="h-4 w-4" />
          <h3 className="text-lg font-medium">Font Customization</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Switch checked={fontPreviewEnabled} onCheckedChange={setFontPreviewEnabled} id="font-preview" />
          <Label htmlFor="font-preview">Preview fonts</Label>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">Customize typography settings for your dashboard.</p>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="font-family">Font Family</Label>
            <Select value={settings.fontFamily} onValueChange={(value) => updateSettings("fontFamily", value)}>
              <SelectTrigger id="font-family">
                <SelectValue placeholder="Select font family" />
              </SelectTrigger>
              <SelectContent>
                {fontFamilies.map((font) => (
                  <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                    {font.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="base-font-size">Base Font Size ({settings.fontSize.base}px)</Label>
            <Slider
              id="base-font-size"
              min={12}
              max={24}
              step={1}
              value={[settings.fontSize.base]}
              onValueChange={(value) => updateFontSize("base", value[0])}
            />
          </div>

          <div className="space-y-2">
            <Label>Font Weights</Label>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="normal-weight" className="text-xs">
                  Normal Text
                </Label>
                <Select value={settings.fontWeight.normal} onValueChange={(value) => updateFontWeight("normal", value)}>
                  <SelectTrigger id="normal-weight">
                    <SelectValue placeholder="Normal weight" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontWeights.map((weight) => (
                      <SelectItem key={weight.value} value={weight.value}>
                        {weight.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="headings-weight" className="text-xs">
                  Headings
                </Label>
                <Select
                  value={settings.fontWeight.headings}
                  onValueChange={(value) => updateFontWeight("headings", value)}
                >
                  <SelectTrigger id="headings-weight">
                    <SelectValue placeholder="Headings weight" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontWeights.map((weight) => (
                      <SelectItem key={weight.value} value={weight.value}>
                        {weight.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="bold-weight" className="text-xs">
                  Bold Text
                </Label>
                <Select value={settings.fontWeight.bold} onValueChange={(value) => updateFontWeight("bold", value)}>
                  <SelectTrigger id="bold-weight">
                    <SelectValue placeholder="Bold weight" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontWeights.map((weight) => (
                      <SelectItem key={weight.value} value={weight.value}>
                        {weight.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="letter-spacing">Letter Spacing</Label>
            <Select value={settings.letterSpacing} onValueChange={(value) => updateSettings("letterSpacing", value)}>
              <SelectTrigger id="letter-spacing">
                <SelectValue placeholder="Select letter spacing" />
              </SelectTrigger>
              <SelectContent>
                {letterSpacings.map((spacing) => (
                  <SelectItem key={spacing.value} value={spacing.value}>
                    {spacing.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="line-height">Line Height</Label>
            <Select value={settings.lineHeight} onValueChange={(value) => updateSettings("lineHeight", value)}>
              <SelectTrigger id="line-height">
                <SelectValue placeholder="Select line height" />
              </SelectTrigger>
              <SelectContent>
                {lineHeights.map((height) => (
                  <SelectItem key={height.value} value={height.value}>
                    {height.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Heading Sizes (rem)</Label>
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <Label htmlFor="h1-size" className="text-xs">
                    H1 ({settings.fontSize.headings.h1}rem)
                  </Label>
                </div>
                <Slider
                  id="h1-size"
                  min={1.5}
                  max={4}
                  step={0.125}
                  value={[settings.fontSize.headings.h1]}
                  onValueChange={(value) => updateHeadingSize("h1", value[0])}
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <Label htmlFor="h2-size" className="text-xs">
                    H2 ({settings.fontSize.headings.h2}rem)
                  </Label>
                </div>
                <Slider
                  id="h2-size"
                  min={1.25}
                  max={3}
                  step={0.125}
                  value={[settings.fontSize.headings.h2]}
                  onValueChange={(value) => updateHeadingSize("h2", value[0])}
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <Label htmlFor="h3-size" className="text-xs">
                    H3 ({settings.fontSize.headings.h3}rem)
                  </Label>
                </div>
                <Slider
                  id="h3-size"
                  min={1}
                  max={2.5}
                  step={0.125}
                  value={[settings.fontSize.headings.h3]}
                  onValueChange={(value) => updateHeadingSize("h3", value[0])}
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <Label htmlFor="h4-size" className="text-xs">
                    H4 ({settings.fontSize.headings.h4}rem)
                  </Label>
                </div>
                <Slider
                  id="h4-size"
                  min={0.875}
                  max={2}
                  step={0.125}
                  value={[settings.fontSize.headings.h4]}
                  onValueChange={(value) => updateHeadingSize("h4", value[0])}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Text Sizes (rem)</Label>
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <Label htmlFor="body-size" className="text-xs">
                    Body Text ({settings.fontSize.body}rem)
                  </Label>
                </div>
                <Slider
                  id="body-size"
                  min={0.75}
                  max={1.5}
                  step={0.125}
                  value={[settings.fontSize.body]}
                  onValueChange={(value) => updateFontSize("body", value[0])}
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <Label htmlFor="small-size" className="text-xs">
                    Small Text ({settings.fontSize.small}rem)
                  </Label>
                </div>
                <Slider
                  id="small-size"
                  min={0.625}
                  max={1}
                  step={0.125}
                  value={[settings.fontSize.small]}
                  onValueChange={(value) => updateFontSize("small", value[0])}
                />
              </div>
            </div>
          </div>

          <div
            className="mt-6 p-4 border rounded-md"
            style={{
              fontFamily: fontsLoaded ? settings.fontFamily : "inherit",
            }}
          >
            <h3 className="text-lg font-semibold mb-2">Typography Preview</h3>
            <div className="space-y-4">
              <div>
                <h1
                  style={{ fontSize: `${settings.fontSize.headings.h1}rem`, fontWeight: settings.fontWeight.headings }}
                >
                  Heading 1
                </h1>
                <h2
                  style={{ fontSize: `${settings.fontSize.headings.h2}rem`, fontWeight: settings.fontWeight.headings }}
                >
                  Heading 2
                </h2>
                <h3
                  style={{ fontSize: `${settings.fontSize.headings.h3}rem`, fontWeight: settings.fontWeight.headings }}
                >
                  Heading 3
                </h3>
                <h4
                  style={{ fontSize: `${settings.fontSize.headings.h4}rem`, fontWeight: settings.fontWeight.headings }}
                >
                  Heading 4
                </h4>
              </div>

              <div>
                <p style={{ fontSize: `${settings.fontSize.body}rem`, fontWeight: settings.fontWeight.normal }}>
                  This is regular body text.{" "}
                  <strong style={{ fontWeight: settings.fontWeight.bold }}>This text is bold.</strong> The quick brown
                  fox jumps over the lazy dog.
                </p>
                <p style={{ fontSize: `${settings.fontSize.small}rem` }} className="mt-2">
                  This is small text, used for captions and supporting information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={resetToDefaults}>
          Reset to Defaults
        </Button>
        <Button onClick={applyFontSettings}>
          <Check className="mr-2 h-4 w-4" />
          Apply Font Settings
        </Button>
      </div>
    </div>
  )
}
