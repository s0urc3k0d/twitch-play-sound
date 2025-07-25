import { Sound, TwitchUser, NewSoundNoUpload, User, NewUser } from './types'

const checkResponse = (res: Response): Response => {
  if (!res.ok) {
    throw Error(res.statusText)
  }
  return res
}

export const fetchSounds = (): Promise<Sound[]> => fetch(
  '/api/sounds',
  {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  }
)
  .then(checkResponse)
  .then((res) => res.json())

export const checkAuth = (): Promise<{ authenticated: boolean, user?: any }> => fetch(
  '/api/auth/status',
  {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  }
)
  .then(checkResponse)
  .then((res) => res.json())

export const logout = (): Promise<Response> => fetch(
  '/api/auth/logout',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  }
)
  .then(checkResponse)

export const fetchUser = (): Promise<any> => fetch(
  '/api/auth/status',
  {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  }
)
  .then(checkResponse)
  .then((res) => res.json())
  .then((data) => data.user || null)

export const addSound = (
  data: FormData
): Promise<Sound> => {
  const options = {
    method: 'POST',
    body: data,
    headers: { 'content-type': 'multipart/form-data' }
  }

  delete options.headers['content-type']

  return fetch('/api/sounds', options)
    .then(checkResponse)
    .then((res) => res.json())
}

export const editSound = (
  id: string,
  data: FormData
): Promise<Sound> => {
  const options = {
    method: 'PUT',
    body: data,
    headers: { 'content-type': 'multipart/form-data' }
  }

  delete options.headers['content-type']

  return fetch('/api/sounds/' + id + '/upload', options)
    .then(checkResponse)
    .then((res) => res.json())
}

export const editSoundNoUpload = (
  id: string,
  sound: NewSoundNoUpload
): Promise<Sound> => fetch(
  '/api/sounds/' + id + '/standard',
  {
    method: 'PUT',
    body: JSON.stringify(sound),
    headers: { 'Content-Type': 'application/json' }
  }
)
  .then(checkResponse)
  .then((res) => res.json())

export const deleteSound = (id: string): Promise<Sound[]> => fetch(
  '/api/sounds/' + id,
  {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  }
)
  .then(checkResponse)
  .then((res) => res.json())

export const fetchUsers = (): Promise<User[]> => fetch(
  '/api/users',
  {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  }
)
  .then(checkResponse)
  .then((res) => res.json())

export const addUsers = (
  user: NewUser
): Promise<User> => fetch(
  '/api/users',
  {
    method: 'POST',
    body: JSON.stringify(user),
    headers: { 'Content-Type': 'application/json' }
  }
)
  .then(checkResponse)
  .then((res) => res.json())

export const deleteUsers = (id: string): Promise<User[]> => fetch(
  '/api/users/' + id,
  {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  }
)
  .then(checkResponse)
  .then((res) => res.json())

export const editUser = (
  id: string,
  user: NewUser
): Promise<User> => fetch(
  '/api/users/' + id,
  {
    method: 'PUT',
    body: JSON.stringify(user),
    headers: { 'Content-Type': 'application/json' }
  }
)
  .then(checkResponse)
  .then((res) => res.json())

export const addUser = (
  user: TwitchUser
): Promise<Response> => fetch(
  '/api/twitch',
  {
    method: 'POST',
    body: JSON.stringify(user),
    headers: { 'Content-Type': 'application/json' }
  }
)
  .then(checkResponse)

export const fetchAnalytics = (): Promise<any> => fetch(
  '/api/analytics',
  {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  }
)
  .then(res => {
    if (!res.ok) {
      throw Error(res.statusText)
    }
    return res.text() // Utilisons .text() d'abord pour gérer les erreurs HTML
  })
  .then(text => {
    try {
      return JSON.parse(text)
    } catch (e) {
      // Si ce n'est pas du JSON valide (par exemple du HTML), retournons des données par défaut
      console.warn('L\'API analytics n\'est pas disponible, utilisation de données par défaut')
      return {
        totalSounds: 0,
        totalUsers: 0,
        totalPlays: 0,
        dailyStats: [],
        popularSounds: [],
        activeUsers: [],
        recentActivity: []
      }
    }
  })
