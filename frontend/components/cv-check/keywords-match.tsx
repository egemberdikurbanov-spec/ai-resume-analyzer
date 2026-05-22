"use client"

import { Check, X, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface KeywordItem {
  keyword: string
  found: boolean
  importance: "high" | "medium" | "low"
  occurrencesInJD: number
  occurrencesInCV: number
}

const mockKeywords: KeywordItem[] = [
  { keyword: "React", found: true, importance: "high", occurrencesInJD: 5, occurrencesInCV: 3 },
  { keyword: "TypeScript", found: false, importance: "high", occurrencesInJD: 4, occurrencesInCV: 0 },
  { keyword: "JavaScript", found: true, importance: "high", occurrencesInJD: 3, occurrencesInCV: 6 },
  { keyword: "CI/CD", found: false, importance: "high", occurrencesInJD: 3, occurrencesInCV: 0 },
  { keyword: "Node.js", found: true, importance: "medium", occurrencesInJD: 2, occurrencesInCV: 2 },
  { keyword: "Agile", found: false, importance: "medium", occurrencesInJD: 2, occurrencesInCV: 0 },
  { keyword: "Scrum", found: false, importance: "medium", occurrencesInJD: 2, occurrencesInCV: 0 },
  { keyword: "REST API", found: true, importance: "medium", occurrencesInJD: 2, occurrencesInCV: 1 },
  { keyword: "Git", found: true, importance: "medium", occurrencesInJD: 1, occurrencesInCV: 2 },
  { keyword: "Testing", found: true, importance: "medium", occurrencesInJD: 2, occurrencesInCV: 1 },
  { keyword: "AWS", found: false, importance: "low", occurrencesInJD: 1, occurrencesInCV: 0 },
  { keyword: "Docker", found: false, importance: "low", occurrencesInJD: 1, occurrencesInCV: 0 },
]

const criticalMissing = mockKeywords.filter(k => !k.found && k.importance === "high")
const otherMissing = mockKeywords.filter(k => !k.found && k.importance !== "high")
const foundKeywords = mockKeywords.filter(k => k.found)

export function KeywordsMatch() {
  const matchRate = Math.round((foundKeywords.length / mockKeywords.length) * 100)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg text-white">Keywords Match</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/60">Match Rate:</span>
          <span className={cn(
            "text-lg font-bold",
            matchRate >= 70 ? "text-emerald-400" : matchRate >= 50 ? "text-amber-400" : "text-red-400"
          )}>
            {matchRate}%
          </span>
        </div>
      </div>
      
      {/* Critical Missing Keywords */}
      {criticalMissing.length > 0 && (
        <div className="bento-card p-5 border-red-500/20" style={{ boxShadow: "0 0 40px rgba(248, 113, 113, 0.1)" }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20">
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Critical Missing Keywords</h4>
              <p className="text-xs text-white/50">These high-priority keywords are missing from your CV</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {criticalMissing.map((item) => (
              <div
                key={item.keyword}
                className="flex items-center justify-between p-3 bg-red-500/5 rounded-lg border border-red-500/10"
              >
                <div className="flex items-center gap-2">
                  <X className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-medium text-white">{item.keyword}</span>
                </div>
                <span className="text-xs text-red-400/80">{item.occurrencesInJD}x in JD</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-white/5 rounded-lg">
            <p className="text-xs text-violet-400 font-medium mb-1">Quick Fix Suggestion</p>
            <p className="text-sm text-white/70">
              Add these keywords to your Technical Skills section or incorporate them naturally into your work experience descriptions.
            </p>
          </div>
        </div>
      )}
      
      {/* Other Missing Keywords */}
      {otherMissing.length > 0 && (
        <div className="bento-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <h4 className="font-medium text-white/80">Other Missing Keywords</h4>
            <span className="text-xs text-white/40">({otherMissing.length} keywords)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {otherMissing.map((item) => (
              <div
                key={item.keyword}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 rounded-full border border-amber-500/20"
              >
                <X className="w-3 h-3 text-amber-400" />
                <span className="text-sm text-white/80">{item.keyword}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Found Keywords */}
      <div className="bento-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
            <Check className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h4 className="font-semibold text-white">Keywords Found</h4>
            <p className="text-xs text-white/50">{foundKeywords.length} keywords detected in your CV</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {foundKeywords.map((item) => (
            <div
              key={item.keyword}
              className="flex items-center justify-between p-3 bg-emerald-500/5 rounded-lg border border-emerald-500/10"
            >
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-white">{item.keyword}</span>
              </div>
              <span className="text-xs text-emerald-400/80">{item.occurrencesInCV}x</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bento-card p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">{foundKeywords.length}</p>
          <p className="text-xs text-white/50">Found</p>
        </div>
        <div className="bento-card p-4 text-center">
          <p className="text-2xl font-bold text-red-400">{criticalMissing.length}</p>
          <p className="text-xs text-white/50">Critical Missing</p>
        </div>
        <div className="bento-card p-4 text-center">
          <p className="text-2xl font-bold text-amber-400">{otherMissing.length}</p>
          <p className="text-xs text-white/50">Other Missing</p>
        </div>
      </div>
    </div>
  )
}
