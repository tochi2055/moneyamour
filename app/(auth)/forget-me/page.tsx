"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, ArrowRight, CheckCircle, Trash2, UserX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useFirebaseAuth } from "@/contexts/firebase-auth-context"
import { useToast } from "@/components/ui/use-toast"
import { doc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/firebase"

export default function ForgetMePage() {
  const router = useRouter()
  const { user, reauthenticate, deleteAccount } = useFirebaseAuth()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmText, setConfirmText] = useState("")
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [confirmChecks, setConfirmChecks] = useState({
    understand: false,
    permanent: false,
    confirm: false,
  })
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  })

  // Pre-fill email if user is logged in
  React.useEffect(() => {
    if (user?.email) {
      setEmail(user.email)
    }
  }, [user])

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setErrors({ ...errors, email: "Email is required" })
      return
    }

    if (user && user.email !== email) {
      setErrors({ ...errors, email: "Email does not match your account" })
      return
    }

    setErrors({ ...errors, email: "" })
    setStep(2)
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!password) {
      setErrors({ ...errors, password: "Password is required" })
      return
    }

    setIsLoading(true)

    try {
      // Verify password by reauthenticating
      const success = await reauthenticate(password)

      if (!success) {
        setErrors({ ...errors, password: "Incorrect password" })
        return
      }

      setErrors({ ...errors, password: "" })
      setStep(3)
    } catch (error) {
      console.error("Reauthentication failed:", error)
      setErrors({ ...errors, password: "Authentication failed" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFinalConfirmation = async (e: React.FormEvent) => {
    e.preventDefault()

    if (confirmText !== "DELETE MY ACCOUNT") {
      return
    }

    if (!confirmChecks.understand || !confirmChecks.permanent || !confirmChecks.confirm) {
      return
    }

    setIsLoading(true)

    try {
      if (!user) {
        throw new Error("No user logged in")
      }

      // Delete user data from Firestore
      const userId = user.uid

      // Delete user collections
      const collections = ["transactions", "accounts", "budgets", "settings"]

      for (const collection of collections) {
        try {
          await deleteDoc(doc(db, "users", userId, collection))
        } catch (error) {
          console.error(`Error deleting ${collection}:`, error)
        }
      }

      // Delete user document
      await deleteDoc(doc(db, "users", userId))

      // Delete Firebase Auth account
      await deleteAccount()

      setSuccess(true)

      // Redirect to home after 3 seconds
      setTimeout(() => {
        router.push("/")
      }, 3000)
    } catch (error) {
      console.error("Error deleting account:", error)
      setErrors({
        ...errors,
        general: "Failed to delete account. Please try again or contact support.",
      })

      toast({
        title: "Account Deletion Failed",
        description: "There was an error deleting your account. Please try again or contact support.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-12">
        <Card>
          <CardHeader className="text-center">
            <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
            <CardTitle className="text-2xl">Account Deletion Requested</CardTitle>
            <CardDescription>Your request has been submitted successfully</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">
              We've received your request to delete your account and all associated data. This process may take up to 30
              days to complete.
            </p>
            <p>You will receive a confirmation email once the process is complete.</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">Redirecting to homepage...</p>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <Card className="border-destructive/20">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <UserX className="h-6 w-6 text-destructive" />
            <CardTitle className="text-2xl">Forget Me Request</CardTitle>
          </div>
          <CardDescription>Request to delete your account and personal data</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              This action is irreversible. All your data, including account information, transaction history, and
              preferences will be permanently deleted.
            </AlertDescription>
          </Alert>

          {errors.general && (
            <div className="p-3 mb-4 text-sm bg-destructive/10 border border-destructive/20 text-destructive rounded-md">
              {errors.general}
            </div>
          )}

          <Tabs value={`step-${step}`} className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="step-1" disabled={step !== 1}>
                1. Verify Email
              </TabsTrigger>
              <TabsTrigger value="step-2" disabled={step !== 2}>
                2. Confirm Identity
              </TabsTrigger>
              <TabsTrigger value="step-3" disabled={step !== 3}>
                3. Final Confirmation
              </TabsTrigger>
            </TabsList>

            <TabsContent value="step-1">
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your account email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={errors.email ? "border-destructive" : ""}
                    disabled={user?.email ? true : false}
                  />
                  {errors.email ? (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Please enter the email address associated with your account
                    </p>
                  )}
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" disabled={!email}>
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="step-2">
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={errors.password ? "border-destructive" : ""}
                  />
                  {errors.password ? (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Please enter your password to verify your identity</p>
                  )}
                </div>

                <div className="pt-4 flex justify-between">
                  <Button variant="outline" type="button" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="submit" disabled={!password || isLoading}>
                    {isLoading ? "Verifying..." : "Next"} {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="step-3">
              <form onSubmit={handleFinalConfirmation} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">What will be deleted:</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Your account profile and personal information</li>
                    <li>All transaction history and financial records</li>
                    <li>Saved payment methods and billing information</li>
                    <li>Custom settings, preferences, and saved templates</li>
                    <li>All messages and communication history</li>
                  </ul>

                  <Separator className="my-4" />

                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="understand"
                        checked={confirmChecks.understand}
                        onCheckedChange={(checked) =>
                          setConfirmChecks({ ...confirmChecks, understand: checked as boolean })
                        }
                      />
                      <Label htmlFor="understand" className="font-normal">
                        I understand that all my data will be permanently deleted
                      </Label>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="permanent"
                        checked={confirmChecks.permanent}
                        onCheckedChange={(checked) =>
                          setConfirmChecks({ ...confirmChecks, permanent: checked as boolean })
                        }
                      />
                      <Label htmlFor="permanent" className="font-normal">
                        I understand this action cannot be undone
                      </Label>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="confirm"
                        checked={confirmChecks.confirm}
                        onCheckedChange={(checked) =>
                          setConfirmChecks({ ...confirmChecks, confirm: checked as boolean })
                        }
                      />
                      <Label htmlFor="confirm" className="font-normal">
                        I confirm I want to delete my account and all associated data
                      </Label>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <Label htmlFor="confirm-text">Type "DELETE MY ACCOUNT" to confirm</Label>
                    <Input
                      id="confirm-text"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      className="border-destructive/50"
                      required
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <Button variant="outline" type="button" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button
                    variant="destructive"
                    type="submit"
                    disabled={
                      isLoading ||
                      confirmText !== "DELETE MY ACCOUNT" ||
                      !confirmChecks.understand ||
                      !confirmChecks.permanent ||
                      !confirmChecks.confirm
                    }
                    className="gap-2"
                  >
                    {isLoading ? (
                      "Processing..."
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        Delete My Account
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          <p className="text-sm text-muted-foreground">
            If you're experiencing issues with our service, please consider{" "}
            <a href="/help" className="text-primary hover:underline">
              contacting support
            </a>{" "}
            before deleting your account.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
