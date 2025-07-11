import express, { Request, Response } from 'express'
import multer from 'multer'
import path from 'path'
import { z } from 'zod'
import { SoundService } from './services/soundService'
import { AnalyticsService } from './services/analyticsService'

const router = express.Router()

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../data/sounds'))
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    cb(null, file.fieldname + '-' + uniqueSuffix + ext)
  }
})

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.mp3', '.wav', '.ogg', '.flac']
    const ext = path.extname(file.originalname).toLowerCase()
    
    if (allowedTypes.includes(ext)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only MP3, WAV, OGG, and FLAC files are allowed.'))
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
})

// Error handler middleware
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: Function) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

// SOUNDS ENDPOINTS
router.get('/sounds', asyncHandler(async (req: Request, res: Response) => {
  const sounds = await SoundService.getAllSounds()
  res.json(sounds)
}))

router.get('/sounds/:id', asyncHandler(async (req: Request, res: Response) => {
  const sound = await SoundService.getSoundById(req.params.id)
  if (!sound) {
    return res.status(404).json({ error: 'Sound not found' })
  }
  res.json(sound)
}))

router.post('/sounds', 
  upload.single('file'),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const format = path.extname(req.file.filename).slice(1).toUpperCase() as any
    const soundData = {
      name: req.body.name,
      command: req.body.command,
      level: parseInt(req.body.level) || 75,
      access: req.body.access || 'ALL',
      format,
      path: `data/sounds/${req.file.filename}`
    }

    const sound = await SoundService.createSound(soundData)
    res.status(201).json(sound)
  })
)

router.put('/sounds/:id', asyncHandler(async (req: Request, res: Response) => {
  const sound = await SoundService.updateSound(req.params.id, req.body)
  res.json(sound)
}))

router.delete('/sounds/:id', asyncHandler(async (req: Request, res: Response) => {
  await SoundService.deleteSound(req.params.id)
  res.status(204).send()
}))

// ANALYTICS ENDPOINTS
router.get('/analytics', asyncHandler(async (req: Request, res: Response) => {
  const analytics = await AnalyticsService.getFullAnalytics()
  res.json(analytics)
}))

router.get('/analytics/overview', asyncHandler(async (req: Request, res: Response) => {
  const overview = await AnalyticsService.getOverviewStats()
  res.json(overview)
}))

router.get('/analytics/daily', asyncHandler(async (req: Request, res: Response) => {
  const days = parseInt(req.query.days as string) || 30
  const dailyStats = await AnalyticsService.getDailyStat(days)
  res.json(dailyStats)
}))

// Error handling middleware
router.use((error: Error, req: Request, res: Response, next: Function) => {
  console.error('API Error:', error)
  
  if (error.message.includes('already exists')) {
    return res.status(409).json({ error: error.message })
  }
  
  if (error.message.includes('not found')) {
    return res.status(404).json({ error: error.message })
  }
  
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : undefined
  })
})

export default router
