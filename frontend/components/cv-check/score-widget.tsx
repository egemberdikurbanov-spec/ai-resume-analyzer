"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface ScoreWidgetProps {
  score: number
  size?: "sm" | "md" | "lg"
  label?: string
  className?: string
}

export function ScoreWidget({ score, size = "md", label = "Overall Score", className }: ScoreWidgetProps) {
  const [animatedScore, setAnimatedScore] = useState(0)
  
  const sizes = {
    sm: { width: 120, stroke: 8, fontSize: "text-2xl" },
    md: { width: 180, stroke: 10, fontSize: "text-4xl" },
    lg: { width: 240, stroke: 12, fontSize: "text-5xl" },
  }
  
  const { width, stroke, fontSize } = sizes[size]
  const radius = (width - stroke) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (animatedScore / 100) * circumference
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score)
    }, 100)
    return () => clearTimeout(timer)
  }, [score])
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400"
    if (score >= 60) return "text-amber-400"
    return "text-red-400"
  }
  
  const getStrokeColor = (score: number) => {
    if (score >= 80) return "url(#gradient-success)"
    if (score >= 60) return "url(#gradient-warning)"
    return "url(#gradient-error)"
  }

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative" style={{ width, height: width }}>
        {/* Glow effect */}
        <div 
          className="absolute inset-0 rounded-full animate-glow-pulse"
          style={{
            background: animatedScore >= 80 
              ? "radial-gradient(circle, rgba(52, 211, 153, 0.2) 0%, transparent 70%)"
              : animatedScore >= 60
              ? "radial-gradient(circle, rgba(251, 191, 36, 0.2) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(248, 113, 113, 0.2) 0%, transparent 70%)"
          }}
        />
        <svg
          className="transform -rotate-90"
          width={width}
          height={width}
        >
          <defs>
            <linearGradient id="gradient-success" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
            <linearGradient id="gradient-warning" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
            <linearGradient id="gradient-error" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#f87171" />
            </linearGradient>
          </defs>
          <circle
            className="text-white/5"
            strokeWidth={stroke}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={width / 2}
            cy={width / 2}
          />
          <circle
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke={getStrokeColor(animatedScore)}
            fill="transparent"
            r={radius}
            cx={width / 2}
            cy={width / 2}
            style={{ transition: "stroke-dashoffset 1s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn(fontSize, "font-bold", getScoreColor(animatedScore))}>
            {Math.round(animatedScore)}%
          </span>
        </div>
      </div>
      <span className="text-sm text-white/60 font-medium">{label}</span>
    </div>
  )
}
