import { z } from 'zod'
import prisma from '../database'

// Validation schemas
export const TwitchConfigSchema = z.object({
  username: z.string().min(1),
  oauth: z.string().min(1),
  channels: z.array(z.string().min(1))
})

export type TwitchConfigData = z.infer<typeof TwitchConfigSchema>

// Helper functions for JSON arrays
const serializeChannels = (channels: string[]): string => JSON.stringify(channels)
const deserializeChannels = (channels: string): string[] => {
  try {
    return JSON.parse(channels)
  } catch {
    return []
  }
}

// Twitch service
export class TwitchService {
  static async getConfig() {
    const config = await prisma.twitchConfig.findUnique({
      where: { id: 'main' }
    })

    if (!config) {
      // Create default config
      const newConfig = await prisma.twitchConfig.create({
        data: {
          id: 'main',
          username: null,
          oauth: null,
          channels: serializeChannels([]),
          connected: false
        }
      })

      return {
        ...newConfig,
        channels: deserializeChannels(newConfig.channels)
      }
    }

    return {
      ...config,
      channels: deserializeChannels(config.channels)
    }
  }

  static async updateConfig(data: TwitchConfigData) {
    const validatedData = TwitchConfigSchema.parse(data)

    const config = await prisma.twitchConfig.upsert({
      where: { id: 'main' },
      update: {
        username: validatedData.username,
        oauth: validatedData.oauth,
        channels: serializeChannels(validatedData.channels),
        connected: false, // Will be updated by the connection manager
        updatedAt: new Date()
      },
      create: {
        id: 'main',
        username: validatedData.username,
        oauth: validatedData.oauth,
        channels: serializeChannels(validatedData.channels),
        connected: false
      }
    })

    return {
      ...config,
      channels: deserializeChannels(config.channels)
    }
  }

  static async setConnectionStatus(connected: boolean) {
    const config = await prisma.twitchConfig.update({
      where: { id: 'main' },
      data: { connected }
    })

    return {
      ...config,
      channels: deserializeChannels(config.channels)
    }
  }

  static async disconnect() {
    const config = await prisma.twitchConfig.update({
      where: { id: 'main' },
      data: {
        connected: false,
        username: null,
        oauth: null,
        channels: serializeChannels([])
      }
    })

    return {
      ...config,
      channels: deserializeChannels(config.channels)
    }
  }
}
