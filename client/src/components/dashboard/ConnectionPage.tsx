import React from 'react'
import { ConnectionForm, ConnectedCard } from '.'
import StreamerLayout from './StreamerLayout'
import { useAppContext } from '../../hooks'

import {
  Chip,
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  alpha
} from '@mui/material'

import { 
  Settings as SettingsIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material'

export default () => {
  const { user, auth, login, logout } = useAppContext()

  return (
    <StreamerLayout 
      title="Configuration Twitch" 
      icon={<SettingsIcon />}
    >
      <Grid container spacing={3}>
        {/* Status Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            background: (theme) => alpha(theme.palette.background.paper, 0.9),
            border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            boxShadow: 2,
          }}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Statut de la Connexion
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {auth ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />}
                <Chip
                  label={auth ? 'Connecté' : 'Non connecté'}
                  color={auth ? 'success' : 'error'}
                  sx={{ 
                    fontWeight: 600,
                    ...(auth && { 
                      animation: 'pulse 2s infinite',
                      background: 'linear-gradient(45deg, #00F5A0 30%, #00C875 90%)',
                    })
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Connection Form/Card */}
        <Grid item xs={12}>
          <Card sx={{ mt: 2, p: 2 }}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                {auth ? 'Connecté en tant que' : 'Autoriser l\'accès à Twitch'}
              </Typography>
              {!auth || !user ? (
                <ConnectionForm onAuth={login} />
              ) : (
                <ConnectedCard user={user} onLogOut={logout} />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </StreamerLayout>
  )
}
