"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { type InteractionFix, commonFixes, applyFix, generateFix } from "@/utils/interaction-fixer"
import { Wrench, Plus, Check, Code, Save, Trash2, RefreshCw } from "lucide-react"

export function InteractionFixer() {
  const [fixes, setFixes] = useState<InteractionFix[]>(commonFixes)
  const [selectedFix, setSelectedFix] = useState<InteractionFix | null>(null)
  const [newFixSelector, setNewFixSelector] = useState("")
  const [activeTab, setActiveTab] = useState("available")

  // Apply a fix
  const handleApplyFix = (fix: InteractionFix) => {
    const success = applyFix(fix)

    if (success) {
      // Update the fix status
      setFixes(fixes.map((f) => (f.id === fix.id ? { ...f, applied: true } : f)))
    }
  }

  // Generate a new fix
  const handleGenerateFix = () => {
    if (!newFixSelector) return

    const newFix = generateFix(newFixSelector)
    setFixes([...fixes, newFix])
    setNewFixSelector("")
    setActiveTab("available")
  }

  // Remove a fix
  const handleRemoveFix = (fixId: string) => {
    setFixes(fixes.filter((f) => f.id !== fixId))
    if (selectedFix?.id === fixId) {
      setSelectedFix(null)
    }
  }

  // Edit a fix
  const handleEditFix = (updatedFix: InteractionFix) => {
    setFixes(fixes.map((f) => (f.id === updatedFix.id ? updatedFix : f)))
    setSelectedFix(updatedFix)
  }

  // Filter fixes based on active tab
  const filteredFixes = fixes.filter((fix) => {
    if (activeTab === "available") return !fix.applied
    if (activeTab === "applied") return fix.applied
    return true // 'all' tab
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wrench className="h-5 w-5 mr-2" />
            Interaction Fixer
          </CardTitle>
          <CardDescription>Fix unclickable elements and other interaction issues</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="element-selector">Element Selector</Label>
                <div className="flex mt-1">
                  <Input
                    id="element-selector"
                    placeholder=".class-name or #element-id"
                    value={newFixSelector}
                    onChange={(e) => setNewFixSelector(e.target.value)}
                    className="rounded-r-none"
                  />
                  <Button onClick={handleGenerateFix} className="rounded-l-none" disabled={!newFixSelector}>
                    <Plus className="h-4 w-4 mr-2" />
                    Generate Fix
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Enter a CSS selector for the unclickable element</p>
              </div>
            </div>

            <Tabs defaultValue="available" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="available">Available Fixes</TabsTrigger>
                <TabsTrigger value="applied">Applied Fixes</TabsTrigger>
                <TabsTrigger value="all">All Fixes</TabsTrigger>
              </TabsList>

              <TabsContent value="available" className="mt-4">
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {filteredFixes.length > 0 ? (
                      filteredFixes.map((fix) => (
                        <div
                          key={fix.id}
                          className={`p-3 border rounded-md ${
                            selectedFix?.id === fix.id ? "border-primary bg-primary/5" : "border-border"
                          }`}
                          onClick={() => setSelectedFix(fix)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center">
                                <h3 className="font-medium">{fix.elementSelector}</h3>
                                <Badge variant="outline" className="ml-2">
                                  {fix.fixType}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">Issue: {fix.issue}</p>
                              <p className="text-sm text-muted-foreground">Fix: {fix.fixDescription}</p>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleApplyFix(fix)
                                }}
                              >
                                Apply Fix
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleRemoveFix(fix.id)
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-muted-foreground">No available fixes</div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="applied" className="mt-4">
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {filteredFixes.length > 0 ? (
                      filteredFixes.map((fix) => (
                        <div
                          key={fix.id}
                          className={`p-3 border rounded-md ${
                            selectedFix?.id === fix.id ? "border-primary bg-primary/5" : "border-border"
                          } bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800`}
                          onClick={() => setSelectedFix(fix)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center">
                                <h3 className="font-medium">{fix.elementSelector}</h3>
                                <Badge variant="outline" className="ml-2">
                                  {fix.fixType}
                                </Badge>
                                <Badge className="ml-2 bg-green-500">Applied</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">Issue: {fix.issue}</p>
                              <p className="text-sm text-muted-foreground">Fix: {fix.fixDescription}</p>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  // Reapply the fix
                                  handleApplyFix(fix)
                                }}
                              >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Reapply
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleRemoveFix(fix.id)
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-muted-foreground">No applied fixes</div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="all" className="mt-4">
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {fixes.length > 0 ? (
                      fixes.map((fix) => (
                        <div
                          key={fix.id}
                          className={`p-3 border rounded-md ${
                            selectedFix?.id === fix.id ? "border-primary bg-primary/5" : "border-border"
                          } ${
                            fix.applied ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800" : ""
                          }`}
                          onClick={() => setSelectedFix(fix)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center">
                                <h3 className="font-medium">{fix.elementSelector}</h3>
                                <Badge variant="outline" className="ml-2">
                                  {fix.fixType}
                                </Badge>
                                {fix.applied && <Badge className="ml-2 bg-green-500">Applied</Badge>}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">Issue: {fix.issue}</p>
                              <p className="text-sm text-muted-foreground">Fix: {fix.fixDescription}</p>
                            </div>
                            <div className="flex space-x-2">
                              {fix.applied ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    // Reapply the fix
                                    handleApplyFix(fix)
                                  }}
                                >
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  Reapply
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleApplyFix(fix)
                                  }}
                                >
                                  Apply Fix
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleRemoveFix(fix.id)
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-muted-foreground">No fixes available</div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {selectedFix && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Code className="h-5 w-5 mr-2" />
              Edit Fix
            </CardTitle>
            <CardDescription>Modify the fix for {selectedFix.elementSelector}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="fix-selector">Element Selector</Label>
                <Input
                  id="fix-selector"
                  value={selectedFix.elementSelector}
                  onChange={(e) => handleEditFix({ ...selectedFix, elementSelector: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="fix-issue">Issue</Label>
                <Input
                  id="fix-issue"
                  value={selectedFix.issue}
                  onChange={(e) => handleEditFix({ ...selectedFix, issue: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="fix-type">Fix Type</Label>
                <select
                  id="fix-type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedFix.fixType}
                  onChange={(e) =>
                    handleEditFix({
                      ...selectedFix,
                      fixType: e.target.value as InteractionFix["fixType"],
                    })
                  }
                >
                  <option value="pointer-events">Pointer Events</option>
                  <option value="z-index">Z-Index</option>
                  <option value="visibility">Visibility</option>
                  <option value="position">Position</option>
                  <option value="dimensions">Dimensions</option>
                  <option value="event-handler">Event Handler</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <Label htmlFor="fix-description">Fix Description</Label>
                <Input
                  id="fix-description"
                  value={selectedFix.fixDescription}
                  onChange={(e) => handleEditFix({ ...selectedFix, fixDescription: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="fix-code">Fix Code</Label>
                <Textarea
                  id="fix-code"
                  value={selectedFix.fixCode}
                  onChange={(e) => handleEditFix({ ...selectedFix, fixCode: e.target.value })}
                  className="font-mono"
                  rows={5}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  JavaScript code that will be executed to fix the issue
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setSelectedFix(null)}>
              Cancel
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => handleApplyFix(selectedFix)}>
                <Check className="h-4 w-4 mr-2" />
                Apply Fix
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  // Save changes
                  handleEditFix(selectedFix)
                  setSelectedFix(null)
                }}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
