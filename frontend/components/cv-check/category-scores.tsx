"use client"

import { CheckCircle2, AlertCircle, FileText, Layout, Target, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CategoryScore {
  id: string
  name: string
  score: number
  issues: number
  icon: "formatting" | "content" | "structure" | "skills"
}

interface CategoryScoresProps {
  categories: CategoryScore[]
  onCategoryClick?: (id: string) => void
}

const iconMap = {
  formatting: Layout,
  content: FileText,
  structure: Target,
  skills: MessageSquare,
}

export function CategoryScores({ categories, onCategoryClick }: CategoryScoresProps) {
  const getStatusBadge = (score: number) => {
    if (score >= 80) {
      return (
        <span className="flex items-center gap-1 text-xs font-medium text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Good
        </span>
      )
    }
    if (score >= 60) {
      return (
        <span className="flex items-center gap-1 text-xs font-medium text-amber-400">
          <AlertCircle className="w-3.5 h-3.5" />
          Needs Work
        </span>
      )
    }
    return (
      <span className="flex items-center gap-1 text-xs font-medium text-red-400">
        <AlertCircle className="w-3.5 h-3.5" />
        Critical
      </span>
    )
  }
  
  const getProgressColor = (score: number) => {
    if (score >= 80) return "from-violet-500 to-emerald-400"
    if (score >= 60) return "from-violet-500 to-amber-400"
    return "from-violet-500 to-red-400"
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-white">Category Breakdown</h3>
      <div className="grid gap-3">
        {categories.map((category) => {
          const Icon = iconMap[category.icon]
          return (
            <button
              key={category.id}
              onClick={() => onCategoryClick?.(category.id)}
              className="bento-card w-full text-left p-5 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                    <Icon className="w-4 h-4 text-violet-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-white">{category.name}</p>
                    {category.issues > 0 && (
                      <p className="text-xs text-white/40">
                        {category.issues} {category.issues === 1 ? "issue" : "issues"} found
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {getStatusBadge(category.score)}
                  <span className="text-xl font-bold text-white">{category.score}%</span>
                </div>
              </div>
              <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-500 bg-gradient-to-r",
                    getProgressColor(category.score)
                  )}
                  style={{ width: `${category.score}%` }}
                />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
