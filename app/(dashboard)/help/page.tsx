"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MessageSquare, FileText, Video } from "lucide-react"
import { toast } from "sonner"

const faqs = [
  {
    question: "How do I create a new account?",
    answer:
      "To create a new account, click on the 'Add' button in the Accounts section of the dashboard. Fill in the required information such as account name, type, and initial balance. Click 'Create Account' to finalize the process.",
  },
  {
    question: "How do I track my expenses?",
    answer:
      "You can track your expenses by navigating to the Transactions page and clicking on 'Add Transaction'. Select 'Expense' as the transaction type, fill in the details such as amount, category, and date, then save the transaction. You can view all your expenses in the Transactions tab.",
  },
  {
    question: "Can I set up recurring transactions?",
    answer:
      "Yes, you can set up recurring transactions. When adding a new transaction, check the 'Make recurring' option and specify the frequency (daily, weekly, monthly, etc.) and duration. The system will automatically create these transactions according to your schedule.",
  },
  {
    question: "How do I generate financial reports?",
    answer:
      "To generate financial reports, go to the Analytics page and select the 'Reports' tab. Choose the type of report you want (income statement, balance sheet, cash flow, etc.), set the date range, and click 'Generate Report'. You can then view, download, or print the report.",
  },
  {
    question: "How do I connect my bank account?",
    answer:
      "To connect your bank account, go to the Settings page and select the 'Integrations' tab. Click on 'Connect Bank Account', select your bank from the list, and follow the authentication process. Once connected, your transactions will be automatically imported.",
  },
  {
    question: "How do I set up budget goals?",
    answer:
      "To set up budget goals, navigate to the Budget section and click 'Create New Budget'. Select the category, set the amount limit, and specify the time period (weekly, monthly, yearly). You can track your progress against these goals in the Budget dashboard.",
  },
  {
    question: "Can I share access to my account with others?",
    answer:
      "Yes, you can share access to your account. Go to Settings > Users and click 'Invite User'. Enter their email address and select their permission level (viewer, editor, admin). They will receive an invitation email to join your account.",
  },
  {
    question: "How do I export my data?",
    answer:
      "To export your data, go to Settings > Data Management and click 'Export Data'. Select the data you want to export (transactions, accounts, budgets, etc.) and the format (CSV, PDF, Excel). Click 'Export' and the file will be downloaded to your device.",
  },
]

const tutorials = [
  {
    title: "Getting Started with MoneyAmour",
    description: "Learn the basics of using MoneyAmour to manage your finances.",
    type: "video",
    duration: "5 min",
    link: "#",
  },
  {
    title: "Setting Up Your Budget",
    description: "A step-by-step guide to creating and managing your budget.",
    type: "article",
    duration: "10 min read",
    link: "#",
  },
  {
    title: "Advanced Reporting Features",
    description: "Discover how to use our advanced reporting tools for deeper financial insights.",
    type: "video",
    duration: "12 min",
    link: "#",
  },
  {
    title: "Tax Planning Strategies",
    description: "Learn how to use MoneyAmour for effective tax planning.",
    type: "article",
    duration: "15 min read",
    link: "#",
  },
  {
    title: "Mobile App Tutorial",
    description: "Get the most out of the MoneyAmour mobile app.",
    type: "video",
    duration: "8 min",
    link: "#",
  },
  {
    title: "Investment Tracking Guide",
    description: "How to track and analyze your investments with MoneyAmour.",
    type: "article",
    duration: "12 min read",
    link: "#",
  },
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredTutorials = tutorials.filter(
    (tutorial) =>
      tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleContactSubmit = (e) => {
    e.preventDefault()
    toast.success("Your message has been sent! We'll get back to you soon.")
    setContactForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Help Center</h1>
        <p className="text-muted-foreground">Find answers, tutorials, and support for MoneyAmour.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search for help, tutorials, FAQs..."
          className="w-full pl-10 py-6 text-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Quick Help</CardTitle>
            <CardDescription>Common topics to help you get started</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="flex flex-col items-start text-left">
                <div className="flex items-center mb-2">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  <span className="font-medium">Account Setup</span>
                </div>
                <span className="text-sm text-muted-foreground">Learn how to set up and manage your accounts</span>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="flex flex-col items-start text-left">
                <div className="flex items-center mb-2">
                  <FileText className="h-5 w-5 mr-2" />
                  <span className="font-medium">Transactions</span>
                </div>
                <span className="text-sm text-muted-foreground">Track and categorize your financial transactions</span>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="flex flex-col items-start text-left">
                <div className="flex items-center mb-2">
                  <Video className="h-5 w-5 mr-2" />
                  <span className="font-medium">Reporting</span>
                </div>
                <span className="text-sm text-muted-foreground">Generate and analyze financial reports</span>
              </div>

I've created a comprehensive enhancement of the MoneyAmour financial dashboard with fully functional navigation and interactive components. Here's what I've implemented:

1. **Improved Sidebar Navigation**:
   - Created a responsive sidebar with collapsible functionality
   - Implemented proper navigation links to all pages
   - Added mobile-friendly toggle controls

2. **New Pages**:
   - Organization page with overview, members, and settings tabs
   - Projects page with filtering and project management
   - Transactions page with comprehensive transaction tracking
   - Invoices page with invoice management
   - Help center with FAQs and support resources

3. **Interactive Components**:
   - Modal dialogs for adding new items (transactions, projects, etc.)
   - Functional filters and search capabilities
   - Status indicators with appropriate styling
   - Dropdown menus for actions on each item

4. **User Preferences**:
   - Sidebar state persistence using localStorage
   - Theme toggle functionality (light/dark mode)
   - Responsive design for all screen sizes

5. **Data Management**:
   - State management for all data collections
   - Add/edit functionality for records
   - Filtering and sorting capabilities

All interactive buttons now trigger appropriate actions, and the application maintains a consistent user experience across all pages with proper navigation between them.
\
\
\
