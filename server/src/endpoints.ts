
import * as bodyParser from 'body-parser'

import { Request, Response, Router } from 'express'
// import { fetchSounds, addSound, deleteSound, updateSound, findSoundById } from './datastore'
// import { fetchUsers, addUser, deleteUser, updateUser } from './users'
import { SoundService } from './services/soundService'
import { UserService } from './services/userService'
import { AuthService } from './services/authService'
import { SessionService } from './services/sessionService'
import { SoundRequest } from './types'

import soundUpload from './soundupload'
import twitchConnection from './twitch'

const router = Router()

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.post('/sounds', soundUpload.single('sound'), async (req: Request, res: Response) => {
  try {
    const { access, command, level } = req.body
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }
    
    const newSong = await SoundService.createSound({
      name: command, // Pour l'instant, utilisons command comme nom
      access,
      command,
      path: req.file.path,
      level: Number(level),
      format: 'MP3' // Format par défaut
    })

    return res.status(200).send(newSong)
  }
  catch (e) {
    return res
      .status(500)
      .send(e)
  }
})

router.get('/sounds', async (req: Request, res: Response) => {
  try {
    const sounds = await SoundService.getAllSounds()
    return res.status(200).send(sounds)
  }
  catch (e) {
    return res
      .status(500)
      .send(e)
  }
})

router.delete('/sounds/:id', async (req: Request, res: Response) => {
  try {
    const sounds = await SoundService.deleteSound(req.params.id)
    return res.status(200).send(sounds)
  }
  catch (e) {
    return res
      .status(500)
      .send(e)
  }
})

router.put('/sounds/:id/upload', soundUpload.single('sound'), async (req: Request, res: Response) => {
  try {
    const { access, command, level } = req.body
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }
    
    const updated: SoundRequest = {
      access,
      command,
      path: req.file.path,
      level: Number(level)
    }

    const sound = await SoundService.updateSound(req.params.id, updated)
    return res.status(200).send(sound)
  }
  catch (e) {
    return res
      .status(500)
      .send(e)
  }
})

router.put('/sounds/:id/standard', async (req: Request, res: Response) => {
  try {
    const { access, command, level } = req.body
    const oldSound = await SoundService.getSoundById(req.params.id)

    if (!oldSound) {
      return res.status(404).json({ error: 'Sound not found' })
    }

    const updated: SoundRequest = {
      access,
      command,
      path: oldSound!.path,
      level: Number(level)
    }

    const sound = await SoundService.updateSound(req.params.id, updated)
    return res.status(200).send(sound)
  }
  catch (e) {
    return res
      .status(500)
      .send(e)
  }
})

// TODO: AUTHENTICATION ENDPOINTS - OAuth2 à implémenter
/*
router.get('/auth/twitch', async (req: Request, res: Response) => {
  try {
    const state = SessionService.generateSessionId()
    const authUrl = AuthService.getAuthorizationUrl(state)
    
    // Stocker l'état temporairement pour la validation
    req.session = req.session || {}
    req.session.oauth_state = state
    
    res.redirect(authUrl)
  } catch (e) {
    console.error('Auth error:', e)
    return res.status(500).json({ error: 'Failed to initiate authentication' })
  }
})

router.get('/auth/twitch/callback', async (req: Request, res: Response) => {
  try {
    const { code, state } = req.query
    
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Authorization code is required' })
    }

    // Vérifier l'état pour prévenir les attaques CSRF
    if (!req.session?.oauth_state || req.session.oauth_state !== state) {
      return res.status(400).json({ error: 'Invalid state parameter' })
    }

    // Échanger le code contre un token
    const tokenData = await AuthService.exchangeCodeForToken(code)
    
    // Récupérer les informations utilisateur
    const user = await AuthService.getUserInfo(tokenData.access_token)
    
    // Créer une session
    const sessionId = SessionService.generateSessionId()
    const session = SessionService.createSession(sessionId, user, tokenData)
    
    // Configurer le cookie de session
    res.cookie('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: tokenData.expires_in * 1000,
      sameSite: 'lax'
    })
    
    // Nettoyer l'état temporaire
    delete req.session.oauth_state
    
    // Rediriger vers l'application
    res.redirect('/')
  } catch (e) {
    console.error('Callback error:', e)
    return res.status(500).json({ error: 'Authentication failed' })
  }
})

router.get('/auth/status', async (req: Request, res: Response) => {
  try {
    const sessionId = req.cookies.session_id
    
    if (!sessionId) {
      return res.status(200).json({ authenticated: false })
    }
    
    const session = SessionService.getSession(sessionId)
    
    if (!session || !SessionService.isSessionValid(sessionId)) {
      // Session expirée, nettoyer le cookie
      res.clearCookie('session_id')
      return res.status(200).json({ authenticated: false })
    }
    
    // Vérifier la validité du token auprès de Twitch
    const isTokenValid = await AuthService.validateToken(session.accessToken)
    
    if (!isTokenValid) {
      // Token invalide, nettoyer la session
      SessionService.destroySession(sessionId)
      res.clearCookie('session_id')
      return res.status(200).json({ authenticated: false })
    }
    
    return res.status(200).json({ 
      authenticated: true,
      user: {
        id: session.user.id,
        login: session.user.login,
        display_name: session.user.display_name,
        profile_image_url: session.user.profile_image_url
      }
    })
  } catch (e) {
    console.error('Status check error:', e)
    return res.status(500).json({ error: 'Failed to check authentication status' })
  }
})

router.post('/auth/logout', async (req: Request, res: Response) => {
  try {
    const sessionId = req.cookies.session_id
    
    if (sessionId) {
      const session = SessionService.getSession(sessionId)
      
      if (session) {
        // Révoquer le token auprès de Twitch
        await AuthService.revokeToken(session.accessToken)
        
        // Détruire la session
        SessionService.destroySession(sessionId)
      }
      
      // Nettoyer le cookie
      res.clearCookie('session_id')
    }
    
    return res.status(200).json({ success: true })
  } catch (e) {
    console.error('Logout error:', e)
    return res.status(500).json({ error: 'Failed to logout' })
  }
})
*/

