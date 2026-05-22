"use client"

import { CheckCircle2, AlertCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export interface FeedbackItem {
  id: string
  title: string
  description: string
  status: "success" | "warning" | "error" | "info"
  category: string
  suggestion?: string
  detailedFeedback?: string
}

interface FeedbackCardProps {
  item: FeedbackItem
}

export function FeedbackCard({ item }: FeedbackCardProps) {
  const statusConfig = {
    success: {
      icon: CheckCircle2,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      glowColor: "rgba(52, 211, 153, 0.1)",
    },
    warning: {
      icon: AlertCircle,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      glowColor: "rgba(251, 191, 36, 0.1)",
    },
    error: {
      icon: AlertCircle,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
      badgeClass: "bg-red-500/10 text-red-400 border-red-500/20",
      glowColor: "rgba(248, 113, 113, 0.1)",
    },
    info: {
      icon: Info,
      color: "text-violet-400",
      bgColor: "bg-violet-500/10",
      borderColor: "border-violet-500/20",
      badgeClass: "bg-violet-500/10 text-violet-400 border-violet-500/20",
      glowColor: "rgba(139, 92, 246, 0.1)",
    },
  }
  
  const config = statusConfig[item.status]
  const Icon = config.icon

  return (
    <div 
      className={cn(
        "bento-card transition-all duration-200 overflow-hidden",
        config.borderColor
      )}
      style={{ boxShadow: `0 0 40px ${config.glowColor}` }}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={cn("p-2.5 rounded-xl border", config.bgColor, config.borderColor)}>
              <Icon className={cn("w-5 h-5", config.color)} />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-base font-semibold leading-tight text-white">
                {item.title}
              </h4>
              <p className="text-sm text-white/60 leading-relaxed">{item.description}</p>
            </div>
          </div>
          <Badge variant="outline" className={cn("text-xs font-medium shrink-0", config.badgeClass)}>
            {item.category}
          </Badge>
        </div>
      </div>
      
      {/* Always show suggestion and detailed feedback - never hidden */}
      {(item.suggestion || item.detailedFeedback) && (
        <div className="px-5 pb-5 pt-0 space-y-3">
          {item.suggestion && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <p className="font-semibold text-xs text-violet-400 uppercase tracking-wider mb-2">
                AI Recommendation
              </p>
              <p className="text-sm text-white/80 leading-relaxed">{item.suggestion}</p>
            </div>
          )}
          {item.detailedFeedback && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <p className="font-semibold text-xs text-violet-400 uppercase tracking-wider mb-2">
                Detailed Analysis
              </p>
              <p className="text-sm text-white/80 leading-relaxed">{item.detailedFeedback}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
