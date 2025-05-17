"use client"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import {
  Search,
  Plus,
  Send,
  Smile,
  Paperclip,
  ImageIcon,
  Phone,
  Video,
  Info,
  Hash,
  CheckCircle2,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data for the chat interface
const initialContacts = [
  {
    id: "c1",
    name: "Alice Johnson",
    status: "online",
    lastSeen: "Just now",
    avatar: "/placeholder.svg?height=40&width=40",
    unread: 2,
  },
  {
    id: "c2",
    name: "Bob Smith",
    status: "online",
    lastSeen: "Just now",
    avatar: "/placeholder.svg?height=40&width=40",
    unread: 0,
  },
  {
    id: "c3",
    name: "Charlie Brown",
    status: "away",
    lastSeen: "30 minutes ago",
    avatar: "/placeholder.svg?height=40&width=40",
    unread: 0,
  },
  {
    id: "c4",
    name: "Diana Martinez",
    status: "offline",
    lastSeen: "2 hours ago",
    avatar: "/placeholder.svg?height=40&width=40",
    unread: 0,
  },
  {
    id: "c5",
    name: "Ethan Williams",
    status: "online",
    lastSeen: "Just now",
    avatar: "/placeholder.svg?height=40&width=40",
    unread: 5,
  },
]

const initialChannels = [
  {
    id: "ch1",
    name: "general",
    description: "General discussion for all team members",
    members: 24,
    unread: 0,
  },
  {
    id: "ch2",
    name: "finance",
    description: "Financial planning and discussions",
    members: 18,
    unread: 3,
  },
  {
    id: "ch3",
    name: "marketing",
    description: "Marketing strategies and campaigns",
    members: 12,
    unread: 0,
  },
  {
    id: "ch4",
    name: "development",
    description: "Product development and technical discussions",
    members: 15,
    unread: 0,
  },
]

const initialMessages = {
  c1: [
    {
      id: "m1",
      sender: "c1",
      content: "Hi there! How's the financial report coming along?",
      timestamp: "2023-07-15T10:30:00",
      status: "read",
      reactions: [],
    },
    {
      id: "m2",
      sender: "current-user",
      content: "Hey Alice! It's going well. I'm just finalizing the Q2 projections.",
      timestamp: "2023-07-15T10:32:00",
      status: "delivered",
      reactions: [],
    },
    {
      id: "m3",
      sender: "c1",
      content: "Great! Do you think we'll be able to present it at tomorrow's meeting?",
      timestamp: "2023-07-15T10:33:00",
      status: "read",
      reactions: [],
    },
    {
      id: "m4",
      sender: "current-user",
      content: "Yes, definitely. I'll send you a draft by end of day for your review.",
      timestamp: "2023-07-15T10:35:00",
      status: "delivered",
      reactions: [{ emoji: "👍", user: "c1" }],
    },
    {
      id: "m5",
      sender: "c1",
      content: "Perfect! Looking forward to it.",
      timestamp: "2023-07-15T10:36:00",
      status: "read",
      reactions: [],
    },
    {
      id: "m6",
      sender: "c1",
      content: "Also, don't forget we need to include the new tax implications in the report.",
      timestamp: "2023-07-15T14:20:00",
      status: "delivered",
      reactions: [],
    },
    {
      id: "m7",
      sender: "c1",
      content: "The CFO specifically asked for that section to be comprehensive.",
      timestamp: "2023-07-15T14:21:00",
      status: "delivered",
      reactions: [],
    },
  ],
  ch2: [
    {
      id: "m1",
      sender: "c1",
      senderName: "Alice Johnson",
      senderAvatar: "/placeholder.svg?height=40&width=40",
      content: "Hey team, I've just uploaded the latest financial forecasts to the shared drive.",
      timestamp: "2023-07-15T09:30:00",
      reactions: [
        { emoji: "👍", count: 3 },
        { emoji: "🚀", count: 2 },
      ],
    },
    {
      id: "m2",
      sender: "c2",
      senderName: "Bob Smith",
      senderAvatar: "/placeholder.svg?height=40&width=40",
      content: "Thanks Alice! I'll take a look at them this afternoon.",
      timestamp: "2023-07-15T09:35:00",
      reactions: [],
    },
    {
      id: "m3",
      sender: "c5",
      senderName: "Ethan Williams",
      senderAvatar: "/placeholder.svg?height=40&width=40",
      content: "I noticed we're seeing a 15% increase in Q3 projections. What's driving that growth?",
      timestamp: "2023-07-15T10:15:00",
      reactions: [],
    },
    {
      id: "m4",
      sender: "c1",
      senderName: "Alice Johnson",
      senderAvatar: "/placeholder.svg?height=40&width=40",
      content:
        "Good question Ethan. It's primarily due to the new product launch and expanded market reach in the APAC region.",
      timestamp: "2023-07-15T10:20:00",
      reactions: [{ emoji: "💯", count: 1 }],
    },
    {
      id: "m5",
      sender: "current-user",
      senderName: "Current User",
      content: "I've also added some notes on potential risks and mitigation strategies in the appendix.",
      timestamp: "2023-07-15T10:45:00",
      reactions: [{ emoji: "👏", count: 4 }],
    },
  ],
}

export default function ChatPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("direct")
  const [selectedChat, setSelectedChat] = useState(null)
  const [chatType, setChatType] = useState(null) // "direct" or "channel"
  const [message, setMessage] = useState("")
  const [contacts, setContacts] = useState(initialContacts)
  const [channels, setChannels] = useState(initialChannels)
  const [messages, setMessages] = useState(initialMessages)
  const [isNewChannelOpen, setIsNewChannelOpen] = useState(false)
  const [newChannel, setNewChannel] = useState({
    name: "",
    description: "",
    isPrivate: false,
  })
  const messagesEndRef = useRef(null)

  // Scroll to bottom of messages when messages change or chat changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, selectedChat])

  // Filter contacts and channels based on search query
  const filteredContacts = contacts.filter((contact) => contact.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const filteredChannels = channels.filter(
    (channel) =>
      channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      channel.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Get current chat messages
  const currentMessages = selectedChat ? messages[selectedChat] || [] : []

  // Get current chat details
  const getCurrentChatDetails = () => {
    if (!selectedChat) return null

    if (chatType === "direct") {
      return contacts.find((contact) => contact.id === selectedChat)
    } else if (chatType === "channel") {
      return channels.find((channel) => channel.id === selectedChat)
    }

    return null
  }

  const currentChatDetails = getCurrentChatDetails()

  // Handle sending a message
  const handleSendMessage = (e) => {
    e.preventDefault()

    if (!message.trim() || !selectedChat) return

    const newMessage = {
      id: `m${Date.now()}`,
      sender: "current-user",
      senderName: chatType === "channel" ? "You" : undefined,
      content: message,
      timestamp: new Date().toISOString(),
      status: "sent",
      reactions: [],
    }

    setMessages((prev) => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMessage],
    }))

    setMessage("")

    // Mark as read if there are unread messages
    if (chatType === "direct") {
      setContacts((prev) => prev.map((contact) => (contact.id === selectedChat ? { ...contact, unread: 0 } : contact)))
    } else if (chatType === "channel") {
      setChannels((prev) => prev.map((channel) => (channel.id === selectedChat ? { ...channel, unread: 0 } : channel)))
    }
  }

  // Handle selecting a chat
  const handleSelectChat = (id, type) => {
    setSelectedChat(id)
    setChatType(type)

    // Mark as read when selecting a chat
    if (type === "direct") {
      setContacts((prev) => prev.map((contact) => (contact.id === id ? { ...contact, unread: 0 } : contact)))
    } else if (type === "channel") {
      setChannels((prev) => prev.map((channel) => (channel.id === id ? { ...channel, unread: 0 } : channel)))
    }
  }

  // Handle creating a new channel
  const handleCreateChannel = (e) => {
    e.preventDefault()

    if (!newChannel.name.trim()) return

    const channelId = `ch${channels.length + 1}`
    const newChannelWithId = {
      id: channelId,
      name: newChannel.name.toLowerCase().replace(/\s+/g, "-"),
      description: newChannel.description,
      members: 1,
      unread: 0,
      isPrivate: newChannel.isPrivate,
    }

    setChannels([...channels, newChannelWithId])
    setNewChannel({
      name: "",
      description: "",
      isPrivate: false,
    })
    setIsNewChannelOpen(false)

    // Select the new channel
    setSelectedChat(channelId)
    setChatType("channel")
    setActiveTab("channels")

    toast.success(`Channel #${newChannelWithId.name} created successfully!`)
  }

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold">Chat</h1>
        <p className="text-muted-foreground">Connect with your team and clients</p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-full md:w-80 border-r flex flex-col overflow-hidden">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search conversations..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="direct" className="flex-1 overflow-hidden" onValueChange={setActiveTab} value={activeTab}>
            <div className="px-4 pt-2">
              <TabsList className="w-full">
                <TabsTrigger value="direct" className="flex-1">
                  Direct
                </TabsTrigger>
                <TabsTrigger value="channels" className="flex-1">
                  Channels
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="direct" className="flex-1 overflow-hidden flex flex-col mt-0 pt-2">
              <ScrollArea className="flex-1">
                <div className="p-2 space-y-2">
                  {filteredContacts.map((contact) => (
                    <button
                      key={contact.id}
                      className={cn(
                        "w-full flex items-center gap-3 p-2 rounded-md hover:bg-muted text-left",
                        selectedChat === contact.id && chatType === "direct" && "bg-muted",
                      )}
                      onClick={() => handleSelectChat(contact.id, "direct")}
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
                          <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span
                          className={cn(
                            "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                            contact.status === "online" && "bg-green-500",
                            contact.status === "away" && "bg-yellow-500",
                            contact.status === "offline" && "bg-gray-400",
                          )}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <span className="font-medium truncate">{contact.name}</span>
                          {contact.unread > 0 && (
                            <Badge variant="default" className="ml-auto">
                              {contact.unread}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{contact.lastSeen}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="channels" className="flex-1 overflow-hidden flex flex-col mt-0 pt-2">
              <div className="px-4 pb-2 flex justify-between items-center">
                <h3 className="text-sm font-medium">Channels</h3>
                <Dialog open={isNewChannelOpen} onOpenChange={setIsNewChannelOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Plus className="h-4 w-4" />
                      <span className="sr-only">New Channel</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create a new channel</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateChannel}>
                      <div className="space-y-4 py-2">
                        <div className="space-y-2">
                          <Label htmlFor="channel-name">Channel name</Label>
                          <Input
                            id="channel-name"
                            placeholder="e.g. marketing"
                            value={newChannel.name}
                            onChange={(e) => setNewChannel({ ...newChannel, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="channel-description">Description</Label>
                          <Textarea
                            id="channel-description"
                            placeholder="What is this channel about?"
                            value={newChannel.description}
                            onChange={(e) => setNewChannel({ ...newChannel, description: e.target.value })}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="private-channel"
                            checked={newChannel.isPrivate}
                            onCheckedChange={(checked) => setNewChannel({ ...newChannel, isPrivate: checked })}
                          />
                          <Label htmlFor="private-channel">Make private</Label>
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button type="button" variant="outline">
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button type="submit">Create Channel</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-2 space-y-2">
                  {filteredChannels.map((channel) => (
                    <button
                      key={channel.id}
                      className={cn(
                        "w-full flex items-center gap-3 p-2 rounded-md hover:bg-muted text-left",
                        selectedChat === channel.id && chatType === "channel" && "bg-muted",
                      )}
                      onClick={() => handleSelectChat(channel.id, "channel")}
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
                        <Hash className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <span className="font-medium truncate">#{channel.name}</span>
                          {channel.unread > 0 && (
                            <Badge variant="default" className="ml-auto">
                              {channel.unread}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{channel.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        {/* Chat Area */}
        {selectedChat ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b flex justify-between items-center">
              <div className="flex items-center gap-3">
                {chatType === "direct" ? (
                  <>
                    <div className="relative">
                      <Avatar>
                        <AvatarImage
                          src={currentChatDetails?.avatar || "/placeholder.svg"}
                          alt={currentChatDetails?.name}
                        />
                        <AvatarFallback>{currentChatDetails?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span
                        className={cn(
                          "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                          currentChatDetails?.status === "online" && "bg-green-500",
                          currentChatDetails?.status === "away" && "bg-yellow-500",
                          currentChatDetails?.status === "offline" && "bg-gray-400",
                        )}
                      />
                    </div>
                    <div>
                      <h2 className="font-semibold">{currentChatDetails?.name}</h2>
                      <p className="text-xs text-muted-foreground">
                        {currentChatDetails?.status === "online" ? "Online" : currentChatDetails?.lastSeen}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
                      <Hash className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="font-semibold">#{currentChatDetails?.name}</h2>
                      <p className="text-xs text-muted-foreground">{currentChatDetails?.members} members</p>
                    </div>
                  </>
                )}
              </div>
              <div className="flex items-center gap-1">
                <TooltipProvider>
                  {chatType === "direct" && (
                    <>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Phone className="h-4 w-4" />
                            <span className="sr-only">Call</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Call</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Video className="h-4 w-4" />
                            <span className="sr-only">Video Call</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Video Call</TooltipContent>
                      </Tooltip>
                    </>
                  )}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Info className="h-4 w-4" />
                        <span className="sr-only">Info</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Info</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {currentMessages.map((msg) => {
                  const isCurrentUser = msg.sender === "current-user"
                  const contact = contacts.find((c) => c.id === msg.sender)

                  return (
                    <div key={msg.id} className={cn("flex", isCurrentUser && "justify-end")}>
                      <div className={cn("flex gap-3 max-w-[80%]", isCurrentUser && "flex-row-reverse")}>
                        {!isCurrentUser && chatType === "direct" && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={contact?.avatar || "/placeholder.svg"} alt={contact?.name} />
                            <AvatarFallback>{contact?.name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                        )}

                        {!isCurrentUser && chatType === "channel" && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={msg.senderAvatar || "/placeholder.svg"} alt={msg.senderName} />
                            <AvatarFallback>{msg.senderName?.charAt(0)}</AvatarFallback>
                          </Avatar>
                        )}

                        <div className={cn("space-y-1", isCurrentUser && "items-end")}>
                          {!isCurrentUser && chatType === "channel" && (
                            <p className="text-sm font-medium">{msg.senderName}</p>
                          )}

                          <div className="flex items-end gap-2">
                            <div
                              className={cn(
                                "rounded-lg px-3 py-2 max-w-full",
                                isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted",
                              )}
                            >
                              <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                            </div>

                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {formatTimestamp(msg.timestamp)}
                            </span>
                          </div>

                          {msg.reactions.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {msg.reactions.map((reaction, index) => (
                                <div
                                  key={index}
                                  className="flex items-center bg-muted rounded-full px-2 py-0.5 text-xs"
                                >
                                  <span>{reaction.emoji}</span>
                                  {reaction.count && <span className="ml-1">{reaction.count}</span>}
                                </div>
                              ))}
                            </div>
                          )}

                          {isCurrentUser && (
                            <div className="flex justify-end">
                              <span className="text-xs text-muted-foreground">
                                {msg.status === "sent" && <Clock className="inline h-3 w-3 mr-1" />}
                                {msg.status === "delivered" && <CheckCircle2 className="inline h-3 w-3 mr-1" />}
                                {msg.status === "read" && (
                                  <div className="inline-flex">
                                    <CheckCircle2 className="h-3 w-3" />
                                    <CheckCircle2 className="h-3 w-3 -ml-1" />
                                  </div>
                                )}
                                {msg.status}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <Textarea
                    placeholder={`Message ${chatType === "direct" ? currentChatDetails?.name : "#" + currentChatDetails?.name}`}
                    className="min-h-[80px] resize-none pr-12"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <div className="absolute bottom-2 right-2 flex gap-1">
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <Paperclip className="h-4 w-4" />
                      <span className="sr-only">Attach file</span>
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <ImageIcon className="h-4 w-4" />
                      <span className="sr-only">Attach image</span>
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <Smile className="h-4 w-4" />
                      <span className="sr-only">Emoji</span>
                    </Button>
                  </div>
                </div>
                <Button type="submit" size="icon" className="h-10 w-10 rounded-full shrink-0">
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-lg font-medium">No conversation selected</h3>
              <p className="text-muted-foreground">Choose a conversation from the sidebar or start a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function MessageSquare(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}
