/**
 * Utility for testing interactive elements in the application
 */

// Types for interactive element testing
export interface InteractiveElement {
  id: string
  selector: string
  description: string
  expectedAction: string
  category: "button" | "link" | "input" | "toggle" | "dropdown" | "other"
  location: string
  status?: "untested" | "success" | "failure"
  errorDetails?: string
}

// Function to test if an element is clickable
export function isElementClickable(element: HTMLElement): boolean {
  // Check if element or any parent has pointer-events: none
  const hasPointerEventsNone = (el: HTMLElement | null): boolean => {
    if (!el) return false
    const style = window.getComputedStyle(el)
    if (style.pointerEvents === "none") return true
    if (el.parentElement) return hasPointerEventsNone(el.parentElement)
    return false
  }

  // Check if element is hidden or has zero dimensions
  const isVisible = (el: HTMLElement): boolean => {
    const style = window.getComputedStyle(el)
    return !(
      style.display === "none" ||
      style.visibility === "hidden" ||
      style.opacity === "0" ||
      (el.getBoundingClientRect().width === 0 && el.getBoundingClientRect().height === 0)
    )
  }

  // Check if element is covered by another element
  const isCovered = (el: HTMLElement): boolean => {
    const rect = el.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const elementAtPoint = document.elementFromPoint(centerX, centerY)
    return elementAtPoint !== el && !el.contains(elementAtPoint)
  }

  return isVisible(element) && !hasPointerEventsNone(element) && !isCovered(element)
}

// Function to simulate a click on an element
export function simulateClick(element: HTMLElement): boolean {
  try {
    // Create and dispatch a mouse event
    const event = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    })

    const cancelled = !element.dispatchEvent(event)
    return !cancelled
  } catch (error) {
    console.error("Error simulating click:", error)
    return false
  }
}

// Database of interactive elements to test
export const interactiveElementsToTest: InteractiveElement[] = [
  // Theme toggle
  {
    id: "theme-toggle",
    selector: '[data-testid="theme-toggle"]',
    description: "Theme toggle button",
    expectedAction: "Toggle between light and dark themes",
    category: "button",
    location: "Top navigation bar",
    status: "untested",
  },
  // Color palette selectors
  {
    id: "color-palette-default",
    selector: '[data-palette="default"]',
    description: "Default color palette selector",
    expectedAction: "Apply default color palette",
    category: "button",
    location: "Settings > Appearance",
    status: "untested",
  },
  {
    id: "color-palette-forest",
    selector: '[data-palette="forest"]',
    description: "Forest color palette selector",
    expectedAction: "Apply forest color palette",
    category: "button",
    location: "Settings > Appearance",
    status: "untested",
  },
  // Theme scheduler buttons
  {
    id: "theme-schedule-add",
    selector: '[data-testid="add-schedule-button"]',
    description: "Add theme schedule button",
    expectedAction: "Open dialog to add a new theme schedule",
    category: "button",
    location: "Settings > Appearance > Theme Scheduler",
    status: "untested",
  },
  // Theme builder controls
  {
    id: "theme-builder-save",
    selector: '[data-testid="save-theme-button"]',
    description: "Save custom theme button",
    expectedAction: "Save current theme customizations",
    category: "button",
    location: "Settings > Appearance > Theme Builder",
    status: "untested",
  },
  // Navigation items
  {
    id: "nav-dashboard",
    selector: 'a[href="/"]',
    description: "Dashboard navigation link",
    expectedAction: "Navigate to dashboard page",
    category: "link",
    location: "Sidebar navigation",
    status: "untested",
  },
  {
    id: "nav-settings",
    selector: 'a[href="/settings"]',
    description: "Settings navigation link",
    expectedAction: "Navigate to settings page",
    category: "link",
    location: "Sidebar navigation",
    status: "untested",
  },
  // Quick action buttons
  {
    id: "quick-action-add-funds",
    selector: 'button:has-text("Add Funds")',
    description: "Add Funds quick action",
    expectedAction: "Open Add Funds dialog",
    category: "button",
    location: "Dashboard > Quick Actions",
    status: "untested",
  },
  {
    id: "quick-action-send-money",
    selector: 'button:has-text("Send Money")',
    description: "Send Money quick action",
    expectedAction: "Open Send Money dialog",
    category: "button",
    location: "Dashboard > Quick Actions",
    status: "untested",
  },
  // Add more elements as needed...
]
