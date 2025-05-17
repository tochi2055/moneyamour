/**
 * Utility for fixing common issues with unclickable elements
 */

// Types of fixes that can be applied
export type FixType =
  | "pointer-events"
  | "z-index"
  | "visibility"
  | "position"
  | "dimensions"
  | "event-handler"
  | "other"

// Interface for fix details
export interface InteractionFix {
  id: string
  elementSelector: string
  issue: string
  fixType: FixType
  fixDescription: string
  fixCode: string
  applied: boolean
}

// Function to apply a fix to an element
export function applyFix(fix: InteractionFix): boolean {
  try {
    const element = document.querySelector(fix.elementSelector)
    if (!element) {
      console.error(`Element not found: ${fix.elementSelector}`)
      return false
    }

    // Execute the fix based on the type
    switch (fix.fixType) {
      case "pointer-events":
        ;(element as HTMLElement).style.pointerEvents = "auto"
        break
      case "z-index":
        ;(element as HTMLElement).style.zIndex = "1000"
        break
      case "visibility":
        ;(element as HTMLElement).style.visibility = "visible"
        ;(element as HTMLElement).style.display = "block"
        ;(element as HTMLElement).style.opacity = "1"
        break
      case "position":
        // Ensure element is positioned correctly
        const position = window.getComputedStyle(element as HTMLElement).position
        if (position === "static") {
          ;(element as HTMLElement).style.position = "relative"
        }
        break
      case "dimensions":
        // Ensure element has dimensions
        ;(element as HTMLElement).style.minWidth = "10px"
        ;(element as HTMLElement).style.minHeight = "10px"
        break
      case "event-handler":
        // Add a click event handler if none exists
        element.addEventListener("click", (e) => {
          console.log("Click handler added by interaction fixer")
        })
        break
      default:
        // For 'other' fixes, we need to evaluate the fix code
        // This is potentially dangerous, so we should be careful
        // eslint-disable-next-line no-eval
        eval(fix.fixCode)
    }

    return true
  } catch (error) {
    console.error("Error applying fix:", error)
    return false
  }
}

// Common fixes for unclickable elements
export const commonFixes: InteractionFix[] = [
  {
    id: "fix-1",
    elementSelector: ".theme-toggle",
    issue: "Theme toggle button is not clickable",
    fixType: "pointer-events",
    fixDescription: "Fix pointer-events style property",
    fixCode: 'document.querySelector(".theme-toggle").style.pointerEvents = "auto";',
    applied: false,
  },
  {
    id: "fix-2",
    elementSelector: ".color-palette-item",
    issue: "Color palette items are not clickable",
    fixType: "z-index",
    fixDescription: "Increase z-index to ensure elements are clickable",
    fixCode: 'document.querySelectorAll(".color-palette-item").forEach(el => el.style.zIndex = "1000");',
    applied: false,
  },
  {
    id: "fix-3",
    elementSelector: ".theme-schedule-button",
    issue: "Theme schedule buttons are not responding to clicks",
    fixType: "event-handler",
    fixDescription: "Add click event handlers to theme schedule buttons",
    fixCode: `
      document.querySelectorAll('.theme-schedule-button').forEach(button => {
        button.addEventListener('click', (e) => {
          console.log('Theme schedule button clicked');
          // Dispatch a custom event that the React component can listen for
          const event = new CustomEvent('theme-schedule-click', { detail: { buttonId: button.id } });
          document.dispatchEvent(event);
        });
      });
    `,
    applied: false,
  },
  // Add more common fixes as needed
]

// Function to diagnose issues with an element
export function diagnoseElement(element: HTMLElement): { issue: string; fixType: FixType } {
  const style = window.getComputedStyle(element)

  if (style.pointerEvents === "none") {
    return { issue: "Element has pointer-events: none", fixType: "pointer-events" }
  }

  if (style.display === "none") {
    return { issue: "Element is not displayed (display: none)", fixType: "visibility" }
  }

  if (style.visibility === "hidden") {
    return { issue: "Element is hidden (visibility: hidden)", fixType: "visibility" }
  }

  if (style.opacity === "0") {
    return { issue: "Element is transparent (opacity: 0)", fixType: "visibility" }
  }

  const rect = element.getBoundingClientRect()
  if (rect.width === 0 || rect.height === 0) {
    return { issue: "Element has zero dimensions", fixType: "dimensions" }
  }

  // Check if element is covered by another element
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  const elementAtPoint = document.elementFromPoint(centerX, centerY)
  if (elementAtPoint !== element && !element.contains(elementAtPoint)) {
    return { issue: "Element is covered by another element", fixType: "z-index" }
  }

  // Check if element has click handlers
  const hasClickHandler =
    element.onclick !== null || element.getAttribute("onClick") !== null || element.getAttribute("onclick") !== null

  if (!hasClickHandler && element.tagName !== "A" && element.tagName !== "BUTTON") {
    return { issue: "Element may not have a click handler", fixType: "event-handler" }
  }

  return { issue: "Unknown issue", fixType: "other" }
}

// Function to generate a fix for an element
export function generateFix(elementSelector: string): InteractionFix {
  const element = document.querySelector(elementSelector) as HTMLElement
  if (!element) {
    return {
      id: `fix-${Date.now()}`,
      elementSelector,
      issue: "Element not found",
      fixType: "other",
      fixDescription: "Element could not be found in the DOM",
      fixCode: "",
      applied: false,
    }
  }

  const diagnosis = diagnoseElement(element)

  let fixCode = ""
  let fixDescription = ""

  switch (diagnosis.fixType) {
    case "pointer-events":
      fixCode = `document.querySelector("${elementSelector}").style.pointerEvents = "auto";`
      fixDescription = "Enable pointer events on the element"
      break
    case "z-index":
      fixCode = `document.querySelector("${elementSelector}").style.zIndex = "1000";`
      fixDescription = "Increase z-index to ensure element is not covered"
      break
    case "visibility":
      fixCode = `
        const el = document.querySelector("${elementSelector}");
        el.style.visibility = "visible";
        el.style.display = "block";
        el.style.opacity = "1";
      `
      fixDescription = "Make element visible"
      break
    case "dimensions":
      fixCode = `
        const el = document.querySelector("${elementSelector}");
        el.style.minWidth = "10px";
        el.style.minHeight = "10px";
      `
      fixDescription = "Ensure element has dimensions"
      break
    case "event-handler":
      fixCode = `
        document.querySelector("${elementSelector}").addEventListener('click', (e) => {
          console.log('Click handler added by interaction fixer');
        });
      `
      fixDescription = "Add click event handler to element"
      break
    default:
      fixCode = `console.log("No automatic fix available for ${elementSelector}");`
      fixDescription = "No automatic fix available"
  }

  return {
    id: `fix-${Date.now()}`,
    elementSelector,
    issue: diagnosis.issue,
    fixType: diagnosis.fixType,
    fixDescription,
    fixCode,
    applied: false,
  }
}
