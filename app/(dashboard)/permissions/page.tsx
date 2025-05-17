"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Save, UserCog, ShieldCheck, Users, Lock, KeyRound, Settings, FileText } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function PermissionsPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [showAddRole, setShowAddRole] = React.useState(false)
  const [selectedRole, setSelectedRole] = React.useState<string | null>(null)

  const roles = [
    {
      id: "admin",
      name: "Administrator",
      description: "Full access to all resources",
      users: 3,
      permissions: {
        dashboard: ["view", "edit", "create", "delete"],
        transactions: ["view", "edit", "create", "delete"],
        reports: ["view", "edit", "create", "delete"],
        users: ["view", "edit", "create", "delete"],
        settings: ["view", "edit"],
      },
    },
    {
      id: "manager",
      name: "Manager",
      description: "Can manage most resources with some restrictions",
      users: 7,
      permissions: {
        dashboard: ["view", "edit", "create"],
        transactions: ["view", "edit", "create"],
        reports: ["view", "edit", "create"],
        users: ["view"],
        settings: ["view"],
      },
    },
    {
      id: "analyst",
      name: "Financial Analyst",
      description: "Can view and analyze financial data",
      users: 12,
      permissions: {
        dashboard: ["view"],
        transactions: ["view"],
        reports: ["view", "create"],
        users: [],
        settings: [],
      },
    },
    {
      id: "customer",
      name: "Customer",
      description: "Limited access to personal resources only",
      users: 156,
      permissions: {
        dashboard: ["view"],
        transactions: ["view"],
        reports: [],
        users: [],
        settings: [],
      },
    },
    {
      id: "guest",
      name: "Guest",
      description: "Minimal view-only access",
      users: 42,
      permissions: {
        dashboard: ["view"],
        transactions: [],
        reports: [],
        users: [],
        settings: [],
      },
    },
  ]

  const permissionModules = [
    { id: "dashboard", name: "Dashboard", icon: <ShieldCheck className="h-5 w-5" /> },
    { id: "transactions", name: "Transactions", icon: <FileText className="h-5 w-5" /> },
    { id: "reports", name: "Reports", icon: <FileText className="h-5 w-5" /> },
    { id: "users", name: "Users", icon: <Users className="h-5 w-5" /> },
    { id: "settings", name: "Settings", icon: <Settings className="h-5 w-5" /> },
  ]

  const permissionActions = [
    { id: "view", name: "View", description: "Can view resources" },
    { id: "create", name: "Create", description: "Can create new resources" },
    { id: "edit", name: "Edit", description: "Can modify existing resources" },
    { id: "delete", name: "Delete", description: "Can delete resources" },
  ]

  const users = [
    {
      id: "user1",
      name: "John Smith",
      email: "john.smith@example.com",
      role: "admin",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "user2",
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      role: "manager",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "user3",
      name: "Michael Brown",
      email: "michael.brown@example.com",
      role: "analyst",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "user4",
      name: "Emily Davis",
      email: "emily.davis@example.com",
      role: "customer",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "user5",
      name: "David Wilson",
      email: "david.wilson@example.com",
      role: "guest",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const selectedRoleData = selectedRole ? roles.find((role) => role.id === selectedRole) : null

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Permissions</h1>
          <p className="text-gray-500 mt-1">Manage user roles and access controls</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <UserCog className="mr-2 h-4 w-4" />
            Assign Roles
          </Button>
          <Button onClick={() => setShowAddRole(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Role
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="mr-2 h-5 w-5" />
              Roles
            </CardTitle>
            <CardDescription>Select a role to manage its permissions</CardDescription>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search roles..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {filteredRoles.map((role) => (
              <div
                key={role.id}
                className={`p-3 rounded-md cursor-pointer transition-colors ${
                  selectedRole === role.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                onClick={() => setSelectedRole(role.id)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{role.name}</h3>
                  <Badge variant="outline">{role.users} users</Badge>
                </div>
                <p className={`text-sm ${selectedRole === role.id ? "text-primary-foreground/80" : "text-gray-500"}`}>
                  {role.description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{selectedRoleData ? `${selectedRoleData.name} Permissions` : "Select a Role"}</CardTitle>
            <CardDescription>
              {selectedRoleData
                ? `Configure access permissions for the ${selectedRoleData.name} role`
                : "Choose a role from the left panel to configure its permissions"}
            </CardDescription>
          </CardHeader>
          {selectedRoleData ? (
            <>
              <CardContent>
                <Tabs defaultValue="permissions">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="permissions">Permissions</TabsTrigger>
                    <TabsTrigger value="members">Members</TabsTrigger>
                  </TabsList>

                  <TabsContent value="permissions" className="space-y-6 pt-4">
                    <Accordion type="multiple" defaultValue={permissionModules.map((m) => m.id)}>
                      {permissionModules.map((module) => (
                        <AccordionItem key={module.id} value={module.id}>
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center">
                              {module.icon}
                              <span className="ml-2">{module.name}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4 pt-2">
                              {permissionActions.map((action) => {
                                const hasPermission = selectedRoleData.permissions[module.id]?.includes(action.id)

                                return (
                                  <div key={`${module.id}-${action.id}`} className="flex items-center justify-between">
                                    <div>
                                      <p className="font-medium">{action.name}</p>
                                      <p className="text-sm text-gray-500">{action.description}</p>
                                    </div>
                                    <Switch checked={hasPermission} />
                                  </div>
                                )
                              })}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </TabsContent>

                  <TabsContent value="members" className="pt-4">
                    <div className="space-y-4">
                      {users
                        .filter((user) => user.role === selectedRole)
                        .map((user) => (
                          <div key={user.id} className="flex items-center justify-between p-3 border rounded-md">
                            <div className="flex items-center">
                              <Avatar className="h-10 w-10 mr-4">
                                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-medium">{user.name}</h3>
                                <p className="text-sm text-gray-500">{user.email}</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              Remove
                            </Button>
                          </div>
                        ))}

                      <Button variant="outline" className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Add User to Role
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </>
          ) : (
            <CardContent className="flex flex-col items-center justify-center py-12">
              <KeyRound className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 text-center">
                Select a role from the left panel to view and edit its permissions
              </p>
            </CardContent>
          )}
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Permission Audit Log</CardTitle>
          <CardDescription>Recent changes to roles and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mr-4">
                    <UserCog className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {i === 1
                        ? "Added delete permission to Manager role"
                        : i === 2
                          ? "Created new Guest role"
                          : i === 3
                            ? "Removed user Emily Davis from Admin role"
                            : i === 4
                              ? "Updated Analyst permissions"
                              : "Assigned John Smith to Admin role"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(Date.now() - i * 86400000).toLocaleDateString()} at{" "}
                      {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {i === 1
                      ? "Admin User"
                      : i === 2
                        ? "System"
                        : i === 3
                          ? "Sarah Johnson"
                          : i === 4
                            ? "Admin User"
                            : "System"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="outline">View Full Audit Log</Button>
        </CardFooter>
      </Card>

      <Dialog open={showAddRole} onOpenChange={setShowAddRole}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
            <DialogDescription>Define a new role and its permissions.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="role-name">Role Name</Label>
              <Input id="role-name" placeholder="e.g., Support Agent" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role-description">Description</Label>
              <Input id="role-description" placeholder="Brief description of this role" />
            </div>
            <div className="grid gap-2">
              <Label>Base Permissions On</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select an existing role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="analyst">Financial Analyst</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="guest">Guest</SelectItem>
                  <SelectItem value="none">None (Start from scratch)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2 pt-2">
              <Label>Initial Module Access</Label>
              <div className="space-y-2">
                {permissionModules.map((module) => (
                  <div key={module.id} className="flex items-center space-x-2">
                    <Checkbox id={`module-${module.id}`} />
                    <Label htmlFor={`module-${module.id}`} className="flex items-center">
                      {module.icon}
                      <span className="ml-2">{module.name}</span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddRole(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={() => setShowAddRole(false)}>
              Create Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
