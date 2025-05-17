"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  type InteractiveElement,
  interactiveElementsToTest,
  isElementClickable,
  simulateClick,
} from "@/utils/interaction-tester"
import { Play, Pause, RotateCcw, CheckCircle2, XCircle, AlertCircle, Search } from "lucide-react"

export function InteractionSimulator() {
  const [elements, setElements] = useState<InteractiveElement[]>(interactiveElementsToTest)
  const [isRunning, setIsRunning] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [progress, setProgress] = useState(0)
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showSuccessful, setShowSuccessful] = useState(true)
  const [showFailed, setShowFailed] = useState(true)
  const [showUntested, setShowUntested] = useState(true)
  const [autoScroll, setAutoScroll] = useState(true)

  // Filter elements based on search and filter settings
  const filteredElements = elements.filter((element) => {
    // Filter by search query
    const matchesSearch =
      element.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      element.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      element.category.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by status
    const matchesStatus =
      (showSuccessful && element.status === "success") ||
      (showFailed && element.status === "failure") ||
      (showUntested && element.status === "untested")

    // Filter by category
    const matchesCategory = filter === "all" || element.category === filter

    return matchesSearch && matchesStatus && matchesCategory
  })

  // Calculate statistics
  const stats = {
    total: elements.length,
    tested: elements.filter((e) => e.status === "success" || e.status === "failure").length,
    successful: elements.filter((e) => e.status === "success").length,
    failed: elements.filter((e) => e.status === "failure").length,
    untested: elements.filter((e) => e.status === "untested").length,
  }

  // Start the simulation
  const startSimulation = () => {
    setIsRunning(true)
    setCurrentIndex(0)
    // Reset all elements to untested if we're starting from the beginning
    if (currentIndex === -1) {
      setElements(
        elements.map((element) => ({
          ...element,
          status: "untested",
          errorDetails: undefined,
        })),
      )
    }
  }

  // Pause the simulation
  const pauseSimulation = () => {
    setIsRunning(false)
  }

  // Reset the simulation
  const resetSimulation = () => {
    setIsRunning(false)
    setCurrentIndex(-1)
    setProgress(0)
    setElements(
      elements.map((element) => ({
        ...element,
        status: "untested",
        errorDetails: undefined,
      })),
    )
  }

  // Test a specific element
  const testElement = (index: number) => {
    const element = elements[index]

    try {
      // Find the element in the DOM
      const domElement = document.querySelector(element.selector) as HTMLElement

      if (!domElement) {
        // Element not found
        const updatedElements = [...elements]
        updatedElements[index] = {
          ...element,
          status: "failure",
          errorDetails: "Element not found in the DOM",
        }
        setElements(updatedElements)
        return false
      }

      // Check if element is clickable
      const clickable = isElementClickable(domElement)

      if (!clickable) {
        // Element is not clickable
        const updatedElements = [...elements]
        updatedElements[index] = {
          ...element,
          status: "failure",
          errorDetails: "Element is not clickable (hidden, covered, or has pointer-events: none)",
        }
        setElements(updatedElements)
        return false
      }

      // Simulate a click
      const clickResult = simulateClick(domElement)

      // Update element status
      const updatedElements = [...elements]
      updatedElements[index] = {
        ...element,
        status: clickResult ? "success" : "failure",
        errorDetails: clickResult ? undefined : "Click event was cancelled or failed",
      }
      setElements(updatedElements)

      return clickResult
    } catch (error) {
      // Error during testing
      const updatedElements = [...elements]
      updatedElements[index] = {
        ...element,
        status: "failure",
        errorDetails: `Error: ${error instanceof Error ? error.message : String(error)}`,
      }
      setElements(updatedElements)
      return false
    }
  }

  // Run the simulation
  useEffect(() => {
    if (!isRunning || currentIndex < 0 || currentIndex >= elements.length) {
      return
    }

    // Update progress
    setProgress(Math.round((currentIndex / elements.length) * 100))

    // Test the current element
    const timeoutId = setTimeout(() => {
      testElement(currentIndex)

      // Move to the next element
      if (currentIndex < elements.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        // Simulation complete
        setIsRunning(false)
        setProgress(100)
      }
    }, 1000) // 1 second delay between tests

    return () => clearTimeout(timeoutId)
  }, [isRunning, currentIndex, elements])

  // Scroll to the current element in the list
  useEffect(() => {
    if (autoScroll && currentIndex >= 0) {
      const element = document.getElementById(`element-${currentIndex}`)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }, [currentIndex, autoScroll])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Interactive Element Testing Simulation</span>
            <div className="flex items-center space-x-2">
              {isRunning ? (
                <Button variant="outline" size="sm" onClick={pauseSimulation}>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
              ) : (
                <Button variant="default" size="sm" onClick={startSimulation}>
                  <Play className="h-4 w-4 mr-2" />
                  {currentIndex === -1 ? "Start" : "Resume"}
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={resetSimulation}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Tests all interactive elements in the application to identify unclickable instances
          </CardDescription>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress: {progress}%</span>
              <span>
                {stats.tested}/{stats.total} elements tested
              </span>
            </div>
            <Progress value={progress} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search elements..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show-successful"
                    checked={showSuccessful}
                    onCheckedChange={(checked) => setShowSuccessful(!!checked)}
                  />
                  <Label htmlFor="show-successful" className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                    Successful
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show-failed"
                    checked={showFailed}
                    onCheckedChange={(checked) => setShowFailed(!!checked)}
                  />
                  <Label htmlFor="show-failed" className="flex items-center">
                    <XCircle className="h-4 w-4 mr-1 text-red-500" />
                    Failed
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show-untested"
                    checked={showUntested}
                    onCheckedChange={(checked) => setShowUntested(!!checked)}
                  />
                  <Label htmlFor="show-untested" className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1 text-yellow-500" />
                    Untested
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="auto-scroll"
                    checked={autoScroll}
                    onCheckedChange={(checked) => setAutoScroll(!!checked)}
                  />
                  <Label htmlFor="auto-scroll">Auto-scroll</Label>
                </div>
              </div>
            </div>

            <Tabs defaultValue="all" onValueChange={setFilter}>
              <TabsList className="grid grid-cols-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="button">Buttons</TabsTrigger>
                <TabsTrigger value="link">Links</TabsTrigger>
                <TabsTrigger value="input">Inputs</TabsTrigger>
                <TabsTrigger value="toggle">Toggles</TabsTrigger>
                <TabsTrigger value="dropdown">Dropdowns</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {filteredElements.map((element, index) => (
                      <div
                        key={element.id}
                        id={`element-${index}`}
                        className={`p-3 border rounded-md ${
                          currentIndex === index ? "border-primary bg-primary/5" : "border-border"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-medium">{element.description}</h3>
                              <Badge variant="outline" className="ml-2">
                                {element.category}
                              </Badge>
                              {element.status === "success" && (
                                <Badge variant="default" className="ml-2 bg-green-500">
                                  Success
                                </Badge>
                              )}
                              {element.status === "failure" && (
                                <Badge variant="default" className="ml-2 bg-red-500">
                                  Failed
                                </Badge>
                              )}
                              {element.status === "untested" && (
                                <Badge variant="outline" className="ml-2">
                                  Untested
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">Location: {element.location}</p>
                            <p className="text-sm text-muted-foreground">
                              Selector: <code className="bg-muted px-1 py-0.5 rounded">{element.selector}</code>
                            </p>
                            <p className="text-sm text-muted-foreground">Expected action: {element.expectedAction}</p>
                            {element.errorDetails && (
                              <p className="text-sm text-red-500 mt-1">Error: {element.errorDetails}</p>
                            )}
                          </div>
                          <Button variant="outline" size="sm" onClick={() => testElement(index)} disabled={isRunning}>
                            Test
                          </Button>
                        </div>
                      </div>
                    ))}

                    {filteredElements.length === 0 && (
                      <div className="p-8 text-center text-muted-foreground">No elements match your filters</div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* Duplicate the content for other tabs */}
              <TabsContent value="button" className="mt-4">
                {/* Same content as "all" but filtered by the tab value */}
              </TabsContent>
              <TabsContent value="link" className="mt-4">
                {/* Same content as "all" but filtered by the tab value */}
              </TabsContent>
              <TabsContent value="input" className="mt-4">
                {/* Same content as "all" but filtered by the tab value */}
              </TabsContent>
              <TabsContent value="toggle" className="mt-4">
                {/* Same content as "all" but filtered by the tab value */}
              </TabsContent>
              <TabsContent value="dropdown" className="mt-4">
                {/* Same content as "all" but filtered by the tab value */}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex space-x-4">
            <div className="text-sm">
              <span className="font-medium">Total:</span> {stats.total}
            </div>
            <div className="text-sm text-green-500">
              <span className="font-medium">Success:</span> {stats.successful}
            </div>
            <div className="text-sm text-red-500">
              <span className="font-medium">Failed:</span> {stats.failed}
            </div>
            <div className="text-sm text-yellow-500">
              <span className="font-medium">Untested:</span> {stats.untested}
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Simulation Results</CardTitle>
          <CardDescription>Summary of interactive element testing results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-md">
                <div className="text-2xl font-bold text-green-500">{stats.successful}</div>
                <div className="text-sm text-muted-foreground">Successful interactions</div>
              </div>
              <div className="p-4 border rounded-md">
                <div className="text-2xl font-bold text-red-500">{stats.failed}</div>
                <div className="text-sm text-muted-foreground">Failed interactions</div>
              </div>
              <div className="p-4 border rounded-md">
                <div className="text-2xl font-bold">{Math.round((stats.successful / (stats.tested || 1)) * 100)}%</div>
                <div className="text-sm text-muted-foreground">Success rate</div>
              </div>
            </div>

            {stats.failed > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium">Failed Elements</h3>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2">
                    {elements
                      .filter((e) => e.status === "failure")
                      .map((element) => (
                        <div
                          key={element.id}
                          className="p-3 border rounded-md border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{element.description}</h4>
                              <p className="text-sm text-muted-foreground">Location: {element.location}</p>
                              <p className="text-sm text-red-500">Error: {element.errorDetails}</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // Find the index of this element
                                const index = elements.findIndex((e) => e.id === element.id)
                                if (index !== -1) {
                                  testElement(index)
                                }
                              }}
                            >
                              Retest
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            onClick={() => {
              // Export results as JSON
              const results = {
                timestamp: new Date().toISOString(),
                stats,
                elements: elements.map((e) => ({
                  id: e.id,
                  description: e.description,
                  location: e.location,
                  category: e.category,
                  status: e.status,
                  errorDetails: e.errorDetails,
                })),
              }

              const blob = new Blob([JSON.stringify(results, null, 2)], { type: "application/json" })
              const url = URL.createObjectURL(blob)
              const a = document.createElement("a")
              a.href = url
              a.download = `interaction-test-results-${new Date().toISOString().split("T")[0]}.json`
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
              URL.revokeObjectURL(url)
            }}
          >
            Export Results
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
