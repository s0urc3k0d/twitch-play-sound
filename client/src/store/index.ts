import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// Types
export interface Sound {
  id: string
  name: string
  command: string
  path: string
  level: number
  access: 'ALL' | 'MOD' | 'SUB' | 'VIP'
  format: 'mp3' | 'wav' | 'ogg' | 'flac'
  createdAt: Date
  lastPlayed?: Date
  playCount: number
}

export interface User {
  id: string
  username: string
  flags: string[]
  createdAt: Date
  lastSeen?: Date
  commandCount: number
}

export interface TwitchConnection {
  connected: boolean
  username?: string
  channels?: string[]
}

export interface Analytics {
  totalSounds: number
  totalCommands: number
  popularSounds: Array<{ soundId: string; count: number }>
  activeUsers: Array<{ username: string; count: number }>
  dailyStats: Array<{ date: string; commands: number }>
}

// Store interface
interface AppStore {
  // Sounds
  sounds: Sound[]
  setSounds: (sounds: Sound[]) => void
  addSound: (sound: Sound) => void
  updateSound: (id: string, updates: Partial<Sound>) => void
  deleteSound: (id: string) => void
  
  // Users
  users: User[]
  setUsers: (users: User[]) => void
  addUser: (user: User) => void
  updateUser: (id: string, updates: Partial<User>) => void
  deleteUser: (id: string) => void
  
  // Twitch connection
  twitchConnection: TwitchConnection
  setTwitchConnection: (connection: TwitchConnection) => void
  
  // Analytics
  analytics: Analytics
  setAnalytics: (analytics: Analytics) => void
  
  // UI State
  darkMode: boolean
  toggleDarkMode: () => void
  
  // Loading states
  loading: {
    sounds: boolean
    users: boolean
    analytics: boolean
  }
  setLoading: (key: keyof AppStore['loading'], value: boolean) => void
}

// Create store
export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        sounds: [],
        users: [],
        twitchConnection: { connected: false },
        analytics: {
          totalSounds: 0,
          totalCommands: 0,
          popularSounds: [],
          activeUsers: [],
          dailyStats: []
        },
        darkMode: false,
        loading: {
          sounds: false,
          users: false,
          analytics: false
        },

        // Actions
        setSounds: (sounds) => set({ sounds }),
        
        addSound: (sound) => set((state) => ({
          sounds: [...state.sounds, sound]
        })),
        
        updateSound: (id, updates) => set((state) => ({
          sounds: state.sounds.map(sound => 
            sound.id === id ? { ...sound, ...updates } : sound
          )
        })),
        
        deleteSound: (id) => set((state) => ({
          sounds: state.sounds.filter(sound => sound.id !== id)
        })),
        
        setUsers: (users) => set({ users }),
        
        addUser: (user) => set((state) => ({
          users: [...state.users, user]
        })),
        
        updateUser: (id, updates) => set((state) => ({
          users: state.users.map(user => 
            user.id === id ? { ...user, ...updates } : user
          )
        })),
        
        deleteUser: (id) => set((state) => ({
          users: state.users.filter(user => user.id !== id)
        })),
        
        setTwitchConnection: (connection) => set({ twitchConnection: connection }),
        
        setAnalytics: (analytics) => set({ analytics }),
        
        toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
        
        setLoading: (key, value) => set((state) => ({
          loading: { ...state.loading, [key]: value }
        }))
      }),
      {
        name: 'twitch-soundboard-storage',
        partialize: (state) => ({ 
          darkMode: state.darkMode 
        })
      }
    ),
    {
      name: 'twitch-soundboard-store'
    }
  )
)
