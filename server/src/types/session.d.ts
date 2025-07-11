// Extensions pour Express Session pour supporter OAuth
declare module 'express-session' {
  interface SessionData {
    oauth_state?: string
    twitchAuth?: {
      access_token: string
      refresh_token: string
      user_id: string
      login: string
    }
  }
}
