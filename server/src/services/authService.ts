import fetch from 'node-fetch'
import config from '../config'

export interface TwitchAuthConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
}

export interface TwitchUser {
  id: string
  login: string
  display_name: string
  type: string
  broadcaster_type: string
  description: string
  profile_image_url: string
  offline_image_url: string
  view_count: number
  created_at: string
}

export interface TwitchTokenResponse {
  access_token: string
  expires_in: number
  refresh_token?: string
  scope: string[]
  token_type: string
}

export class AuthService {
  private static config: TwitchAuthConfig = {
    clientId: process.env.TWITCH_CLIENT_ID || '',
    clientSecret: process.env.TWITCH_CLIENT_SECRET || '',
    redirectUri: process.env.TWITCH_REDIRECT_URI || 'http://localhost:8080/api/auth/twitch/callback'
  }

  /**
   * Génère l'URL d'autorisation Twitch OAuth2
   */
  static getAuthorizationUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: 'chat:read chat:edit channel:read:subscriptions',
      state: state || Math.random().toString(36).substring(7)
    })

    return `https://id.twitch.tv/oauth2/authorize?${params.toString()}`
  }

  /**
   * Échange le code d'autorisation contre un token d'accès
   */
  static async exchangeCodeForToken(code: string): Promise<TwitchTokenResponse> {
    const response = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: this.config.redirectUri,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to exchange code for token: ${error}`)
    }

    return response.json() as Promise<TwitchTokenResponse>
  }

  /**
   * Récupère les informations utilisateur depuis l'API Twitch
   */
  static async getUserInfo(accessToken: string): Promise<TwitchUser> {
    const response = await fetch('https://api.twitch.tv/helix/users', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Client-Id': this.config.clientId,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to get user info: ${error}`)
    }

    const data = await response.json() as { data: TwitchUser[] }
    
    if (!data.data || data.data.length === 0) {
      throw new Error('No user data returned from Twitch API')
    }

    return data.data[0]
  }

  /**
   * Valide un token d'accès Twitch
   */
  static async validateToken(accessToken: string): Promise<boolean> {
    try {
      const response = await fetch('https://id.twitch.tv/oauth2/validate', {
        headers: {
          'Authorization': `OAuth ${accessToken}`,
        },
      })

      return response.ok
    } catch (error) {
      return false
    }
  }

  /**
   * Révoque un token d'accès Twitch
   */
  static async revokeToken(accessToken: string): Promise<boolean> {
    try {
      const response = await fetch('https://id.twitch.tv/oauth2/revoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.config.clientId,
          token: accessToken,
        }),
      })

      return response.ok
    } catch (error) {
      return false
    }
  }

  /**
   * Rafraîchit un token d'accès avec le refresh token
   */
  static async refreshToken(refreshToken: string): Promise<TwitchTokenResponse> {
    const response = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to refresh token: ${error}`)
    }

    return response.json() as Promise<TwitchTokenResponse>
  }
}
