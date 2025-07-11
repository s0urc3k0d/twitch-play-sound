import React from 'react'
import { createRoot } from 'react-dom/client'

import App from './components/App'

const mount = document.getElementById('root')

if (!mount) {
  console.error('No mountpoint found!')
} else {
  const root = createRoot(mount)
  root.render(<App />)
}
