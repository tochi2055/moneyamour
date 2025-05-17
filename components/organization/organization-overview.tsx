import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users2, CreditCard, Calendar } from "lucide-react"

export function OrganizationOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Organization Type</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Corporation</div>
          <p className="text-xs text-muted-foreground">Registered in Delaware</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Members</CardTitle>
          <Users2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">24</div>
          <p className="text-xs text-muted-foreground">+3 from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Subscription</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Enterprise</div>
          <p className="text-xs text-muted-foreground">$499/month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Renewal Date</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Jan 1, 2024</div>
          <p className="text-xs text-muted-foreground">Auto-renewal enabled</p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Organization Details</CardTitle>
          <CardDescription>Basic information about your organization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Legal Name</p>
              <p className="text-sm text-muted-foreground">MoneyAmour Financial Inc.</p>
            </div>
            <div>
              <p className="text-sm font-medium">Tax ID</p>
              <p className="text-sm text-muted-foreground">XX-XXXXXXX</p>
            </div>
            <div>
              <p className="text-sm font-medium">Industry</p>
              <p className="text-sm text-muted-foreground">Financial Services</p>
            </div>
            <div>
              <p className="text-sm font-medium">Founded</p>
              <p className="text-sm text-muted-foreground">2020</p>
            </div>
            <div>
              <p className="text-sm font-medium">Website</p>
              <p className="text-sm text-muted-foreground">www.moneyamour.com</p>
            </div>
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">contact@moneyamour.com</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Address Information</CardTitle>
          <CardDescription>Primary business address</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Street Address</p>
              <p className="text-sm text-muted-foreground">123 Finance Street, Suite 500</p>
            </div>
            <div>
              <p className="text-sm font-medium">City</p>
              <p className="text-sm text-muted-foreground">San Francisco</p>
            </div>
            <div>
              <p className="text-sm font-medium">State/Province</p>
              <p className="text-sm text-muted-foreground">California</p>
            </div>
            <div>
              <p className="text-sm font-medium">Postal Code</p>
              <p className="text-sm text-muted-foreground">94105</p>
            </div>
            <div>
              <p className="text-sm font-medium">Country</p>
              <p className="text-sm text-muted-foreground">United States</p>
            </div>
            <div>
              <p className="text-sm font-medium">Phone</p>
              <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
