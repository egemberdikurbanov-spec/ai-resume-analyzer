"use client"

import { useState, useRef } from "react"
import { LogOut, Scan, LayoutList, Target, Heart, MessageSquareText, Plus, ChevronDown, User, Settings, Sparkles, ArrowRight, Check, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AuthForm } from "./auth-form"
import { UploadZone } from "./upload-zone"
import { LoadingAnimation } from "./loading-animation"
import { ScoreWidget } from "./score-widget"
import { CategoryScores, type CategoryScore } from "./category-scores"
import { FeedbackCard, type FeedbackItem } from "./feedback-card"
import { ScanHistory, type ScanHistoryItem } from "./scan-history"
import { KeywordsMatch } from "./keywords-match"
import { PreferencesModal } from "./preferences-modal"
import { logout as apiLogout, submitEvaluation, parseAIResult, getEvaluations, type ParsedEvaluation, type AIResult } from "@/lib/api"

type AppState = "landing" | "auth" | "upload" | "loading" | "results"

interface UserData {
  email: string
  name: string
}

// Rich mock data with detailed AI feedback
const mockCategories: CategoryScore[] = [
  { id: "formatting", name: "Formatting", score: 85, issues: 2, icon: "formatting" },
  { id: "content", name: "Content Quality", score: 72, issues: 5, icon: "content" },
  { id: "structure", name: "Structure", score: 68, issues: 4, icon: "structure" },
  { id: "skills", name: "Skills Match", score: 78, issues: 3, icon: "skills" },
]

const mockFeedback: FeedbackItem[] = [
  {
    id: "1",
    title: "Add More Measurable Results",
    description: "Your bullet points lack quantifiable achievements that demonstrate impact",
    status: "warning",
    category: "Content",
    suggestion: "Transform vague statements like 'Improved team productivity' into specific metrics such as 'Increased team productivity by 35% through implementing automated testing workflows, reducing deployment time from 2 hours to 15 minutes.' Recruiters and ATS systems prioritize concrete numbers and percentages.",
    detailedFeedback: "We analyzed 6 bullet points in your Work Experience section. Only 1 contains quantifiable metrics. Industry best practice suggests at least 70% of your achievements should include numbers, percentages, or monetary values. Consider adding metrics for: team size managed, revenue impact, time saved, or customer satisfaction improvements.",
  },
  {
    id: "2",
    title: "Critical Missing Keywords",
    description: "Several important skills from the job description are not mentioned in your CV",
    status: "error",
    category: "Skills",
    suggestion: "The job description emphasizes React, TypeScript, CI/CD pipelines, and Agile methodologies. Your CV mentions React once but lacks TypeScript entirely. Add a dedicated 'Technical Skills' section listing: TypeScript, React Hooks, Redux/Context API, Jest/Testing Library, GitHub Actions, and Scrum/Kanban. This will significantly improve your ATS match score.",
    detailedFeedback: "Keyword analysis shows a 45% match rate with the job description. Missing high-priority keywords: TypeScript (mentioned 4 times in JD), CI/CD (mentioned 3 times), Agile/Scrum (mentioned 2 times). Your CV over-emphasizes JavaScript but the role specifically requires TypeScript proficiency. Consider reframing your JavaScript experience to highlight TypeScript projects.",
  },
  {
    id: "3",
    title: "Strong Action Verb Usage",
    description: "Your experience section starts with impactful action verbs",
    status: "success",
    category: "Content",
    suggestion: "Excellent use of verbs like 'Spearheaded', 'Architected', and 'Optimized'. Continue this pattern throughout. Consider varying your verbs more - you use 'Developed' 3 times. Alternatives: Engineered, Built, Crafted, Constructed, Implemented.",
  },
  {
    id: "4",
    title: "Consistent Date Formatting",
    description: "All dates follow the MM/YYYY format consistently throughout",
    status: "success",
    category: "Formatting",
    suggestion: "Your date formatting is ATS-friendly and consistent. The 'Month Year - Month Year' format (e.g., 'Jan 2022 - Present') is ideal for both human readers and applicant tracking systems.",
  },
  {
    id: "5",
    title: "Missing Professional Summary",
    description: "A professional summary section would help recruiters quickly understand your value proposition",
    status: "info",
    category: "Structure",
    suggestion: "Add a 3-4 sentence professional summary at the top of your CV. Example: 'Results-driven Frontend Developer with 5+ years of experience building scalable React applications. Proven track record of improving application performance by 40% and leading cross-functional teams of 8+ engineers. Passionate about clean code, accessibility, and user-centric design.'",
    detailedFeedback: "Studies show recruiters spend an average of 7.4 seconds on initial CV screening. A well-crafted summary increases the likelihood of full CV review by 60%. Your summary should include: years of experience, key technical strengths, 1-2 measurable achievements, and career focus area.",
  },
  {
    id: "6",
    title: "Too Many Bullet Points",
    description: "Work Experience #2 has 7 bullet points which may overwhelm readers",
    status: "warning",
    category: "Structure",
    suggestion: "Reduce your second work experience entry from 7 to 3-4 bullet points. Keep only the most impactful achievements that align with the target role. Remove or consolidate: routine task descriptions, redundant responsibilities, and achievements without metrics. Prioritize bullets that demonstrate leadership, technical complexity, or business impact.",
    detailedFeedback: "Optimal bullet point count per role: 3-5 for recent positions (last 5 years), 2-3 for older positions. Your most recent role has 4 bullets (good), but your second role has 7 (excessive). Consider combining related achievements or removing the least relevant ones.",
  },
]