// AUTHENTICATION ENDPOINTS - OAuth2 simplifié pour test
router.get('/auth/twitch', async (req: Request, res: Response) => {
  try {
    // Version simplifiée pour test - redirection directe
    // TODO: Implémenter OAuth2 complet avec AuthService
    res.redirect('/?auth=test') // Redirection temporaire
  } catch (e) {
    console.error('Auth error:', e)
    return res.status(500).json({ error: 'Failed to initiate authentication' })
  }
})

// Route temporaire pour l'état d'authentification
router.get('/auth/status', async (req: Request, res: Response) => {
  // Pour l'instant, on retourne toujours non authentifié
  // TODO: Implémenter la vraie vérification OAuth2
  return res.status(200).json({ authenticated: false })
})

// Routes de compatibilité - anciennes méthodes d'authentification

router.post('/twitch', async (req: Request, res: Response) => {
  try {
    // Pour la compatibilité, on garde cette route mais on l'adapte
    const { username, oauth, channels } = req.body
    
    // Créer une session temporaire basée sur les anciennes données
    // Note: Ceci est pour la transition, idéalement tout devrait passer par OAuth2
    const config = await twitchConnection.updateConfig({
      username,
      oauth,
      channels
    })
    return res.status(200).send(config)
  }
  catch (e) {
    return res
      .status(500)
      .send(e)
  }
})

router.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await UserService.getAllUsers()
    return res.status(200).send(users)
  }
  catch (e) {
    return res
      .status(500)
      .send(e)
  }
})

router.post('/users', async (req: Request, res: Response) => {
  try {
    const { username, flags } = req.body
    const user = await UserService.createUser({ username, flags })
    return res.status(200).send(user)
  }
  catch (e) {
    return res
      .status(500)
      .send(e)
  }
})

router.put('/users/:id', async (req: Request, res: Response) => {
  try {
    const { username, flags, id } = req.body
    const user = await UserService.updateUser(req.params.id, { username, flags })
    return res.status(200).send(user)
  }
  catch (e) {
    return res
      .status(500)
      .send(e)
  }
})

router.delete('/users/:id', async (req: Request, res: Response) => {
  try {
    const users = await UserService.deleteUser(req.params.id)
    return res.status(200).send(users)
  }
  catch (e) {
    return res
      .status(500)
      .send(e)
  }
})

// ANALYTICS ENDPOINTS - Version simplifiée
router.get('/analytics', async (req: Request, res: Response) => {
  try {
    // Données simplifiées pour l'instant
    const analytics = {
      totalSounds: 0,
      totalUsers: 0,
      totalPlays: 0,
      avgPlaysPerDay: 0,
      dailyStats: [],
      popularSounds: [],
      activeUsers: [],
      recentActivity: []
    }
    return res.status(200).json(analytics)
  }
  catch (e) {
    console.error('Analytics error:', e)
    return res
      .status(500)
      .json({ error: 'Failed to fetch analytics' })
  }
})

router.get('/analytics/overview', async (req: Request, res: Response) => {
  try {
    const overview = {
      totalSounds: 0,
      totalUsers: 0,
      totalPlays: 0
    }
    return res.status(200).json(overview)
  }
  catch (e) {
    console.error('Analytics overview error:', e)
    return res
      .status(500)
      .json({ error: 'Failed to fetch overview' })
  }
})

router.get('/analytics/daily', async (req: Request, res: Response) => {
  try {
    const dailyStats = []
    return res.status(200).json(dailyStats)
  }
  catch (e) {
    console.error('Analytics daily error:', e)
    return res
      .status(500)
      .json({ error: 'Failed to fetch daily stats' })
  }
})

export default router
