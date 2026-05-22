/**
 * API Service Layer
 * Handles all communication with the backend API at http://localhost:8080
 */

const API_BASE = "http://localhost:8080"

// =============================================================================
// Types
// =============================================================================

export interface AuthResponse {
  token: string
  name: string
  email: string
}

export interface ApiError {
  error: string
}

export interface CV {
  id: number
  originalFilename: string
  uploadedAt: string
}

export interface AIResult {
  matchScore: number
  summary: string
  strengths: string[]
  gaps: string[]
  recommendation: string
}

export interface Evaluation {
  id: number
  cvId: number
  cvFilename: string
  jobDescription: string
  status: "COMPLETED" | "PENDING" | "FAILED"
  aiResult: string // JSON string - must be parsed with JSON.parse()
  createdAt: string
  completedAt: string | null
}

export interface ParsedEvaluation extends Omit<Evaluation, "aiResult"> {
  aiResult: AIResult
}

// =============================================================================
// Auth Header Helper
// =============================================================================

function getAuthHeaders(includeContentType = false): HeadersInit {
  const token = localStorage.getItem("token")
  const headers: Record<string, string> = {}
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }
  
  if (includeContentType) {
    headers["Content-Type"] = "application/json"
  }
  
  return headers
}

// =============================================================================
// Response Handler
// =============================================================================

async function handleResponse<T>(response: Response): Promise<T> {
  // Handle 204 No Content (used by DELETE)
  if (response.status === 204) {
    return undefined as T
  }
  
  const data = await response.json()
  
  if (!response.ok) {
    // Handle 403 - token expired/missing
    if (response.status === 403) {
      localStorage.removeItem("token")
      localStorage.removeItem("userName")
      // Could trigger a redirect to login here if needed
    }
    throw new Error(data.error || "An unexpected error occurred")
  }
  
  return data as T
}

// =============================================================================
// Auth Endpoints
// =============================================================================

/**
 * Register a new user
 * POST /api/auth/register
 */
export async function register(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  })
  
  const data = await handleResponse<AuthResponse>(response)
  
  // Store token and user info on successful registration
  localStorage.setItem("token", data.token)
  localStorage.setItem("userName", data.name)
  localStorage.setItem("userEmail", data.email)
  
  return data
}

/**
 * Login an existing user
 * POST /api/auth/login
 */
export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  
  const data = await handleResponse<AuthResponse>(response)
  
  // Store token and user info on successful login
  localStorage.setItem("token", data.token)
  localStorage.setItem("userName", data.name)
  localStorage.setItem("userEmail", data.email)
  
  return data
}

/**
 * Logout the current user (client-side only)
 */
export function logout(): void {
  localStorage.removeItem("token")
  localStorage.removeItem("userName")
  localStorage.removeItem("userEmail")
}

/**
 * Check if user is currently authenticated
 */
export function isAuthenticated(): boolean {
  return !!localStorage.getItem("token")
}

/**
 * Get stored user info
 */
export function getStoredUser(): { name: string; email: string } | null {
  const name = localStorage.getItem("userName")
  const email = localStorage.getItem("userEmail")
  
  if (name && email) {
    return { name, email }
  }
  return null
}

// =============================================================================
// CV Endpoints
// =============================================================================

/**
 * Upload a CV file (PDF only)
 * POST /api/cvs
 * NOTE: Do not set Content-Type manually - browser handles it for FormData
 */
export async function uploadCV(file: File): Promise<CV> {
  const formData = new FormData()
  formData.append("file", file)
  
  const response = await fetch(`${API_BASE}/api/cvs`, {
    method: "POST",
    headers: getAuthHeaders(false), // No Content-Type for FormData
    body: formData,
  })
  
  return handleResponse<CV>(response)
}

/**
 * Get all CVs for the current user
 * GET /api/cvs
 */
export async function getCVs(): Promise<CV[]> {
  const response = await fetch(`${API_BASE}/api/cvs`, {
    method: "GET",
    headers: getAuthHeaders(),
  })
  
  return handleResponse<CV[]>(response)
}

/**
 * Delete a CV by ID
 * DELETE /api/cvs/{id}
 * Returns 204 No Content on success
 */
export async function deleteCV(cvId: number): Promise<void> {
  const response = await fetch(`${API_BASE}/api/cvs/${cvId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  })
  
  // handleResponse will return undefined for 204
  await handleResponse<void>(response)
}

// =============================================================================
// Evaluation Endpoints
// =============================================================================

/**
 * Submit a new evaluation request
 * POST /api/evaluations
 * NOTE: cvId must be a number, not a string
 */
export async function submitEvaluation(
  cvId: number | string,
  jobDescription: string
): Promise<Evaluation> {
  // Ensure cvId is a number
  const numericCvId = typeof cvId === "string" ? parseInt(cvId, 10) : cvId
  
  const response = await fetch(`${API_BASE}/api/evaluations`, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify({ 
      cvId: numericCvId, 
      jobDescription 
    }),
  })
  
  return handleResponse<Evaluation>(response)
}

/**
 * Get all evaluations for the current user
 * GET /api/evaluations
 */
export async function getEvaluations(): Promise<Evaluation[]> {
  const response = await fetch(`${API_BASE}/api/evaluations`, {
    method: "GET",
    headers: getAuthHeaders(),
  })
  
  return handleResponse<Evaluation[]>(response)
}

/**
 * Get a single evaluation by ID
 * GET /api/evaluations/{id}
 */
export async function getEvaluation(evaluationId: number): Promise<Evaluation> {
  const response = await fetch(`${API_BASE}/api/evaluations/${evaluationId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  })
  
  return handleResponse<Evaluation>(response)
}

// =============================================================================
// AI Result Parser
// =============================================================================

/**
 * Parse the aiResult string from an evaluation into a typed object
 * aiResult is returned as a JSON string from the API and must be parsed
 */
export function parseAIResult(aiResultString: string): AIResult {
  return JSON.parse(aiResultString) as AIResult
}

/**
 * Parse an evaluation and its aiResult in one step
 * Only parses if status is COMPLETED
 */
export function parseEvaluation(evaluation: Evaluation): ParsedEvaluation | null {
  if (evaluation.status !== "COMPLETED") {
    return null
  }
  
  return {
    ...evaluation,
    aiResult: parseAIResult(evaluation.aiResult),
  }
}

/**
 * Parse multiple evaluations, filtering to only completed ones
 */
export function parseEvaluations(evaluations: Evaluation[]): ParsedEvaluation[] {
  return evaluations
    .filter((ev) => ev.status === "COMPLETED")
    .map((ev) => ({
      ...ev,
      aiResult: parseAIResult(ev.aiResult),
    }))
}
