"use client"

import { FileText, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

export interface ScanHistoryItem {
  id: string
  jobTitle: string
  company?: string
  date: string
  score: number
}

interface ScanHistoryProps {
  items: ScanHistoryItem[]
  selectedId?: string
  onSelect: (id: string) => void
}

export function ScanHistory({ items, selectedId, onSelect }: ScanHistoryProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    if (score >= 60) return "text-amber-400 bg-amber-500/10 border-amber-500/20"
    return "text-red-400 bg-red-500/10 border-red-500/20"
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-white/5">
        <h3 className="font-semibold flex items-center gap-2 text-white">
          <Clock className="w-4 h-4 text-violet-400" />
          Scan History
        </h3>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={cn(
                "w-full text-left p-3 rounded-xl transition-all",
                selectedId === item.id
                  ? "bg-violet-500/10 border border-violet-500/20"
                  : "hover:bg-white/5 border border-transparent"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-white/5 rounded-lg border border-white/10">
                  <FileText className="w-4 h-4 text-white/40" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-white">{item.jobTitle}</p>
                  {item.company && (
                    <p className="text-xs text-white/40 truncate">
                      {item.company}
                    </p>
                  )}
                  <p className="text-xs text-white/30 mt-1">{item.date}</p>
                </div>
                <div className={cn("text-xs font-semibold px-2 py-0.5 rounded-full border", getScoreColor(item.score))}>
                  {item.score}%
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
