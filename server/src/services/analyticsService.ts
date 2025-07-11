import prisma from '../database'

export class AnalyticsService {
  static async getOverviewStats() {
    const [totalSounds, totalUsers, totalPlays] = await Promise.all([
      prisma.sound.count(),
      prisma.user.count(),
      prisma.soundPlay.count()
    ])

    return {
      totalSounds,
      totalUsers,
      totalPlays
    }
  }

  static async getDailyStat(days: number = 30) {
    const since = new Date()
    since.setDate(since.getDate() - days)

    const plays = await prisma.soundPlay.findMany({
      where: {
        playedAt: { gte: since }
      },
      select: {
        playedAt: true
      }
    })

    // Group by day
    const dailyStats = plays.reduce((acc, play) => {
      const date = play.playedAt.toISOString().split('T')[0]
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Fill missing days with 0
    const result: Array<{ date: string; commands: number }> = []
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      result.push({
        date: dateStr,
        commands: dailyStats[dateStr] || 0
      })
    }

    return result
  }

  static async getPopularSounds(limit: number = 10) {
    const sounds = await prisma.sound.findMany({
      orderBy: { playCount: 'desc' },
      take: limit,
      select: {
        id: true,
        name: true,
        command: true,
        playCount: true
      }
    })

    return sounds.map(sound => ({
      soundId: sound.id,
      name: sound.name,
      command: sound.command,
      count: sound.playCount
    }))
  }

  static async getActiveUsers(limit: number = 10) {
    const users = await prisma.user.findMany({
      orderBy: { commandCount: 'desc' },
      take: limit,
      select: {
        username: true,
        commandCount: true,
        lastSeen: true
      }
    })

    return users.map(user => ({
      username: user.username,
      count: user.commandCount,
      lastSeen: user.lastSeen
    }))
  }

  static async getRecentActivity(limit: number = 50) {
    return await prisma.soundPlay.findMany({
      take: limit,
      orderBy: { playedAt: 'desc' },
      include: {
        sound: {
          select: {
            name: true,
            command: true
          }
        },
        user: {
          select: {
            username: true
          }
        }
      }
    })
  }

  static async getHourlyStats() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const plays = await prisma.soundPlay.findMany({
      where: {
        playedAt: { gte: today }
      },
      select: {
        playedAt: true
      }
    })

    // Group by hour
    const hourlyStats = plays.reduce((acc, play) => {
      const hour = play.playedAt.getHours()
      acc[hour] = (acc[hour] || 0) + 1
      return acc
    }, {} as Record<number, number>)

    // Fill all 24 hours
    const result: Array<{ hour: number; commands: number }> = []
    for (let hour = 0; hour < 24; hour++) {
      result.push({
        hour,
        commands: hourlyStats[hour] || 0
      })
    }

    return result
  }

  static async getFullAnalytics() {
    const [overview, dailyStats, popularSounds, activeUsers, recentActivity] = await Promise.all([
      this.getOverviewStats(),
      this.getDailyStat(),
      this.getPopularSounds(),
      this.getActiveUsers(),
      this.getRecentActivity()
    ])

    return {
      ...overview,
      dailyStats,
      popularSounds,
      activeUsers,
      recentActivity
    }
  }
}
