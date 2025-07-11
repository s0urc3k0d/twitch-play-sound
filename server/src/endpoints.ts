
import * as bodyParser from 'body-parser'

import { Request, Response, Router } from 'express'
// import { fetchSounds, addSound, deleteSound, updateSound, findSoundById } from './datastore'
// import { fetchUsers, addUser, deleteUser, updateUser } from './users'
import { SoundService } from './services/soundService'
import { UserService } from './services/userService'
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

router.get('/twitch/auth', async (req: Request, res: Response) => {
  const auth = await twitchConnection.isAuth()
  return res.status(200).send(auth)
})

router.post('/twitch/logout', async (req: Request, res: Response) => {
  const auth = await twitchConnection.disconnect()
  return res.status(200).send(auth)
})

router.get('/twitch', (req: Request, res: Response) => {
  try {
    const config = twitchConnection.getConfig()
    return res.status(200).send(config)
  }
  catch (e) {
    return res
      .status(500)
      .send(e)
  }
})

router.post('/twitch', async (req: Request, res: Response) => {
  try {
    const config = await twitchConnection.updateConfig({
      username: req.body.username,
      oauth: req.body.oauth,
      channels: req.body.channels
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
