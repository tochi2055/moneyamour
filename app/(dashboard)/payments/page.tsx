"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, Wallet, Building, ArrowRight, CheckCircle2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function PaymentsPage() {
  const [showConfirmation, setShowConfirmation] = React.useState(false)
  const [paymentMethod, setPaymentMethod] = React.useState("card")
  const [amount, setAmount] = React.useState("")
  const [processing, setProcessing] = React.useState(false)

  const handlePayment = () => {
    setProcessing(true)
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false)
      setShowConfirmation(true)
    }, 2000)
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <Button variant="outline">Payment History</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Make a Payment</CardTitle>
            <CardDescription>Choose your preferred payment method and enter details</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="send" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="send">Send Money</TabsTrigger>
                <TabsTrigger value="request">Request Money</TabsTrigger>
                <TabsTrigger value="bill">Pay Bills</TabsTrigger>
              </TabsList>

              <TabsContent value="send" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      id="amount"
                      placeholder="0.00"
                      className="pl-8"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient</Label>
                  <Select defaultValue="contact1">
                    <SelectTrigger id="recipient">
                      <SelectValue placeholder="Select recipient" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contact1">John Smith</SelectItem>
                      <SelectItem value="contact2">Sarah Johnson</SelectItem>
                      <SelectItem value="contact3">Michael Brown</SelectItem>
                      <SelectItem value="new">Add New Recipient</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <RadioGroup defaultValue="card" onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center cursor-pointer">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Credit/Debit Card
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                      <RadioGroupItem value="bank" id="bank" />
                      <Label htmlFor="bank" className="flex items-center cursor-pointer">
                        <Building className="mr-2 h-4 w-4" />
                        Bank Transfer
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                      <RadioGroupItem value="wallet" id="wallet" />
                      <Label htmlFor="wallet" className="flex items-center cursor-pointer">
                        <Wallet className="mr-2 h-4 w-4" />
                        Digital Wallet
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "bank" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="accountName">Account Name</Label>
                      <Input id="accountName" placeholder="John Smith" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input id="accountNumber" placeholder="123456789" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="routingNumber">Routing Number</Label>
                      <Input id="routingNumber" placeholder="987654321" />
                    </div>
                  </div>
                )}

                {paymentMethod === "wallet" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="walletType">Wallet Provider</Label>
                      <Select defaultValue="paypal">
                        <SelectTrigger id="walletType">
                          <SelectValue placeholder="Select wallet" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="paypal">PayPal</SelectItem>
                          <SelectItem value="venmo">Venmo</SelectItem>
                          <SelectItem value="cashapp">Cash App</SelectItem>
                          <SelectItem value="applepay">Apple Pay</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="walletEmail">Email/Phone</Label>
                      <Input id="walletEmail" placeholder="email@example.com" />
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="request" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="requestAmount">Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input id="requestAmount" placeholder="0.00" className="pl-8" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requestFrom">Request From</Label>
                  <Select defaultValue="contact1">
                    <SelectTrigger id="requestFrom">
                      <SelectValue placeholder="Select contact" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contact1">John Smith</SelectItem>
                      <SelectItem value="contact2">Sarah Johnson</SelectItem>
                      <SelectItem value="contact3">Michael Brown</SelectItem>
                      <SelectItem value="new">Add New Contact</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requestNote">Note (Optional)</Label>
                  <Input id="requestNote" placeholder="What's this for?" />
                </div>
              </TabsContent>

              <TabsContent value="bill" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="billType">Bill Type</Label>
                  <Select defaultValue="utility">
                    <SelectTrigger id="billType">
                      <SelectValue placeholder="Select bill type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utility">Utility</SelectItem>
                      <SelectItem value="rent">Rent/Mortgage</SelectItem>
                      <SelectItem value="subscription">Subscription</SelectItem>
                      <SelectItem value="insurance">Insurance</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billProvider">Provider</Label>
                  <Input id="billProvider" placeholder="Company name" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input id="accountNumber" placeholder="Your account number" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billAmount">Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input id="billAmount" placeholder="0.00" className="pl-8" />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handlePayment} disabled={processing}>
              {processing ? "Processing..." : "Continue to Payment"}
              {!processing && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </CardFooter>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Manage your saved payment methods</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between border rounded-md p-4">
              <div className="flex items-center">
                <CreditCard className="mr-3 h-5 w-5" />
                <div>
                  <p className="font-medium">Visa ending in 4242</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Expires 12/25</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                <Button variant="ghost" size="sm">
                  Remove
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between border rounded-md p-4">
              <div className="flex items-center">
                <Building className="mr-3 h-5 w-5" />
                <div>
                  <p className="font-medium">Chase Bank Account</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Checking ****6789</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                <Button variant="ghost" size="sm">
                  Remove
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between border rounded-md p-4">
              <div className="flex items-center">
                <Wallet className="mr-3 h-5 w-5" />
                <div>
                  <p className="font-medium">PayPal</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">user@example.com</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                <Button variant="ghost" size="sm">
                  Remove
                </Button>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              Add New Payment Method
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
          <CardDescription>View your recent payment activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      i % 2 === 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    } dark:bg-opacity-20`}
                  >
                    {i % 2 === 0 ? "+" : "-"}
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">{i % 2 === 0 ? "Received from Sarah Johnson" : "Paid to Amazon"}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(Date.now() - i * 86400000).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${i % 2 === 0 ? "text-green-600" : "text-red-600"}`}>
                    {i % 2 === 0 ? "+" : "-"}${(Math.random() * 100 + 20).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {i % 2 === 0 ? "Direct Deposit" : "Credit Card"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="outline">View All Transactions</Button>
        </CardFooter>
      </Card>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <CheckCircle2 className="h-6 w-6 text-green-500 mr-2" />
              Payment Successful
            </DialogTitle>
            <DialogDescription>Your payment has been processed successfully.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-800">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Amount:</span>
                <span className="font-medium">${amount || "0.00"}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Recipient:</span>
                <span className="font-medium">John Smith</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Date:</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Transaction ID:</span>
                <span className="font-medium">TXN-{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between">
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Close
            </Button>
            <Button variant="outline">Download Receipt</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
