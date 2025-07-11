import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { AppProvider } from '../hooks/useAppProvider'

import theme from '../theme'

import { DashboardMain } from './dashboard'
import { PlayerMain } from './player'

const App = () => (
  <ThemeProvider theme={theme}>
    <AppProvider>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard/*" element={<DashboardMain />} />
          <Route path="/player" element={<PlayerMain />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  </ThemeProvider>
)

export default App
