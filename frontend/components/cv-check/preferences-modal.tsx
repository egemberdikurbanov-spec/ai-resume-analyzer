"use client"

import { useState } from "react"
import { X, User, Settings, Bell, Brain, Lock, Scan, Target, ArrowLeft, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PreferencesModalProps {
  isOpen: boolean
  onClose: () => void
  user: { name: string; email: string } | null
  defaultTab?: "profile" | "settings"
}

export function PreferencesModal({ isOpen, onClose, user, defaultTab = "profile" }: PreferencesModalProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultTab)
  const [fullName, setFullName] = useState(user?.name || "")
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [aiAnalyticsLevel, setAiAnalyticsLevel] = useState(true)
  
  // Password change state
  const [showPasswordView, setShowPasswordView] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // Mock stats
  const totalScans = 28
  const averageScore = 79
  const profileCompletion = 85
  
  const handlePasswordSave = () => {
    // Mock save - in real app would validate and submit
    if (newPassword !== confirmPassword) {
      return
    }
    // Reset and close password view
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setShowPasswordView(false)
  }
  
  const handlePasswordCancel = () => {
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setShowPasswordView(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay with blur */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-xl"
        onClick={onClose}
      />
      
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-violet-600/25 rounded-full blur-[150px] animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-purple-500/20 rounded-full blur-[120px] animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[180px] animate-glow-pulse" style={{ animationDelay: "0.5s" }} />
      </div>
      
      {/* Modal Content */}
      <div 
        className={cn(
          "relative w-full max-w-3xl bg-[#111115]/90 backdrop-blur-md rounded-2xl",
          "border border-white/10",
          "shadow-[0_0_80px_rgba(139,92,246,0.15),0_0_30px_rgba(139,92,246,0.1)]"
        )}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-white/60 hover:text-white hover:bg-white/5 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex">
          {/* Quick Stats Sidebar */}
          <div className="w-56 border-r border-white/5 p-6 flex flex-col">
            <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-6">Quick Stats</h3>
            
            <div className="space-y-6 flex-1">
              {/* Total Scans */}
              <div className="bento-card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-violet-500/10">
                    <Scan className="w-4 h-4 text-violet-400" />
                  </div>
                  <span className="text-xs text-white/50">Total Scans</span>
                </div>
                <p className="text-3xl font-bold text-white">{totalScans}</p>
              </div>
              
              {/* Average Match Score */}
              <div className="bento-card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <Target className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-xs text-white/50">Avg. Score</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <p className="text-3xl font-bold text-emerald-400">{averageScore}</p>
                  <span className="text-white/40">%</span>
                </div>
              </div>
            </div>
            
            {/* Member Since */}
            <div className="pt-6 border-t border-white/5 mt-auto">
              <p className="text-xs text-white/40">Member since</p>
              <p className="text-sm text-white/70">May 2026</p>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 p-6">
            {/* Password Change View */}
            {showPasswordView ? (
              <div className="space-y-6">
                {/* Header with back button */}
                <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                  <button
                    onClick={handlePasswordCancel}
                    className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Change Password</h2>
                    <p className="text-sm text-white/40">Update your account password</p>
                  </div>
                </div>
                
                {/* Password Form */}
                <div className="space-y-5">
                  {/* Current Password */}
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-sm text-white/70">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet-500/50 focus:ring-violet-500/20 pr-10"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  {/* New Password */}
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-sm text-white/70">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet-500/50 focus:ring-violet-500/20 pr-10"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  {/* Confirm New Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm text-white/70">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={cn(
                          "bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet-500/50 focus:ring-violet-500/20 pr-10",
                          confirmPassword && newPassword !== confirmPassword && "border-red-500/50 focus:border-red-500/50"
                        )}
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-xs text-red-400">Passwords do not match</p>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-white/5">
                  <Button
                    onClick={handlePasswordCancel}
                    variant="outline"
                    className="flex-1 border-white/10 text-white/70 hover:text-white hover:bg-white/5 hover:border-white/20"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handlePasswordSave}
                    disabled={!currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                    className={cn(
                      "flex-1 bg-violet-600 text-white transition-all",
                      "hover:bg-violet-500 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]",
                      "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                    )}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full bg-white/5 border border-white/5 p-1 mb-6">
                <TabsTrigger 
                  value="profile" 
                  className="flex-1 data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-300 text-white/60"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger 
                  value="settings" 
                  className="flex-1 data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-300 text-white/60"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Account Settings
                </TabsTrigger>
              </TabsList>
              
              {/* Profile Tab */}
              <TabsContent value="profile" className="mt-0">
                <div className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-6">
                    <Avatar className="h-20 w-20 border-2 border-violet-500/30 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                      <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white text-xl font-semibold">
                        {user?.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-xl font-semibold text-white">{user?.name}</h2>
                      <p className="text-sm text-white/50">{user?.email}</p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="mt-2 h-8 text-xs text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 px-0"
                      >
                        Change avatar
                      </Button>
                    </div>
                  </div>
                  
                  {/* Profile Completion */}
                  <div className="bento-card p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-white/70">Profile Completion</span>
                      <span className="text-sm font-medium text-violet-400">{profileCompletion}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                        style={{ width: `${profileCompletion}%` }}
                      />
                    </div>
                    <p className="text-xs text-white/40 mt-2">Complete your profile to unlock advanced AI features</p>
                  </div>
                  
                  {/* Editable Fields */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-sm text-white/70">Full Name</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet-500/50 focus:ring-violet-500/20"
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm text-white/70">Email Address</Label>
                      <Input
                        id="email"
                        value={user?.email || ""}
                        disabled
                        className="bg-white/5 border-white/10 text-white/50 cursor-not-allowed"
                      />
                      <p className="text-xs text-white/40">Contact support to change your email address</p>
                    </div>
                  </div>
                  
                  {/* Save Button */}
                  <div className="pt-4 border-t border-white/5">
                    <Button className="bg-violet-600 hover:bg-violet-500 text-white">
                      Save Changes
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              {/* Settings Tab */}
              <TabsContent value="settings" className="mt-0">
                <div className="space-y-6">
                  {/* Notification Settings */}
                  <div>
                    <h3 className="text-sm font-medium text-white mb-4">Notifications</h3>
                    <div className="space-y-4">
                      <div className="bento-card p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-violet-500/10">
                            <Bell className="w-4 h-4 text-violet-400" />
                          </div>
                          <div>
                            <p className="text-sm text-white">Email Notifications</p>
                            <p className="text-xs text-white/40">Receive updates about your CV scans</p>
                          </div>
                        </div>
                        <Switch
                          checked={emailNotifications}
                          onCheckedChange={setEmailNotifications}
                          className="data-[state=checked]:bg-violet-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* AI Settings */}
                  <div>
                    <h3 className="text-sm font-medium text-white mb-4">AI Preferences</h3>
                    <div className="space-y-4">
                      <div className="bento-card p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-cyan-500/10">
                            <Brain className="w-4 h-4 text-cyan-400" />
                          </div>
                          <div>
                            <p className="text-sm text-white">Advanced AI Analytics</p>
                            <p className="text-xs text-white/40">Enable deep learning analysis for better insights</p>
                          </div>
                        </div>
                        <Switch
                          checked={aiAnalyticsLevel}
                          onCheckedChange={setAiAnalyticsLevel}
                          className="data-[state=checked]:bg-cyan-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Security */}
                  <div>
                    <h3 className="text-sm font-medium text-white mb-4">Security</h3>
                    <div className="bento-card p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-amber-500/10">
                          <Lock className="w-4 h-4 text-amber-400" />
                        </div>
                        <div>
                          <p className="text-sm text-white">Password</p>
                          <p className="text-xs text-white/40">Last changed 30 days ago</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowPasswordView(true)}
                        className="w-full border-white/10 text-white/70 hover:text-white hover:bg-white/5 hover:border-white/20"
                      >
                        Change Password
                      </Button>
                    </div>
                  </div>
                  
                  {/* Danger Zone */}
                  <div className="pt-4 border-t border-white/5">
                    <h3 className="text-sm font-medium text-red-400 mb-4">Danger Zone</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-red-500/30 text-red-400 hover:text-red-300 hover:bg-red-500/10 hover:border-red-500/50"
                    >
                      Delete Account
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
