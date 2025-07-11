import { z } from 'zod'
import prisma from '../database'

// Validation schemas
export const UserCreateSchema = z.object({
  username: z.string().min(1).max(50),
  flags: z.array(z.string()).default([])
})

export const UserUpdateSchema = UserCreateSchema.partial()

export type UserCreate = z.infer<typeof UserCreateSchema>
export type UserUpdate = z.infer<typeof UserUpdateSchema>

// Helper functions for JSON arrays
const serializeFlags = (flags: string[]): string => JSON.stringify(flags)
const deserializeFlags = (flags: string): string[] => {
  try {
    return JSON.parse(flags)
  } catch {
    return []
  }
}

// User service
export class UserService {
  static async getAllUsers() {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { playHistory: true }
        }
      }
    })

    return users.map(user => ({
      ...user,
      flags: deserializeFlags(user.flags)
    }))
  }

  static async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        playHistory: {
          take: 10,
          orderBy: { playedAt: 'desc' },
          include: {
            sound: true
          }
        }
      }
    })

    if (!user) return null

    return {
      ...user,
      flags: deserializeFlags(user.flags)
    }
  }

  static async getUserByUsername(username: string) {
    const user = await prisma.user.findUnique({
      where: { username }
    })

    if (!user) return null

    return {
      ...user,
      flags: deserializeFlags(user.flags)
    }
  }

  static async createUser(data: UserCreate) {
    const validatedData = UserCreateSchema.parse(data)
    
    // Check if username already exists
    const existing = await this.getUserByUsername(validatedData.username)
    if (existing) {
      throw new Error(`User ${validatedData.username} already exists`)
    }

    const user = await prisma.user.create({
      data: {
        username: validatedData.username,
        flags: serializeFlags(validatedData.flags || [])
      }
    })

    return {
      ...user,
      flags: deserializeFlags(user.flags)
    }
  }

  static async updateUser(id: string, data: UserUpdate) {
    const validatedData = UserUpdateSchema.parse(data)
    
    // Check if username already exists for another user
    if (validatedData.username) {
      const existing = await this.getUserByUsername(validatedData.username)
      if (existing && existing.id !== id) {
        throw new Error(`Username ${validatedData.username} already exists`)
      }
    }

    const updateData: any = {}
    if (validatedData.username) updateData.username = validatedData.username
    if (validatedData.flags) updateData.flags = serializeFlags(validatedData.flags)

    const user = await prisma.user.update({
      where: { id },
      data: updateData
    })

    return {
      ...user,
      flags: deserializeFlags(user.flags)
    }
  }

  static async deleteUser(id: string) {
    return await prisma.user.delete({
      where: { id }
    })
  }

  static async findOrCreateUser(username: string) {
    let user = await this.getUserByUsername(username)
    
    if (!user) {
      user = await this.createUser({ username, flags: [] })
    }

    return user
  }

  static async incrementCommandCount(username: string) {
    const user = await this.findOrCreateUser(username)
    
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        commandCount: { increment: 1 },
        lastSeen: new Date()
      }
    })

    return {
      ...updatedUser,
      flags: deserializeFlags(updatedUser.flags)
    }
  }
}
