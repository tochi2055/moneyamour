"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export function OrganizationSettings() {
  const [orgSettings, setOrgSettings] = useState({
    name: "MoneyAmour Financial Inc.",
    legalName: "MoneyAmour Financial Inc.",
    taxId: "XX-XXXXXXX",
    website: "www.moneyamour.com",
    email: "contact@moneyamour.com",
    phone: "+1 (555) 123-4567",
    description: "A modern financial management platform helping individuals and businesses achieve financial freedom.",
    address: {
      street: "123 Finance Street, Suite 500",
      city: "San Francisco",
      state: "California",
      postalCode: "94105",
      country: "United States",
    },
    billing: {
      plan: "enterprise",
      billingCycle: "monthly",
      autoRenew: true,
      paymentMethod: "credit_card",
      cardNumber: "**** **** **** 4242",
      cardExpiry: "12/24",
    },
    notifications: {
      emailUpdates: true,
      securityAlerts: true,
      marketingEmails: false,
      billingNotifications: true,
    },
    branding: {
      primaryColor: "#0ea5e9",
      logo: "/logo.png",
      favicon: "/favicon.ico",
    },
  })

  const handleInputChange = (section, field, value) => {
    if (section) {
      setOrgSettings({
        ...orgSettings,
        [section]: {
          ...orgSettings[section],
          [field]: value,
        },
      })
    } else {
      setOrgSettings({
        ...orgSettings,
        [field]: value,
      })
    }
  }

  const handleSaveGeneral = () => {
    toast.success("General settings saved successfully")
  }

  const handleSaveBilling = () => {
    toast.success("Billing settings saved successfully")
  }

  const handleSaveNotifications = () => {
    toast.success("Notification preferences saved successfully")
  }

  const handleSaveBranding = () => {
    toast.success("Branding settings saved successfully")
  }

  return (
    <Tabs defaultValue="general" className="space-y-4">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="branding">Branding</TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>General Information</CardTitle>
            <CardDescription>Update your organization's basic information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Organization Name</Label>
                <Input
                  id="name"
                  value={orgSettings.name}
                  onChange={(e) => handleInputChange(null, "name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="legalName">Legal Name</Label>
                <Input
                  id="legalName"
                  value={orgSettings.legalName}
                  onChange={(e) => handleInputChange(null, "legalName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID</Label>
                <Input
                  id="taxId"
                  value={orgSettings.taxId}
                  onChange={(e) => handleInputChange(null, "taxId", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={orgSettings.website}
                  onChange={(e) => handleInputChange(null, "website", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={orgSettings.email}
                  onChange={(e) => handleInputChange(null, "email", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={orgSettings.phone}
                  onChange={(e) => handleInputChange(null, "phone", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={orgSettings.description}
                onChange={(e) => handleInputChange(null, "description", e.target.value)}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Address Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    value={orgSettings.address.street}
                    onChange={(e) => handleInputChange("address", "street", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={orgSettings.address.city}
                    onChange={(e) => handleInputChange("address", "city", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    value={orgSettings.address.state}
                    onChange={(e) => handleInputChange("address", "state", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={orgSettings.address.postalCode}
                    onChange={(e) => handleInputChange("address", "postalCode", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={orgSettings.address.country}
                    onChange={(e) => handleInputChange("address", "country", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveGeneral}>Save Changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="billing">
        <Card>
          <CardHeader>
            <CardTitle>Billing Settings</CardTitle>
            <CardDescription>Manage your subscription and payment methods.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="plan">Subscription Plan</Label>
              <Select
                value={orgSettings.billing.plan}
                onValueChange={(value) => handleInputChange("billing", "plan", value)}
              >
                <SelectTrigger id="plan">
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="starter">Starter ($99/month)</SelectItem>
                  <SelectItem value="professional">Professional ($299/month)</SelectItem>
                  <SelectItem value="enterprise">Enterprise ($499/month)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="billingCycle">Billing Cycle</Label>
              <Select
                value={orgSettings.billing.billingCycle}
                onValueChange={(value) => handleInputChange("billing", "billingCycle", value)}
              >
                <SelectTrigger id="billingCycle">
                  <SelectValue placeholder="Select billing cycle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly (10% discount)</SelectItem>
                  <SelectItem value="annually">Annually (20% discount)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="autoRenew"
                checked={orgSettings.billing.autoRenew}
                onCheckedChange={(checked) => handleInputChange("billing", "autoRenew", checked)}
              />
              <Label htmlFor="autoRenew">Auto-renew subscription</Label>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Payment Method</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select
                    value={orgSettings.billing.paymentMethod}
                    onValueChange={(value) => handleInputChange("billing", "paymentMethod", value)}
                  >
                    <SelectTrigger id="paymentMethod">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input id="cardNumber" value={orgSettings.billing.cardNumber} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardExpiry">Expiration Date</Label>
                  <Input id="cardExpiry" value={orgSettings.billing.cardExpiry} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="updateCard">&nbsp;</Label>
                  <Button variant="outline" className="w-full" id="updateCard">
                    Update Payment Method
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveBilling}>Save Changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Manage how your organization receives notifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="emailUpdates"
                  checked={orgSettings.notifications.emailUpdates}
                  onCheckedChange={(checked) => handleInputChange("notifications", "emailUpdates", checked)}
                />
                <div>
                  <Label htmlFor="emailUpdates">Email Updates</Label>
                  <p className="text-sm text-muted-foreground">Receive updates about new features and improvements.</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="securityAlerts"
                  checked={orgSettings.notifications.securityAlerts}
                  onCheckedChange={(checked) => handleInputChange("notifications", "securityAlerts", checked)}
                />
                <div>
                  <Label htmlFor="securityAlerts">Security Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts about security issues and suspicious activities.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="marketingEmails"
                  checked={orgSettings.notifications.marketingEmails}
                  onCheckedChange={(checked) => handleInputChange("notifications", "marketingEmails", checked)}
                />
                <div>
                  <Label htmlFor="marketingEmails">Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive promotional offers and marketing communications.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="billingNotifications"
                  checked={orgSettings.notifications.billingNotifications}
                  onCheckedChange={(checked) => handleInputChange("notifications", "billingNotifications", checked)}
                />
                <div>
                  <Label htmlFor="billingNotifications">Billing Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications about billing and subscription changes.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveNotifications}>Save Changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="branding">
        <Card>
          <CardHeader>
            <CardTitle>Branding Settings</CardTitle>
            <CardDescription>Customize your organization's branding.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Primary Color</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={orgSettings.branding.primaryColor}
                  onChange={(e) => handleInputChange("branding", "primaryColor", e.target.value)}
                  className="w-12 h-12 p-1"
                />
                <Input
                  value={orgSettings.branding.primaryColor}
                  onChange={(e) => handleInputChange("branding", "primaryColor", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo">Logo</Label>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 border rounded flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                  <img
                    src={orgSettings.branding.logo || "/placeholder.svg"}
                    alt="Logo"
                    className="max-w-full max-h-full"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/64?text=Logo"
                    }}
                  />
                </div>
                <Button variant="outline">Upload New Logo</Button>
              </div>
              <p className="text-sm text-muted-foreground">Recommended size: 512x512px. Max file size: 2MB.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="favicon">Favicon</Label>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 border rounded flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                  <img
                    src={orgSettings.branding.favicon || "/placeholder.svg"}
                    alt="Favicon"
                    className="max-w-full max-h-full"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/32?text=F"
                    }}
                  />
                </div>
                <Button variant="outline">Upload New Favicon</Button>
              </div>
              <p className="text-sm text-muted-foreground">Recommended size: 32x32px. Max file size: 1MB.</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveBranding}>Save Changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