const mockHistory: ScanHistoryItem[] = [
  { id: "1", jobTitle: "Senior Frontend Developer", company: "Tech Corp", date: "Today, 2:34 PM", score: 76 },
  { id: "2", jobTitle: "Full Stack Engineer", company: "StartupXYZ", date: "Yesterday", score: 82 },
  { id: "3", jobTitle: "React Developer", company: "Digital Agency", date: "May 18, 2026", score: 68 },
]

const navItems = [
  { id: "score", label: "Match Score", icon: Scan, sectionId: "score-section" },
  { id: "categories", label: "Category Breakdown", icon: LayoutList, sectionId: "categories-section" },
  { id: "keywords", label: "Keywords Match", icon: Target, sectionId: "keywords-section" },
  { id: "recommendations", label: "AI Recommendations", icon: MessageSquareText, sectionId: "feedback-section" },
]

// Custom logo URL
const customLogoUrl = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/acetone-2026520-16013-979%20%281%29-0nAx3Iqr392IwkaMtaRw7trnKYSAtR.png"

export function CVCheckApp() {
  const [appState, setAppState] = useState<AppState>("landing")
  const [showAuthOverlay, setShowAuthOverlay] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup")
  const [user, setUser] = useState<UserData | null>(null)
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [jobFile, setJobFile] = useState<File | null>(null)
  const [jobText, setJobText] = useState("")
  const [overallScore, setOverallScore] = useState(0)
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | undefined>()
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([])
  const [activeNavId, setActiveNavId] = useState<string | null>(null)
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false)
  const [preferencesTab, setPreferencesTab] = useState<"profile" | "settings">("profile")
  const [uploadedCvId, setUploadedCvId] = useState<number | null>(null)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [categories, setCategories] = useState<CategoryScore[]>(mockCategories)
  const [feedback, setFeedback] = useState<FeedbackItem[]>(mockFeedback)
  
  // Refs for scroll navigation
  const scoreSectionRef = useRef<HTMLDivElement>(null)
  const categoriesSectionRef = useRef<HTMLDivElement>(null)
  const keywordsSectionRef = useRef<HTMLDivElement>(null)
  const feedbackSectionRef = useRef<HTMLDivElement>(null)
  
  const scrollToSection = (sectionId: string, navId: string) => {
    setActiveNavId(navId)
    const refs: Record<string, React.RefObject<HTMLDivElement | null>> = {
      "score-section": scoreSectionRef,
      "categories-section": categoriesSectionRef,
      "keywords-section": keywordsSectionRef,
      "feedback-section": feedbackSectionRef,
    }
    const ref = refs[sectionId]
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }
  
  const handleAuth = (authenticatedUser: UserData) => {
    setUser(authenticatedUser)
    setShowAuthOverlay(false)
    setAppState("upload")
  }
  
  const handleLogout = () => {
    apiLogout() // Clear token from localStorage
    setUser(null)
    setAppState("landing")
    setCvFile(null)
    setJobFile(null)
    setJobText("")
    setScanHistory([])
    setUploadedCvId(null)
    setAnalysisError(null)
  }
  
  const handleAnalyze = async () => {
    if (!cvFile || !uploadedCvId || (!jobFile && !jobText)) return
    
    setAppState("loading")
    setAnalysisError(null)
    
    try {
      // Get job description text - either from pasted text or read from file
      let jobDescriptionText = jobText
      if (jobFile && !jobText) {
        // If user uploaded a file but didn't paste text, read the file content
        jobDescriptionText = await jobFile.text()
      }
      
      // Call the real API to submit evaluation
      const evaluation = await submitEvaluation(uploadedCvId, jobDescriptionText)
      
      // Check if evaluation completed successfully
      if (evaluation.status === "COMPLETED" && evaluation.aiResult) {
        // Parse the AI result (it's a JSON string)
        const aiResult = parseAIResult(evaluation.aiResult)
        
        // Set the overall score
        setOverallScore(aiResult.matchScore)
        
        // Convert AI result to feedback items for display
        const newFeedback: FeedbackItem[] = []
        
        // Add strengths as success feedback
        aiResult.strengths.forEach((strength, index) => {
          newFeedback.push({
            id: `strength-${index}`,
            title: "Strength Identified",
            description: strength,
            status: "success",
            category: "Content",
            suggestion: strength,
          })
        })
        
        // Add gaps as warning/error feedback
        aiResult.gaps.forEach((gap, index) => {
          newFeedback.push({
            id: `gap-${index}`,
            title: "Area for Improvement",
            description: gap,
            status: "warning",
            category: "Skills",
            suggestion: gap,
          })
        })
        
        // Add recommendation as info
        if (aiResult.recommendation) {
          newFeedback.push({
            id: "recommendation",
            title: "AI Recommendation",
            description: aiResult.recommendation,
            status: "info",
            category: "Overall",
            suggestion: aiResult.recommendation,
            detailedFeedback: aiResult.summary,
          })
        }
        
        setFeedback(newFeedback.length > 0 ? newFeedback : mockFeedback)
        
        // Add to history
        const newHistoryItem: ScanHistoryItem = {
          id: evaluation.id.toString(),
          jobTitle: evaluation.cvFilename || "CV Analysis",
          company: "Job Match Analysis",
          date: new Date(evaluation.createdAt).toLocaleString(),
          score: aiResult.matchScore,
        }
        setScanHistory((prev) => [newHistoryItem, ...prev])
        setSelectedHistoryId(newHistoryItem.id)
        
        setAppState("results")
      } else if (evaluation.status === "FAILED") {
        let backendError: string | null = null
        try {
          const parsed = JSON.parse(evaluation.aiResult)
          if (parsed && typeof parsed === "object" && "error" in parsed) {
            backendError = (parsed as { error?: string }).error || null
          }
        } catch {
          backendError = null
        }

        throw new Error(
          backendError
            ? `Evaluation failed: ${backendError}`
            : "Evaluation failed. Please try again."
        )
      } else if (evaluation.status === "PENDING") {
        // Handle pending status - poll or show message
        throw new Error("Evaluation is still processing. Please wait and try again.")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setAnalysisError(errorMessage)
      setAppState("upload")
    }
  }
  
  const handleNewScan = () => {
    setCvFile(null)
    setJobFile(null)
    setJobText("")
    setUploadedCvId(null)
    setAnalysisError(null)
    setAppState("upload")
  }
  
  const handleCTAClick = () => {
    setAuthMode("signup")
    setShowAuthOverlay(true)
  }
  
  const handleLoginClick = () => {
    setAuthMode("login")
    setShowAuthOverlay(true)
  }
  
  const handleSignupClick = () => {
    setAuthMode("signup")
    setShowAuthOverlay(true)
  }
  
  const openPreferences = (tab: "profile" | "settings") => {
    setPreferencesTab(tab)
    setIsPreferencesOpen(true)
  }
  
  const canAnalyze = cvFile && uploadedCvId && (jobFile || jobText.trim().length > 50)

  // Logo Component with custom image - transparent background with neon glow
  const Logo = ({ className = "" }: { className?: string }) => (
    <div className={cn("flex items-center gap-2", className)}>
      <div 
        className="relative w-10 h-10 flex items-center justify-center -translate-y-[2px]"
        style={{
          filter: "drop-shadow(0 0 8px rgba(139, 92, 246, 0.8)) drop-shadow(0 0 20px rgba(139, 92, 246, 0.5)) drop-shadow(0 0 40px rgba(139, 92, 246, 0.3))"
        }}
      >
        <img 
          src={customLogoUrl} 
          alt="CV Check Logo" 
          className="w-10 h-10 object-contain mix-blend-lighten -translate-y-[2px]"
        />
      </div>
      <span className="font-bold text-lg tracking-tight text-white leading-none">CV Check</span>
    </div>
  )

  // User Avatar Dropdown Component
  const UserAvatarDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-white/5">
          <Avatar className="h-8 w-8 border border-violet-500/30">
            <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white text-xs font-medium">
              {user?.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <ChevronDown className="w-4 h-4 text-white/60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-card border-border">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-white">{user?.name}</p>
            <p className="text-xs leading-none text-white/60">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem 
          onClick={() => openPreferences("profile")}
          className="text-white/80 focus:bg-white/5 focus:text-white cursor-pointer"
        >
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => openPreferences("settings")}
          className="text-white/80 focus:bg-white/5 focus:text-white cursor-pointer"
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem onClick={handleLogout} className="text-red-400 focus:text-red-400 focus:bg-red-500/10">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  // Landing State
  if (appState === "landing") {
    return (
      <TooltipProvider>
        <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
          {/* Background glow effects - Intense dramatic purple */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/30 rounded-full blur-[150px] animate-glow-pulse" />
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-purple-500/25 rounded-full blur-[120px] animate-glow-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute bottom-1/4 left-1/3 w-[450px] h-[450px] bg-violet-500/20 rounded-full blur-[130px] animate-glow-pulse" style={{ animationDelay: "2s" }} />
          <div className="absolute bottom-0 right-1/3 w-[350px] h-[350px] bg-purple-600/20 rounded-full blur-[100px] animate-glow-pulse" style={{ animationDelay: "3s" }} />
          
          {/* Landing Header */}
          <header className="relative z-10 border-b border-white/5 bg-background/80 backdrop-blur-xl">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
              <Logo />
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={handleLoginClick} className="text-white/70 hover:text-white hover:bg-white/5">
                  Log In
                </Button>
                <Button size="sm" onClick={handleSignupClick} className="bg-violet-600 hover:bg-violet-500 text-white border-0">
                  Sign Up
                </Button>
              </div>
            </div>
          </header>
          
          {/* Landing Hero */}
          <main className="flex-1 flex items-center relative z-10">
            <div className="container mx-auto px-4 py-20">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                {/* Left: Text Content */}
                <div className="text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm mb-8">
                    <Sparkles className="w-4 h-4" />
                    AI-Powered Analysis
                  </div>
                  
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-white leading-[1.1]">
                    <span className="text-glow">Boost your</span><br />
                    <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-violet-400 bg-clip-text text-transparent animate-gradient">
                      job match
                    </span>
                    <br />
                    <span className="text-glow">with AI.</span>
                  </h1>
                  
                  <p className="text-lg text-white/60 mb-10 max-w-lg leading-relaxed">
                    Elevate your CV&apos;s visibility effortlessly with AI, where smart technology meets user-friendly resume optimization tools.
                  </p>
                  
                  <Button 
                    size="lg" 
                    className="px-8 py-6 text-base font-semibold bg-white text-background hover:bg-white/90 rounded-full group"
                    onClick={handleCTAClick}
                  >
                    Start for free
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
                
                {/* Right: Mock Dashboard Preview */}
                <div className="relative lg:pl-8">
                  <div className="relative">
                    {/* Main dashboard card */}
                    <div className="bento-card p-6 space-y-6">
                      {/* Header */}
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-500/80" />
                          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                          <div className="w-3 h-3 rounded-full bg-green-500/80" />
                        </div>
                        <span className="text-xs text-white/40 ml-2">CV Analysis Dashboard</span>
                      </div>
                      
                      {/* Content */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bento-card p-4">
                          <p className="text-xs text-white/40 mb-2">Match Score</p>
                          <div className="flex items-end gap-2">
                            <span className="text-4xl font-bold text-emerald-400">76</span>
                            <span className="text-white/40 text-sm pb-1">%</span>
                          </div>
                          <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full w-[76%] bg-gradient-to-r from-violet-500 to-emerald-400 rounded-full" />
                          </div>
                        </div>
                        
                        <div className="bento-card p-4">
                          <p className="text-xs text-white/40 mb-2">Keywords Found</p>
                          <div className="flex items-end gap-2">
                            <span className="text-4xl font-bold text-violet-400">23</span>
                            <span className="text-white/40 text-sm pb-1">/30</span>
                          </div>
                          <div className="flex gap-1 mt-3">
                            {[...Array(10)].map((_, i) => (
                              <div key={i} className={cn("flex-1 h-2 rounded-full", i < 8 ? "bg-violet-500" : "bg-white/10")} />
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Categories preview */}
                      <div className="space-y-3">
                        {["Formatting", "Content", "Structure"].map((cat, i) => (
                          <div key={cat} className="flex items-center justify-between">
                            <span className="text-sm text-white/60">{cat}</span>
                            <div className="flex items-center gap-3">
                              <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full" 
                                  style={{ width: `${85 - i * 8}%` }}
                                />
                              </div>
                              <span className="text-sm text-white/80 w-10 text-right">{85 - i * 8}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Floating card - top right */}
                    <div className="absolute -top-4 -right-4 bento-card p-4 w-48">
                      <div className="flex items-center gap-2 mb-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs text-white/60">ATS Compatible</span>
                      </div>
                      <p className="text-sm text-white/80">Your CV passes ATS filters</p>
                    </div>
                    
                    {/* Floating card - bottom left */}
                    <div className="absolute -bottom-4 -left-4 bento-card p-4 w-56">
                      <p className="text-xs text-violet-400 font-medium mb-1">AI Suggestion</p>
                      <p className="text-sm text-white/70">Add 3 more keywords to improve match by 12%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
          
          {/* Auth Overlay */}
          {showAuthOverlay && (
            <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-xl flex items-center justify-center p-4">
              {/* Dramatic glow effects for auth overlay */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-violet-600/30 rounded-full blur-[150px] animate-glow-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-purple-500/25 rounded-full blur-[120px] animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[180px] animate-glow-pulse" style={{ animationDelay: "0.5s" }} />
              </div>
              
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -top-2 -right-2 z-10 rounded-full bg-card border border-border shadow-lg hover:bg-white/10"
                  onClick={() => setShowAuthOverlay(false)}
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
                <AuthForm onAuth={handleAuth} defaultTab={authMode} />
              </div>
            </div>
          )}
        </div>
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
        {/* Background glow effects - Intense dramatic purple/cyan for all states */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/25 rounded-full blur-[150px] animate-glow-pulse" />
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[120px] animate-glow-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute bottom-1/4 left-1/3 w-[450px] h-[450px] bg-cyan-500/15 rounded-full blur-[130px] animate-glow-pulse" style={{ animationDelay: "2s" }} />
          <div className="absolute bottom-0 right-1/3 w-[350px] h-[350px] bg-purple-600/20 rounded-full blur-[100px] animate-glow-pulse" style={{ animationDelay: "3s" }} />
        </div>
        
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-white/5 bg-background/60 backdrop-blur-xl relative">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Logo />
            
            {/* Navigation - Only show in results state */}
            {appState === "results" && (
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "transition-all duration-300",
                          activeNavId === item.id 
                            ? "nav-active text-violet-400" 
                            : "nav-inactive hover:text-white/60 hover:bg-white/5"
                        )}
                        onClick={() => scrollToSection(item.sectionId, item.id)}
                      >
                        <item.icon className="w-4 h-4 mr-2" />
                        {item.label}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-card border-border">
                      <p>Jump to {item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </nav>
            )}
            
            {/* User Avatar Dropdown */}
            <UserAvatarDropdown />
          </div>
        </header>
        
        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Sidebar - Only show after first scan */}
          {appState === "results" && scanHistory.length > 0 && (
            <aside className="hidden lg:flex w-72 border-r border-white/5 flex-col bg-sidebar/80 backdrop-blur-xl relative z-10">
              <div className="flex-1">
                <ScanHistory
                  items={scanHistory.length > 0 ? scanHistory : mockHistory}
                  selectedId={selectedHistoryId}
                  onSelect={setSelectedHistoryId}
                />
              </div>
              
              {/* Sidebar Footer */}
              <div className="border-t border-white/5 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="h-9 w-9 border border-violet-500/30">
                      <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white text-xs font-medium">
                        {user?.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate text-white">{user?.name}</p>
                      <p className="text-xs text-white/40 truncate">{user?.email}</p>
                    </div>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={handleLogout} className="text-white/40 hover:text-white hover:bg-white/5">
                        <LogOut className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-card border-border">
                      <p>Log out</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </aside>
          )}
          
          {/* Main Area */}
          <main className="flex-1 overflow-auto relative z-10">
            {/* Upload State */}
            {appState === "upload" && (
              <div className="container mx-auto px-4 py-12 max-w-5xl relative">
                {/* Additional glow spots behind upload cards */}
                <div className="absolute top-20 left-1/4 w-[350px] h-[350px] bg-violet-500/20 rounded-full blur-[120px] animate-glow-pulse pointer-events-none" />
                <div className="absolute top-40 right-1/4 w-[300px] h-[300px] bg-cyan-500/15 rounded-full blur-[100px] animate-glow-pulse pointer-events-none" style={{ animationDelay: "1.5s" }} />
                
                <div className="text-center mb-10 relative z-10">
                  <h1 className="text-3xl font-bold tracking-tight mb-3 text-white">
                    Analyze Your CV Match
                  </h1>
                  <p className="text-white/60 max-w-2xl mx-auto">
                    Upload your CV and a job description to get instant AI-powered feedback on formatting, keywords, and content improvements.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8 relative z-10">
                  <UploadZone
                    type="cv"
                    file={cvFile}
                    onFileChange={setCvFile}
                    onCvUploaded={setUploadedCvId}
                  />
                  <UploadZone
                    type="job"
                    file={jobFile}
                    text={jobText}
                    onFileChange={setJobFile}
                    onTextChange={setJobText}
                  />
                </div>
                
                <div className="flex justify-center relative z-10">
                  <Button
                    size="lg"
                    className="px-12 bg-violet-600 hover:bg-violet-500 text-white"
                    disabled={!canAnalyze}
                    onClick={handleAnalyze}
                  >
                    <Scan className="w-5 h-5 mr-2" />
                    Analyze My Match
                  </Button>
                </div>
                
                {!canAnalyze && (
                  <p className="text-center text-sm text-white/40 mt-4">
                    Please upload your CV and provide a job description (file or paste at least 50 characters)
                  </p>
                )}
                
                {/* Analysis Error Display */}
                {analysisError && (
                  <div className="flex items-center justify-center gap-2 p-4 mt-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 max-w-md mx-auto">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{analysisError}</span>
                  </div>
                )}
              </div>
            )}
            
            {/* Loading State */}
            {appState === "loading" && (
              <div className="container mx-auto px-4 py-12 relative">
                {/* Intense central glow for loading state */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/30 rounded-full blur-[180px] animate-glow-pulse pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[120px] animate-glow-pulse pointer-events-none" style={{ animationDelay: "0.5s" }} />
                
                <LoadingAnimation />
              </div>
            )}
            
            {/* Results State */}
            {appState === "results" && (
              <ScrollArea className="h-[calc(100vh-4rem)]">
                <div className="container mx-auto px-4 py-8 max-w-4xl relative">
                  {/* Atmospheric glow spots behind the dashboard */}
                  <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-violet-600/20 rounded-full blur-[150px] animate-glow-pulse pointer-events-none" />
                  <div className="absolute top-1/4 right-0 w-[350px] h-[350px] bg-purple-500/15 rounded-full blur-[120px] animate-glow-pulse pointer-events-none" style={{ animationDelay: "1s" }} />
                  <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-cyan-500/15 rounded-full blur-[100px] animate-glow-pulse pointer-events-none" style={{ animationDelay: "2s" }} />
                  <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-violet-500/20 rounded-full blur-[130px] animate-glow-pulse pointer-events-none" style={{ animationDelay: "1.5s" }} />
                  
                  {/* New Scan Button */}
                  <div className="flex justify-end mb-6 relative z-10">
                    <Button onClick={handleNewScan} variant="outline" className="border-white/10 text-white/70 hover:text-white hover:bg-white/5 hover:border-white/20">
                      <Plus className="w-4 h-4 mr-2" />
                      New Scan
                    </Button>
                  </div>
                  
                  {/* Score Section */}
                  <div ref={scoreSectionRef} id="score-section" className="scroll-mt-20 relative z-10">
                    <div className="bento-card flex flex-col md:flex-row items-center gap-8 mb-10 p-8">
                      <ScoreWidget score={overallScore} size="lg" label="Match Score" />
                      <div className="flex-1 text-center md:text-left">
                        <h2 className="text-2xl font-bold mb-2 text-white">
                          {overallScore >= 80
                            ? "Great Match!"
                            : overallScore >= 60
                            ? "Good Potential"
                            : "Needs Improvement"}
                        </h2>
                        <p className="text-white/60">
                          {overallScore >= 80
                            ? "Your CV is well-aligned with this job description. Focus on the minor improvements below."
                            : overallScore >= 60
                            ? "Your CV has good foundations but could be optimized to better match this role."
                            : "There are several areas where your CV could be improved to better match this job."}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Category Scores Section */}
                  <div ref={categoriesSectionRef} id="categories-section" className="mb-10 scroll-mt-20 relative z-10">
                    <CategoryScores categories={mockCategories} />
                  </div>
                  
                  {/* Keywords Match Section */}
                  <div ref={keywordsSectionRef} id="keywords-section" className="mb-10 scroll-mt-20 relative z-10">
                    <KeywordsMatch />
                  </div>
                  
                  {/* Detailed Feedback Section */}
                  <div ref={feedbackSectionRef} id="feedback-section" className="scroll-mt-20 relative z-10">
                    <h3 className="font-semibold text-lg mb-4 text-white">Detailed Feedback & AI Recommendations</h3>
                    <div className="space-y-4">
                      {mockFeedback.map((item) => (
                        <FeedbackCard key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            )}
          </main>
        </div>
        
        {/* Mobile Logout - shown when no sidebar */}
        {appState !== "results" && (
          <div className="lg:hidden fixed bottom-4 right-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleLogout} className="border-white/10 text-white/70 hover:text-white hover:bg-white/5">
                  <LogOut className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-card border-border">
                <p>Log out</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
        
        {/* Preferences Modal */}
        <PreferencesModal
          isOpen={isPreferencesOpen}
          onClose={() => setIsPreferencesOpen(false)}
          user={user}
          defaultTab={preferencesTab}
        />
      </div>
    </TooltipProvider>
  )
}
