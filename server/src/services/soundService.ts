import { z } from 'zod'
import prisma from '../database'

// Validation schemas
export const SoundCreateSchema = z.object({
  name: z.string().min(1).max(100),
  command: z.string().min(2).max(50).startsWith('!'),
  level: z.number().min(1).max(100).default(75),
  access: z.enum(['ALL', 'MOD', 'SUB', 'VIP']).default('ALL'),
  format: z.enum(['MP3', 'WAV', 'OGG', 'FLAC']).default('MP3'),
  path: z.string().min(1)
})

export const SoundUpdateSchema = SoundCreateSchema.partial()

export type SoundCreate = z.infer<typeof SoundCreateSchema>
export type SoundUpdate = z.infer<typeof SoundUpdateSchema>

// Sound service
export class SoundService {
  static async getAllSounds() {
    return await prisma.sound.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { playHistory: true }
        }
      }
    })
  }

  static async getSoundById(id: string) {
    return await prisma.sound.findUnique({
      where: { id },
      include: {
        playHistory: {
          take: 10,
          orderBy: { playedAt: 'desc' },
          include: {
            user: true
          }
        }
      }
    })
  }

  static async getSoundByCommand(command: string) {
    return await prisma.sound.findUnique({
      where: { command }
    })
  }

  static async createSound(data: SoundCreate) {
    const validatedData = SoundCreateSchema.parse(data)
    
    // Check if command already exists
    const existing = await this.getSoundByCommand(validatedData.command)
    if (existing) {
      throw new Error(`Command ${validatedData.command} already exists`)
    }

    return await prisma.sound.create({
      data: validatedData
    })
  }

  static async updateSound(id: string, data: SoundUpdate) {
    const validatedData = SoundUpdateSchema.parse(data)
    
    // Check if command already exists for another sound
    if (validatedData.command) {
      const existing = await this.getSoundByCommand(validatedData.command)
      if (existing && existing.id !== id) {
        throw new Error(`Command ${validatedData.command} already exists`)
      }
    }

    return await prisma.sound.update({
      where: { id },
      data: validatedData
    })
  }

  static async deleteSound(id: string) {
    return await prisma.sound.delete({
      where: { id }
    })
  }

  static async playSound(soundId: string, username: string, userId?: string) {
    // Record the play
    await prisma.soundPlay.create({
      data: {
        soundId,
        username,
        userId
      }
    })

    // Update sound statistics
    await prisma.sound.update({
      where: { id: soundId },
      data: {
        playCount: { increment: 1 },
        lastPlayed: new Date()
      }
    })

    // Update user statistics if user exists
    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          commandCount: { increment: 1 },
          lastSeen: new Date()
        }
      })
    }
  }

  static async getSoundAnalytics(soundId: string, days: number = 30) {
    const since = new Date()
    since.setDate(since.getDate() - days)

    const playHistory = await prisma.soundPlay.findMany({
      where: {
        soundId,
        playedAt: { gte: since }
      },
      orderBy: { playedAt: 'desc' }
    })

    // Group by day
    const dailyPlays = playHistory.reduce((acc, play) => {
      const date = play.playedAt.toISOString().split('T')[0]
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      totalPlays: playHistory.length,
      dailyPlays,
      uniqueUsers: new Set(playHistory.map(p => p.username)).size
    }
  }

  static async getPopularSounds(limit: number = 10) {
    return await prisma.sound.findMany({
      orderBy: { playCount: 'desc' },
      take: limit,
      select: {
        id: true,
        name: true,
        command: true,
        playCount: true,
        lastPlayed: true
      }
    })
  }
}
