"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

const loadingMessages = [
  "Scanning your CV...",
  "Analyzing formatting...",
  "Checking keyword matches...",
  "Evaluating content structure...",
  "Identifying improvement areas...",
  "Generating insights...",
]

export function LoadingAnimation() {
  const [messageIndex, setMessageIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length)
    }, 2000)
    
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev
        return prev + Math.random() * 10
      })
    }, 300)
    
    return () => {
      clearInterval(messageInterval)
      clearInterval(progressInterval)
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-20 relative">
      {/* Background dramatic glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 bg-violet-600/30 rounded-full blur-[150px] animate-glow-pulse" />
      </div>
      
      {/* Neural Network Animation */}
      <div className="relative w-48 h-48">
        {/* Glow background - more intense */}
        <div className="absolute inset-0 bg-violet-500/40 rounded-full blur-[80px] animate-glow-pulse" />
        <div className="absolute -inset-4 bg-purple-500/20 rounded-full blur-[60px] animate-glow-pulse" style={{ animationDelay: "1s" }} />
        
        {/* Outer rotating ring */}
        <div className="absolute inset-0 rounded-full border-4 border-dashed border-violet-400/40 animate-spin [animation-duration:8s]" />
        
        {/* Middle pulsing ring */}
        <div className="absolute inset-4 rounded-full border-2 border-violet-400/60 animate-pulse glow-violet" />
        
        {/* Inner gradient ring */}
        <div 
          className="absolute inset-8 rounded-full animate-pulse [animation-duration:1.5s]"
          style={{
            background: "linear-gradient(180deg, rgba(139, 92, 246, 0.5) 0%, rgba(139, 92, 246, 0.1) 100%)"
          }}
        />
        
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <svg 
              className="w-16 h-16 text-violet-400 animate-pulse" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
            >
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {/* Scanning line */}
            <div className="absolute -inset-2 overflow-hidden">
              <div className="h-0.5 bg-gradient-to-r from-transparent via-violet-400 to-transparent animate-scan" />
            </div>
          </div>
        </div>
        
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "absolute w-2 h-2 rounded-full bg-violet-500/60",
              "animate-float"
            )}
            style={{
              left: `${20 + i * 12}%`,
              top: `${30 + (i % 2) * 40}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2 + i * 0.2}s`,
            }}
          />
        ))}
      </div>
      
      {/* Progress bar */}
      <div className="w-64 space-y-4">
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-violet-600 to-purple-400 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center text-sm text-white/60 animate-pulse">
          {loadingMessages[messageIndex]}
        </p>
      </div>
    </div>
  )
}
