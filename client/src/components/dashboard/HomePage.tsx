import React, { useState } from 'react'
import StreamerLayout from './StreamerLayout'
import { 
  Home as HomeIcon,
  Refresh as RefreshIcon,
  OpenInNew as OpenInNewIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  Link as LinkIcon,
  ContentCopy as ContentCopyIcon
} from '@mui/icons-material'

import {
  Button,
  TextField,
  Box,
  Chip,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  alpha,
  styled,
  IconButton,
  Tooltip,
  Alert
} from '@mui/material'

const StatCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, 
    ${alpha(theme.palette.primary.main, 0.05)} 0%, 
    ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    borderColor: alpha(theme.palette.primary.main, 0.3),
    boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
    transform: 'translateY(-2px)',
  }
}))

const ActionButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1, 1, 1, 0),
  minWidth: 140,
}))

const QuickActionCard = styled(Card)(({ theme }) => ({
  background: alpha(theme.palette.background.paper, 0.8),
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  }
}))

export default () => {
  const [isDisabled, setDisabled] = useState(false)
  const [copied, setCopied] = useState(false)
  
  const browserSourceUrl = `${window.location.origin}/player`

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(browserSourceUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Erreur lors de la copie:', err)
    }
  }

  return (
    <StreamerLayout 
      title="Tableau de Bord" 
      icon={<HomeIcon />}
    >
      <Grid container spacing={3}>
        {/* Statistiques en temps réel */}
        <Grid item xs={12} md={4}>
          <StatCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" color="primary" sx={{ flexGrow: 1 }}>
                  Statut du Stream
                </Typography>
                {isDisabled ? <StopIcon color="error" /> : <PlayArrowIcon color="success" />}
              </Box>
              <Chip 
                label={isDisabled ? "Inactif" : "Actif"} 
                color={isDisabled ? "error" : "success"}
                sx={{ 
                  fontWeight: 600,
                  ...((!isDisabled) && { 
                    animation: 'pulse 2s infinite',
                  })
                }}
              />
            </CardContent>
          </StatCard>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <StatCard>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Sons Disponibles
              </Typography>
              <Typography variant="h3" color="secondary" sx={{ fontWeight: 'bold' }}>
                0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Effets sonores actifs
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <StatCard>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Utilisateurs
              </Typography>
              <Typography variant="h3" color="secondary" sx={{ fontWeight: 'bold' }}>
                0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Connectés actuellement
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>

        {/* Contrôles rapides */}
        <Grid item xs={12} md={6}>
          <QuickActionCard>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PlayArrowIcon />
                Contrôles du Stream
              </Typography>
              <Box sx={{ mt: 2 }}>
                <ActionButton
                  variant="contained"
                  color={isDisabled ? "success" : "error"}
                  onClick={() => setDisabled(!isDisabled)}
                  startIcon={isDisabled ? <PlayArrowIcon /> : <StopIcon />}
                >
                  {isDisabled ? "Activer" : "Désactiver"}
                </ActionButton>
                
                <ActionButton
                  variant="outlined"
                  color="primary"
                  startIcon={<RefreshIcon />}
                >
                  Actualiser
                </ActionButton>
              </Box>
            </CardContent>
          </QuickActionCard>
        </Grid>

        {/* Configuration Source Navigateur */}
        <Grid item xs={12} md={6}>
          <QuickActionCard>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LinkIcon />
                Source Navigateur
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                URL à utiliser dans OBS, Streamlabs, etc.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, mt: 2, mb: 2 }}>
                <TextField
                  value={browserSourceUrl}
                  variant="outlined"
                  size="small"
                  fullWidth
                  InputProps={{
                    readOnly: true,
                    style: { fontSize: '0.875rem' }
                  }}
                />
                <Tooltip title={copied ? "Copié !" : "Copier l'URL"}>
                  <IconButton 
                    onClick={handleCopyUrl}
                    color={copied ? "success" : "primary"}
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
              </Box>

              {copied && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  URL copiée dans le presse-papiers !
                </Alert>
              )}
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="secondary"
                href={browserSourceUrl}
                target="_blank"
                component="a"
                startIcon={<OpenInNewIcon />}
                size="small"
              >
                Ouvrir le Player
              </Button>
            </CardActions>
          </QuickActionCard>
        </Grid>

        {/* Instructions rapides */}
        <Grid item xs={12}>
          <QuickActionCard>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                🚀 Démarrage Rapide
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2" color="secondary" gutterBottom>
                    1. Ajouter des Sons
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Allez dans "Sons" pour uploader vos effets sonores
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2" color="secondary" gutterBottom>
                    2. Configurer Twitch
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Connectez votre compte dans "Configuration"
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2" color="secondary" gutterBottom>
                    3. Ajouter à OBS
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Utilisez l'URL de la source navigateur ci-dessus
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2" color="secondary" gutterBottom>
                    4. Streamer !
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Vos viewers peuvent maintenant déclencher des sons
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </QuickActionCard>
        </Grid>
      </Grid>
    </StreamerLayout>
  )
}
