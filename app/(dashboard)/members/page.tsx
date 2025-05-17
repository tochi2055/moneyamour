"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, UserPlus, Mail, Phone, MoreHorizontal, Star, StarOff } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function MembersPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedTab, setSelectedTab] = React.useState("all")
  const [showAddMember, setShowAddMember] = React.useState(false)
  const [favorites, setFavorites] = React.useState<string[]>(["member1", "member4"])

  const members = [
    {
      id: "member1",
      name: "Alex Johnson",
      role: "Financial Advisor",
      email: "alex.johnson@example.com",
      phone: "+1 (555) 123-4567",
      status: "active",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Wealth Management",
      joinDate: "Jan 15, 2022",
    },
    {
      id: "member2",
      name: "Samantha Lee",
      role: "Investment Analyst",
      email: "samantha.lee@example.com",
      phone: "+1 (555) 234-5678",
      status: "active",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Investment",
      joinDate: "Mar 3, 2022",
    },
    {
      id: "member3",
      name: "David Chen",
      role: "Account Manager",
      email: "david.chen@example.com",
      phone: "+1 (555) 345-6789",
      status: "away",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Customer Service",
      joinDate: "Jun 12, 2022",
    },
    {
      id: "member4",
      name: "Maria Rodriguez",
      role: "Tax Specialist",
      email: "maria.rodriguez@example.com",
      phone: "+1 (555) 456-7890",
      status: "active",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Tax Planning",
      joinDate: "Aug 5, 2022",
    },
    {
      id: "member5",
      name: "James Wilson",
      role: "Loan Officer",
      email: "james.wilson@example.com",
      phone: "+1 (555) 567-8901",
      status: "inactive",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Loans",
      joinDate: "Oct 22, 2022",
    },
    {
      id: "member6",
      name: "Emily Taylor",
      role: "Risk Analyst",
      email: "emily.taylor@example.com",
      phone: "+1 (555) 678-9012",
      status: "active",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Risk Management",
      joinDate: "Dec 10, 2022",
    },
    {
      id: "member7",
      name: "Michael Brown",
      role: "Compliance Officer",
      email: "michael.brown@example.com",
      phone: "+1 (555) 789-0123",
      status: "active",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Compliance",
      joinDate: "Feb 18, 2023",
    },
    {
      id: "member8",
      name: "Jessica Martinez",
      role: "Client Relations",
      email: "jessica.martinez@example.com",
      phone: "+1 (555) 890-1234",
      status: "away",
      avatar: "/placeholder.svg?height=40&width=40",
      department: "Client Services",
      joinDate: "Apr 7, 2023",
    },
  ]

  const filteredMembers = members.filter((member) => {
    // Filter by search query
    if (
      searchQuery &&
      !member.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !member.role.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !member.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Filter by tab
    if (selectedTab === "active" && member.status !== "active") return false
    if (selectedTab === "away" && member.status !== "away") return false
    if (selectedTab === "inactive" && member.status !== "inactive") return false
    if (selectedTab === "favorites" && !favorites.includes(member.id)) return false

    return true
  })

  const toggleFavorite = (memberId: string) => {
    if (favorites.includes(memberId)) {
      setFavorites(favorites.filter((id) => id !== memberId))
    } else {
      setFavorites([...favorites, memberId])
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Members</h1>
        <Button onClick={() => setShowAddMember(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search members..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Select defaultValue="name">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="role">Role</SelectItem>
              <SelectItem value="department">Department</SelectItem>
              <SelectItem value="joinDate">Join Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-5 w-full max-w-md">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="away">Away</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>All Members</CardTitle>
              <CardDescription>
                Showing {filteredMembers.length} of {members.length} members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center mb-4 md:mb-0">
                        <Avatar className="h-10 w-10 mr-4">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium">{member.name}</h3>
                            <button
                              className="ml-2 text-gray-400 hover:text-yellow-400 transition-colors"
                              onClick={() => toggleFavorite(member.id)}
                            >
                              {favorites.includes(member.id) ? (
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              ) : (
                                <StarOff className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                          <p className="text-sm text-gray-500">{member.role}</p>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                        <Badge
                          variant={
                            member.status === "active" ? "default" : member.status === "away" ? "outline" : "secondary"
                          }
                          className={
                            member.status === "active"
                              ? "bg-green-500"
                              : member.status === "away"
                                ? "border-yellow-500 text-yellow-500"
                                : "bg-gray-500"
                          }
                        >
                          {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                        </Badge>

                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Phone className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>View Profile</DropdownMenuItem>
                              <DropdownMenuItem>Edit Member</DropdownMenuItem>
                              <DropdownMenuItem>Change Role</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-500">Remove Member</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No members found matching your criteria.</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => {
                        setSearchQuery("")
                        setSelectedTab("all")
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
            {filteredMembers.length > 0 && (
              <CardFooter className="flex justify-between">
                <p className="text-sm text-gray-500">
                  Showing {filteredMembers.length} of {members.length} members
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </CardFooter>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          {/* Content is dynamically filtered by the filteredMembers logic */}
        </TabsContent>

        <TabsContent value="away" className="mt-6">
          {/* Content is dynamically filtered by the filteredMembers logic */}
        </TabsContent>

        <TabsContent value="inactive" className="mt-6">
          {/* Content is dynamically filtered by the filteredMembers logic */}
        </TabsContent>

        <TabsContent value="favorites" className="mt-6">
          {/* Content is dynamically filtered by the filteredMembers logic */}
        </TabsContent>
      </Tabs>

      <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Member</DialogTitle>
            <DialogDescription>Enter the details of the new team member.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" placeholder="Full name" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" type="email" placeholder="Email address" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Input id="role" placeholder="Job title" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                Department
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wealth">Wealth Management</SelectItem>
                  <SelectItem value="investment">Investment</SelectItem>
                  <SelectItem value="customer">Customer Service</SelectItem>
                  <SelectItem value="tax">Tax Planning</SelectItem>
                  <SelectItem value="loans">Loans</SelectItem>
                  <SelectItem value="risk">Risk Management</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="client">Client Services</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input id="phone" placeholder="Phone number" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea id="notes" placeholder="Additional information" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddMember(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={() => setShowAddMember(false)}>
              Add Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
