import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrganizationOverview } from "@/components/organization/organization-overview"
import { OrganizationMembers } from "@/components/organization/organization-members"
import { OrganizationSettings } from "@/components/organization/organization-settings"

export default function OrganizationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Organization</h1>
        <p className="text-muted-foreground">Manage your organization details, members, and settings.</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <OrganizationOverview />
        </TabsContent>
        <TabsContent value="members" className="space-y-4">
          <OrganizationMembers />
        </TabsContent>
        <TabsContent value="settings" className="space-y-4">
          <OrganizationSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
