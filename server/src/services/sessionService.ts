import { TwitchUser, TwitchTokenResponse } from './authService'

export interface UserSession {
  user: TwitchUser
  accessToken: string
  refreshToken?: string
  expiresAt: Date
  createdAt: Date
}

export class SessionService {
  private static sessions: Map<string, UserSession> = new Map()

  /**
   * Crée une nouvelle session utilisateur
   */
  static createSession(sessionId: string, user: TwitchUser, tokenData: TwitchTokenResponse): UserSession {
    const expiresAt = new Date(Date.now() + (tokenData.expires_in * 1000))
    const session: UserSession = {
      user,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt,
      createdAt: new Date()
    }

    this.sessions.set(sessionId, session)
    return session
  }

  /**
   * Récupère une session par ID
   */
  static getSession(sessionId: string): UserSession | null {
    return this.sessions.get(sessionId) || null
  }

  /**
   * Met à jour une session existante
   */
  static updateSession(sessionId: string, updates: Partial<UserSession>): UserSession | null {
    const session = this.sessions.get(sessionId)
    if (!session) return null

    const updatedSession = { ...session, ...updates }
    this.sessions.set(sessionId, updatedSession)
    return updatedSession
  }

  /**
   * Supprime une session
   */
  static destroySession(sessionId: string): boolean {
    return this.sessions.delete(sessionId)
  }

  /**
   * Vérifie si une session est valide (non expirée)
   */
  static isSessionValid(sessionId: string): boolean {
    const session = this.sessions.get(sessionId)
    if (!session) return false

    return new Date() < session.expiresAt
  }

  /**
   * Nettoie les sessions expirées
   */
  static cleanupExpiredSessions(): number {
    const now = new Date()
    let cleaned = 0

    for (const [sessionId, session] of this.sessions.entries()) {
      if (now >= session.expiresAt) {
        this.sessions.delete(sessionId)
        cleaned++
      }
    }

    return cleaned
  }

  /**
   * Obtient toutes les sessions actives
   */
  static getActiveSessions(): UserSession[] {
    const now = new Date()
    return Array.from(this.sessions.values()).filter(session => now < session.expiresAt)
  }

  /**
   * Génère un ID de session unique
   */
  static generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15) + 
           Date.now().toString(36)
  }
}

// Nettoyage automatique des sessions expirées toutes les heures
setInterval(() => {
  const cleaned = SessionService.cleanupExpiredSessions()
  if (cleaned > 0) {
    console.log(`Cleaned up ${cleaned} expired sessions`)
  }
}, 60 * 60 * 1000)
