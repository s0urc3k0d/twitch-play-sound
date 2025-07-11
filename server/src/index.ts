import * as express from 'express'
import * as path from 'path'
import { createServer } from 'http'

import {
  Request,
  Response,
  Application
} from 'express'

import EndPoints from './endpoints'
import config from './config'
// import { migrateSoundDatabase } from './datastore'
// import { migrateUserDatabase } from './users'
import twitchConnection from './twitch'
import { initializeSocket } from './socket'

const app: Application = express()
const server = createServer(app)

app.use(express.json())
app.use(express.static('../client/build'))

app.use('/api', EndPoints)

app.use('/data', express.static(path.join(__dirname, '../data')))

app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.resolve('..', 'client', 'build', 'index.html'))
})

// Initialisation de Socket.IO
initializeSocket(server)

server.listen(config.port, async () => {
  // Base de données maintenant gérée par Prisma
  // await migrateSoundDatabase()
  // await migrateUserDatabase()
  await twitchConnection.onStartConnect()
  console.log(`Server listening on port ${config.port}`)
})
