import React, { useState, useEffect } from 'react'

import {
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material'

import {
  Login as LoginIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material'

interface Props {
  onAuthSuccess?: () => void
}

interface AuthStatus {
  authenticated: boolean
  user?: {
    id: string
    login: string
    display_name: string
    profile_image_url: string
  }
}

export default ({ onAuthSuccess }: Props) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/status')
      const status: AuthStatus = await response.json()
      setAuthStatus(status)
      
      if (status.authenticated && onAuthSuccess) {
        onAuthSuccess()
      }
    } catch (err) {
      console.error('Failed to check auth status:', err)
      setError('Impossible de vérifier le statut d\'authentification')
    }
  }

  const handleLogin = () => {
    setLoading(true)
    setError(null)
    
    // Rediriger vers l'endpoint d'authentification OAuth2
    window.location.href = '/api/auth/twitch'
  }

  const handleLogout = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      
      if (response.ok) {
        setAuthStatus({ authenticated: false })
        setError(null)
      } else {
        throw new Error('Logout failed')
      }
    } catch (err) {
      console.error('Logout error:', err)
      setError('Erreur lors de la déconnexion')
    } finally {
      setLoading(false)
    }
  }

  if (authStatus === null) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ mt: 2 }}>
            Vérification de l'authentification...
          </Typography>
        </CardContent>
      </Card>
    )
  }

  if (authStatus.authenticated && authStatus.user) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <CheckCircleIcon color="success" />
            <Typography variant="h6" color="success.main">
              Connecté à Twitch
            </Typography>
            <Chip 
              label="En ligne" 
              color="success" 
              size="small"
              sx={{ 
                animation: 'pulse 2s infinite',
                background: 'linear-gradient(45deg, #00F5A0 30%, #00C875 90%)',
              }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <img 
              src={authStatus.user.profile_image_url} 
              alt="Avatar Twitch"
              style={{ 
                width: 48, 
                height: 48, 
                borderRadius: '50%',
                border: '2px solid #9146FF'
              }}
            />
            <Box>
              <Typography variant="h6">
                {authStatus.user.display_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                @{authStatus.user.login}
              </Typography>
            </Box>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Votre compte Twitch est connecté avec succès. Le bot peut maintenant 
            écouter les commandes dans votre chat.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            variant="outlined"
            color="error"
            onClick={handleLogout}
            disabled={loading}
            fullWidth
          >
            {loading ? <CircularProgress size={20} /> : 'Se déconnecter'}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent sx={{ textAlign: 'center' }}>
        <LoginIcon 
          sx={{ 
            fontSize: 64, 
            color: '#9146FF', 
            mb: 2 
          }} 
        />
        
        <Typography variant="h5" gutterBottom color="primary">
          Connexion Twitch
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Connectez votre compte Twitch pour permettre au bot d'écouter 
          les commandes dans votre chat.
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Cette connexion utilise OAuth2 sécurisé de Twitch. Aucun mot de passe 
          n'est stocké sur nos serveurs.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ErrorIcon />
              {error}
            </Box>
          </Alert>
        )}

        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={handleLogin}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
          fullWidth
          sx={{
            background: 'linear-gradient(45deg, #9146FF 30%, #772CE8 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #772CE8 30%, #9146FF 90%)',
            }
          }}
        >
          {loading ? 'Connexion...' : 'Se connecter avec Twitch'}
        </Button>
      </CardContent>
    </Card>
  )
}
