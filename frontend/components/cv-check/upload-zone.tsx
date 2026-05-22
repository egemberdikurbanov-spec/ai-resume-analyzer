"use client"

import { useCallback, useState } from "react"
import { Upload, FileText, X, Loader2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { uploadCV } from "@/lib/api"

interface UploadZoneProps {
  type: "cv" | "job"
  file: File | null
  text?: string
  onFileChange: (file: File | null) => void
  onTextChange?: (text: string) => void
  onCvUploaded?: (cvId: number) => void
}

export function UploadZone({ type, file, text, onFileChange, onTextChange, onCvUploaded }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  
  const config = {
    cv: {
      title: "Upload Your CV",
      description: "Drag & drop your CV here or click to browse",
      accept: ".pdf,.doc,.docx",
      icon: FileText,
    },
    job: {
      title: "Job Description",
      description: "Paste the job description or upload a file",
      accept: ".pdf,.doc,.docx,.txt",
      icon: Upload,
    },
  }
  
  const { title, description, accept, icon: Icon } = config[type]
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleUpload(droppedFile)
    }
  }, [type, onFileChange, onCvUploaded])
  
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleUpload(selectedFile)
    }
  }, [])
  
  const handleUpload = async (selectedFile: File) => {
    setIsUploading(true)
    setUploadError(null)
    
    // For CV uploads, use the real API
    if (type === "cv") {
      try {
        // Validate file type client-side
        if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
          setUploadError("Only PDF files are accepted")
          setIsUploading(false)
          return
        }
        
        // Validate file size (10MB max)
        if (selectedFile.size > 10 * 1024 * 1024) {
          setUploadError("File too large (max 10MB)")
          setIsUploading(false)
          return
        }
        
        const response = await uploadCV(selectedFile)
        onFileChange(selectedFile)
        onCvUploaded?.(response.id)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to upload CV"
        setUploadError(errorMessage)
      } finally {
        setIsUploading(false)
      }
    } else {
      // For job description files, just store locally (no API needed)
      onFileChange(selectedFile)
      setIsUploading(false)
    }
  }
  
  const removeFile = () => {
    onFileChange(null)
    setUploadError(null)
  }

  return (
    <div className="bento-card h-full">
      <div className="p-5 border-b border-white/5">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-white/50">{description}</p>
      </div>
      <div className="p-5 space-y-4">
        {/* Error message */}
        {uploadError && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}
        
        {file ? (
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-violet-500/10 rounded-xl border border-violet-500/20">
                <FileText className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <p className="text-sm font-medium truncate max-w-[180px] text-white">{file.name}</p>
                <p className="text-xs text-white/40">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/5"
              onClick={removeFile}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div
            className={cn(
              "relative border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer",
              isDragging
                ? "border-violet-500 bg-violet-500/10"
                : "border-white/10 hover:border-violet-500/50 hover:bg-white/5",
              isUploading && "pointer-events-none opacity-50"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept={accept}
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />
            <div className="flex flex-col items-center gap-3 text-center">
              {isUploading ? (
                <div className="p-3 bg-violet-500/10 rounded-xl">
                  <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
                </div>
              ) : (
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <Icon className="w-8 h-8 text-white/40" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-white">
                  {isUploading ? "Uploading..." : "Drop file here"}
                </p>
                <p className="text-xs text-white/40 mt-1">
                  {type === "cv" ? "PDF only (max 10MB)" : "PDF, DOC, DOCX (max 5MB)"}
                </p>
              </div>
              <Button variant="outline" size="sm" disabled={isUploading} className="border-white/10 text-white/70 hover:text-white hover:bg-white/5 hover:border-white/20">
                Choose File
              </Button>
            </div>
          </div>
        )}
        
        {type === "job" && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 text-white/40">Or paste text</span>
              </div>
            </div>
            <Textarea
              placeholder="Paste the job description here..."
              className="min-h-[120px] resize-none bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet-500 focus:ring-violet-500"
              value={text}
              onChange={(e) => onTextChange?.(e.target.value)}
            />
          </>
        )}
      </div>
    </div>
  )
}
