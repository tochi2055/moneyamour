"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "sonner"
import { format } from "date-fns"
import {
  Search,
  Plus,
  Video,
  Users,
  CalendarIcon,
  Clock,
  Link,
  Check,
  MoreHorizontal,
  CalendarDays,
  VideoOff,
  X,
  Mic,
  MicOff,
  Share2,
  MessageSquare,
  Settings,
  UserPlus,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data for meetings
const initialMeetings = [
  {
    id: "m1",
    title: "Q2 Financial Review",
    description: "Review of Q2 financial performance and projections for Q3",
    date: "2023-07-20",
    time: "10:00",
    duration: 60,
    host: "Alice Johnson",
    hostAvatar: "/placeholder.svg?height=40&width=40",
    participants: [
      { id: "p1", name: "Bob Smith", avatar: "/placeholder.svg?height=40&width=40" },
      { id: "p2", name: "Charlie Brown", avatar: "/placeholder.svg?height=40&width=40" },
      { id: "p3", name: "Diana Martinez", avatar: "/placeholder.svg?height=40&width=40" },
    ],
    joinUrl: "https://meet.example.com/q2-financial-review",
    status: "upcoming",
  },
  {
    id: "m2",
    title: "Investment Strategy Planning",
    description: "Discussion on new investment opportunities and portfolio adjustments",
    date: "2023-07-21",
    time: "14:00",
    duration: 90,
    host: "Ethan Williams",
    hostAvatar: "/placeholder.svg?height=40&width=40",
    participants: [
      { id: "p1", name: "Alice Johnson", avatar: "/placeholder.svg?height=40&width=40" },
      { id: "p4", name: "Frank Thomas", avatar: "/placeholder.svg?height=40&width=40" },
      { id: "p5", name: "Grace Lee", avatar: "/placeholder.svg?height=40&width=40" },
    ],
    joinUrl: "https://meet.example.com/investment-strategy",
    status: "upcoming",
  },
  {
    id: "m3",
    title: "Client Onboarding Process",
    description: "Review and optimization of the client onboarding workflow",
    date: "2023-07-18",
    time: "11:00",
    duration: 45,
    host: "Bob Smith",
    hostAvatar: "/placeholder.svg?height=40&width=40",
    participants: [
      { id: "p2", name: "Charlie Brown", avatar: "/placeholder.svg?height=40&width=40" },
      { id: "p3", name: "Diana Martinez", avatar: "/placeholder.svg?height=40&width=40" },
      { id: "p6", name: "Henry Wilson", avatar: "/placeholder.svg?height=40&width=40" },
    ],
    joinUrl: "https://meet.example.com/client-onboarding",
    status: "completed",
    recording: "https://recordings.example.com/client-onboarding",
  },
  {
    id: "m4",
    title: "Marketing Campaign Review",
    description: "Analysis of recent marketing campaigns and planning for Q3",
    date: "2023-07-17",
    time: "15:30",
    duration: 60,
    host: "Diana Martinez",
    hostAvatar: "/placeholder.svg?height=40&width=40",
    participants: [
      { id: "p1", name: "Alice Johnson", avatar: "/placeholder.svg?height=40&width=40" },
      { id: "p5", name: "Grace Lee", avatar: "/placeholder.svg?height=40&width=40" },
      { id: "p7", name: "Irene Nguyen", avatar: "/placeholder.svg?height=40&width=40" },
    ],
    joinUrl: "https://meet.example.com/marketing-campaign",
    status: "completed",
    recording: "https://recordings.example.com/marketing-campaign",
  },
]

export default function MeetingsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [meetings, setMeetings] = useState(initialMeetings)
  const [activeTab, setActiveTab] = useState("upcoming")
  const [selectedMeeting, setSelectedMeeting] = useState(null)
  const [isCreateMeetingOpen, setIsCreateMeetingOpen] = useState(false)
  const [isJoinMeetingOpen, setIsJoinMeetingOpen] = useState(false)
  const [newMeeting, setNewMeeting] = useState({
    title: "",
    description: "",
    date: new Date(),
    time: "",
    duration: "60",
    participants: [],
  })
  const [joinUrl, setJoinUrl] = useState("")
  const [isInMeeting, setIsInMeeting] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isLinkCopied, setIsLinkCopied] = useState(false)

  // Filter meetings based on search query and active tab
  const filteredMeetings = meetings.filter(
    (meeting) =>
      (meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meeting.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (activeTab === "all" || meeting.status === activeTab),
  )

  // Handle creating a new meeting
  const handleCreateMeeting = (e) => {
    e.preventDefault()

    if (!newMeeting.title.trim() || !newMeeting.time) return

    const meetingId = `m${meetings.length + 1}`
    const newMeetingWithId = {
      id: meetingId,
      ...newMeeting,
      date: format(newMeeting.date, "yyyy-MM-dd"),
      host: "Current User",
      hostAvatar: "/placeholder.svg?height=40&width=40",
      participants: [
        { id: "p1", name: "Alice Johnson", avatar: "/placeholder.svg?height=40&width=40" },
        { id: "p2", name: "Bob Smith", avatar: "/placeholder.svg?height=40&width=40" },
      ],
      joinUrl: `https://meet.example.com/${newMeeting.title.toLowerCase().replace(/\s+/g, "-")}`,
      status: "upcoming",
    }

    setMeetings([...meetings, newMeetingWithId])
    setNewMeeting({
      title: "",
      description: "",
      date: new Date(),
      time: "",
      duration: "60",
      participants: [],
    })
    setIsCreateMeetingOpen(false)

    toast.success("Meeting created successfully!")
  }

  // Handle joining a meeting
  const handleJoinMeeting = (e) => {
    e.preventDefault()

    if (!joinUrl.trim()) return

    setIsJoinMeetingOpen(false)
    setIsInMeeting(true)

    toast.success("Joined meeting successfully!")
  }

  // Handle joining a specific meeting
  const handleJoinSpecificMeeting = (meeting) => {
    setSelectedMeeting(meeting)
    setIsInMeeting(true)
  }

  // Handle leaving a meeting
  const handleLeaveMeeting = () => {
    setIsInMeeting(false)
    setSelectedMeeting(null)
    setIsMuted(false)
    setIsVideoOff(false)
  }

  // Handle copying meeting link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(selectedMeeting?.joinUrl || "https://meet.example.com/sample-meeting")
    setIsLinkCopied(true)

    setTimeout(() => {
      setIsLinkCopied(false)
    }, 2000)

    toast.success("Meeting link copied to clipboard!")
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
      {isInMeeting ? (
        <div className="flex flex-col h-full bg-black text-white">
          {/* Meeting Header */}
          <div className="p-4 flex justify-between items-center bg-gray-900">
            <div>
              <h2 className="font-semibold">{selectedMeeting?.title || "Meeting"}</h2>
              <p className="text-xs text-gray-400">
                {selectedMeeting
                  ? `${format(new Date(`${selectedMeeting.date}T${selectedMeeting.time}`), "PPp")}`
                  : "Current Meeting"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-white"
                onClick={handleCopyLink}
              >
                {isLinkCopied ? <Check className="h-4 w-4 mr-1" /> : <Link className="h-4 w-4 mr-1" />}
                {isLinkCopied ? "Copied" : "Copy Link"}
              </Button>
              <Button variant="destructive" size="sm" onClick={handleLeaveMeeting}>
                <LogOut className="h-4 w-4 mr-1" />
                Leave
              </Button>
            </div>
          </div>

          {/* Meeting Content */}
          <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
            <div className="w-full max-w-4xl aspect-video bg-gray-800 rounded-lg flex items-center justify-center mb-4">
              {isVideoOff ? (
                <div className="text-center">
                  <VideoOff className="h-16 w-16 mx-auto mb-2 text-gray-500" />
                  <p className="text-gray-400">Your video is turned off</p>
                </div>
              ) : (
                <div className="w-full h-full bg-gray-700 rounded-lg flex items-center justify-center">
                  <Video className="h-16 w-16 text-gray-500" />
                </div>
              )}
            </div>

            {/* Participants */}
            <div className="absolute top-8 right-8 flex flex-wrap gap-2 justify-end">
              {(selectedMeeting?.participants || []).map((participant, index) => (
                <div key={index} className="w-32 h-24 bg-gray-800 rounded-lg overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={participant.avatar || "/placeholder.svg"} alt={participant.name} />
                      <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-1">
                    <p className="text-xs text-center truncate">{participant.name}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Meeting Controls */}
            <div className="bg-gray-900 rounded-full p-2 flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-10 w-10 rounded-full",
                  isMuted ? "bg-red-500 hover:bg-red-600 text-white" : "bg-gray-800 hover:bg-gray-700 text-white",
                )}
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-10 w-10 rounded-full",
                  isVideoOff ? "bg-red-500 hover:bg-red-600 text-white" : "bg-gray-800 hover:bg-gray-700 text-white",
                )}
                onClick={() => setIsVideoOff(!isVideoOff)}
              >
                {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                <span className="sr-only">{isVideoOff ? "Turn on camera" : "Turn off camera"}</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-gray-800 hover:bg-gray-700 text-white"
              >
                <Share2 className="h-5 w-5" />
                <span className="sr-only">Share screen</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-gray-800 hover:bg-gray-700 text-white"
              >
                <MessageSquare className="h-5 w-5" />
                <span className="sr-only">Chat</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-gray-800 hover:bg-gray-700 text-white"
              >
                <Users className="h-5 w-5" />
                <span className="sr-only">Participants</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-gray-800 hover:bg-gray-700 text-white"
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-red-500 hover:bg-red-600 text-white"
                onClick={handleLeaveMeeting}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">End call</span>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="p-4 border-b">
            <h1 className="text-2xl font-bold">Meetings</h1>
            <p className="text-muted-foreground">Schedule and join video conferences</p>
          </div>

          <div className="p-4 border-b flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search meetings..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Dialog open={isCreateMeetingOpen} onOpenChange={setIsCreateMeetingOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Meeting
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create a new meeting</DialogTitle>
                    <DialogDescription>Fill in the details to schedule your meeting</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateMeeting}>
                    <div className="space-y-4 py-2">
                      <div className="space-y-2">
                        <Label htmlFor="meeting-title">Meeting title</Label>
                        <Input
                          id="meeting-title"
                          placeholder="e.g. Q3 Financial Review"
                          value={newMeeting.title}
                          onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="meeting-description">Description</Label>
                        <Textarea
                          id="meeting-description"
                          placeholder="What is this meeting about?"
                          value={newMeeting.description}
                          onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {newMeeting.date ? format(newMeeting.date, "PPP") : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={newMeeting.date}
                                onSelect={(date) => setNewMeeting({ ...newMeeting, date })}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="meeting-time">Time</Label>
                          <Input
                            id="meeting-time"
                            type="time"
                            value={newMeeting.time}
                            onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="meeting-duration">Duration</Label>
                        <Select
                          value={newMeeting.duration}
                          onValueChange={(value) => setNewMeeting({ ...newMeeting, duration: value })}
                        >
                          <SelectTrigger id="meeting-duration">
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="45">45 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                            <SelectItem value="90">1.5 hours</SelectItem>
                            <SelectItem value="120">2 hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Participants</Label>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8"
                            onClick={() => {
                              // In a real app, this would open a dialog to select participants
                              toast.info("Participant selection would open here")
                            }}
                          >
                            <UserPlus className="h-3.5 w-3.5 mr-1" />
                            Add participants
                          </Button>
                        </div>
                      </div>
                    </div>
                    <DialogFooter className="mt-4">
                      <Button type="submit">Create Meeting</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={isJoinMeetingOpen} onOpenChange={setIsJoinMeetingOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Video className="h-4 w-4 mr-2" />
                    Join Meeting
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Join a meeting</DialogTitle>
                    <DialogDescription>Enter the meeting link or ID to join</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleJoinMeeting}>
                    <div className="space-y-4 py-2">
                      <div className="space-y-2">
                        <Label htmlFor="meeting-link">Meeting link or ID</Label>
                        <Input
                          id="meeting-link"
                          placeholder="https://meet.example.com/abc-123-xyz"
                          value={joinUrl}
                          onChange={(e) => setJoinUrl(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter className="mt-4">
                      <Button type="submit">Join</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Tabs
            defaultValue="upcoming"
            className="flex-1 overflow-hidden"
            onValueChange={setActiveTab}
            value={activeTab}
          >
            <div className="px-4 pt-2 border-b">
              <TabsList>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="all">All Meetings</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="upcoming" className="flex-1 overflow-hidden flex flex-col mt-0 pt-2">
              <ScrollArea className="flex-1 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredMeetings.length > 0 ? (
                    filteredMeetings.map((meeting) => (
                      <Card key={meeting.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{meeting.title}</CardTitle>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                          <CardDescription className="line-clamp-2">{meeting.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="space-y-2">
                            <div className="flex items-center text-sm">
                              <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{format(new Date(meeting.date), "EEEE, MMMM d, yyyy")}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>
                                {format(new Date(`${meeting.date}T${meeting.time}`), "h:mm a")} · {meeting.duration} min
                              </span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{meeting.participants.length + 1} participants</span>
                            </div>
                          </div>
                          <div className="mt-4 flex -space-x-2">
                            <Avatar className="h-8 w-8 border-2 border-background">
                              <AvatarImage src={meeting.hostAvatar || "/placeholder.svg"} alt={meeting.host} />
                              <AvatarFallback>{meeting.host.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {meeting.participants.slice(0, 3).map((participant, index) => (
                              <Avatar key={index} className="h-8 w-8 border-2 border-background">
                                <AvatarImage src={participant.avatar || "/placeholder.svg"} alt={participant.name} />
                                <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                            ))}
                            {meeting.participants.length > 3 && (
                              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                                +{meeting.participants.length - 3}
                              </div>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button className="w-full" onClick={() => handleJoinSpecificMeeting(meeting)}>
                            <Video className="h-4 w-4 mr-2" />
                            Join Meeting
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full flex items-center justify-center h-64">
                      <div className="text-center space-y-2">
                        <div className="flex justify-center">
                          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                            <Video className="h-6 w-6 text-muted-foreground" />
                          </div>
                        </div>
                        <h3 className="text-lg font-medium">No meetings found</h3>
                        <p className="text-muted-foreground">
                          {searchQuery ? "Try adjusting your search query" : "Schedule a meeting to get started"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="completed" className="flex-1 overflow-hidden flex flex-col mt-0 pt-2">
              <ScrollArea className="flex-1 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredMeetings.length > 0 ? (
                    filteredMeetings.map((meeting) => (
                      <Card key={meeting.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{meeting.title}</CardTitle>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                          <CardDescription className="line-clamp-2">{meeting.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="space-y-2">
                            <div className="flex items-center text-sm">
                              <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{format(new Date(meeting.date), "EEEE, MMMM d, yyyy")}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>
                                {format(new Date(`${meeting.date}T${meeting.time}`), "h:mm a")} · {meeting.duration} min
                              </span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{meeting.participants.length + 1} participants</span>
                            </div>
                          </div>
                          <div className="mt-4 flex -space-x-2">
                            <Avatar className="h-8 w-8 border-2 border-background">
                              <AvatarImage src={meeting.hostAvatar || "/placeholder.svg"} alt={meeting.host} />
                              <AvatarFallback>{meeting.host.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {meeting.participants.slice(0, 3).map((participant, index) => (
                              <Avatar key={index} className="h-8 w-8 border-2 border-background">
                                <AvatarImage src={participant.avatar || "/placeholder.svg"} alt={participant.name} />
                                <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                            ))}
                            {meeting.participants.length > 3 && (
                              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                                +{meeting.participants.length - 3}
                              </div>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button
                            className="w-full"
                            variant="outline"
                            onClick={() => {
                              // In a real app, this would open the recording
                              toast.info("Meeting recording would play here")
                            }}
                          >
                            <Video className="h-4 w-4 mr-2" />
                            View Recording
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full flex items-center justify-center h-64">
                      <div className="text-center space-y-2">
                        <div className="flex justify-center">
                          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                            <Video className="h-6 w-6 text-muted-foreground" />
                          </div>
                        </div>
                        <h3 className="text-lg font-medium">No completed meetings</h3>
                        <p className="text-muted-foreground">
                          {searchQuery ? "Try adjusting your search query" : "Your completed meetings will appear here"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="all" className="flex-1 overflow-hidden flex flex-col mt-0 pt-2">
              <ScrollArea className="flex-1 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredMeetings.length > 0 ? (
                    filteredMeetings.map((meeting) => (
                      <Card key={meeting.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{meeting.title}</CardTitle>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                          <CardDescription className="line-clamp-2">{meeting.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="space-y-2">
                            <div className="flex items-center text-sm">
                              <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{format(new Date(meeting.date), "EEEE, MMMM d, yyyy")}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>
                                {format(new Date(`${meeting.date}T${meeting.time}`), "h:mm a")} · {meeting.duration} min
                              </span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{meeting.participants.length + 1} participants</span>
                            </div>
                          </div>
                          <div className="mt-4 flex -space-x-2">
                            <Avatar className="h-8 w-8 border-2 border-background">
                              <AvatarImage src={meeting.hostAvatar || "/placeholder.svg"} alt={meeting.host} />
                              <AvatarFallback>{meeting.host.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {meeting.participants.slice(0, 3).map((participant, index) => (
                              <Avatar key={index} className="h-8 w-8 border-2 border-background">
                                <AvatarImage src={participant.avatar || "/placeholder.svg"} alt={participant.name} />
                                <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                            ))}
                            {meeting.participants.length > 3 && (
                              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                                +{meeting.participants.length - 3}
                              </div>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter>
                          {meeting.status === "upcoming" ? (
                            <Button className="w-full" onClick={() => handleJoinSpecificMeeting(meeting)}>
                              <Video className="h-4 w-4 mr-2" />
                              Join Meeting
                            </Button>
                          ) : (
                            <Button
                              className="w-full"
                              variant="outline"
                              onClick={() => {
                                // In a real app, this would open the recording
                                toast.info("Meeting recording would play here")
                              }}
                            >
                              <Video className="h-4 w-4 mr-2" />
                              View Recording
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full flex items-center justify-center h-64">
                      <div className="text-center space-y-2">
                        <div className="flex justify-center">
                          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                            <Video className="h-6 w-6 text-muted-foreground" />
                          </div>
                        </div>
                        <h3 className="text-lg font-medium">No meetings found</h3>
                        <p className="text-muted-foreground">
                          {searchQuery ? "Try adjusting your search query" : "Schedule a meeting to get started"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
