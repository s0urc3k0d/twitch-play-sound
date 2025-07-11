import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  styled,
  alpha
} from '@mui/material'

import {
  Analytics as AnalyticsIcon,
  VolumeUp as VolumeUpIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  PlayArrow as PlayArrowIcon,
  ShowChart as ShowChartIcon,
  StarRate as StarRateIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material'

import Layout from './StreamerLayout'
import { useAppContext } from '../../hooks'
import { fetchAnalytics } from '../../client'

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

const TrendCard = styled(Card)(({ theme }) => ({
  background: alpha(theme.palette.background.paper, 0.8),
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  }
}))

interface DailyStats {
  date: string
  commands: number
}

interface PopularSound {
  soundId: string
  name: string
  command: string
  count: number
}

interface ActiveUser {
  username: string
  count: number
  lastSeen?: Date
}

interface AnalyticsData {
  totalSounds: number
  totalUsers: number
  totalPlays: number
  avgPlaysPerDay: number
  dailyStats: DailyStats[]
  popularSounds: PopularSound[]
  activeUsers: ActiveUser[]
  recentActivity: Array<{
    id: string
    type: 'play' | 'upload' | 'user_join'
    description: string
    timestamp: string
    user?: string
  }>
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d')
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await fetchAnalytics()
      
      // Adapter les données de l'API au format attendu par le composant
      const adaptedData: AnalyticsData = {
        totalSounds: data.totalSounds || 0,
        totalUsers: data.totalUsers || 0,
        totalPlays: data.totalPlays || 0,
        avgPlaysPerDay: data.dailyStats ? 
          Math.round(data.dailyStats.reduce((sum: number, stat: any) => sum + stat.commands, 0) / data.dailyStats.length) : 0,
        dailyStats: data.dailyStats || [],
        popularSounds: data.popularSounds || [],
        activeUsers: data.activeUsers || [],
        recentActivity: data.recentActivity ? data.recentActivity.map((activity: any) => ({
          id: activity.id,
          type: 'play' as const,
          description: `${activity.sound?.name || 'Son inconnu'} joué par ${activity.user?.username || 'Utilisateur inconnu'}`,
          timestamp: activity.playedAt,
          user: activity.user?.username
        })) : []
      }
      
      setAnalytics(adaptedData)
      setLoading(false)
      
    } catch (err) {
      console.error('Erreur lors de la récupération des analytics:', err)
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la récupération des données')
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'play':
        return <PlayArrowIcon color="primary" />
      case 'upload':
        return <VolumeUpIcon color="secondary" />
      case 'user_join':
        return <PeopleIcon color="success" />
      default:
        return <ScheduleIcon />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'play':
        return 'primary'
      case 'upload':
        return 'secondary'
      case 'user_join':
        return 'success'
      default:
        return 'default'
    }
  }

  if (loading) {
    return (
      <Layout 
        title="Analytics & Statistiques" 
        icon={<AnalyticsIcon />}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={60} />
        </Box>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout 
        title="Analytics & Statistiques" 
        icon={<AnalyticsIcon />}
      >
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Layout>
    )
  }

  if (!analytics) {
    return (
      <Layout 
        title="Analytics & Statistiques" 
        icon={<AnalyticsIcon />}
      >
        <Alert severity="info">
          Aucune donnée d'analytics disponible
        </Alert>
      </Layout>
    )
  }

  return (
    <Layout 
      title="Analytics & Statistiques" 
      icon={<AnalyticsIcon />}
    >
      <Box sx={{ mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Période</InputLabel>
          <Select
            value={timeRange}
            label="Période"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="24h">24 heures</MenuItem>
            <MenuItem value="7d">7 jours</MenuItem>
            <MenuItem value="30d">30 jours</MenuItem>
            <MenuItem value="90d">90 jours</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {/* Statistiques Principales */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <VolumeUpIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="primary">
                  Sons Totaux
                </Typography>
              </Box>
              <Typography variant="h3" color="secondary" sx={{ fontWeight: 'bold' }}>
                {analytics.totalSounds}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Effets sonores disponibles
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PeopleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="primary">
                  Utilisateurs
                </Typography>
              </Box>
              <Typography variant="h3" color="secondary" sx={{ fontWeight: 'bold' }}>
                {analytics.totalUsers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Utilisateurs enregistrés
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="primary">
                  Lectures Totales
                </Typography>
              </Box>
              <Typography variant="h3" color="secondary" sx={{ fontWeight: 'bold' }}>
                {analytics.totalPlays.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sons joués au total
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ScheduleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="primary">
                  Moyenne/Jour
                </Typography>
              </Box>
              <Typography variant="h3" color="secondary" sx={{ fontWeight: 'bold' }}>
                {analytics.avgPlaysPerDay}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lectures par jour
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>

        {/* Graphique Activité */}
        <Grid item xs={12}>
          <TrendCard>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ShowChartIcon />
                Activité des 7 derniers jours
              </Typography>
              <Box sx={{ mt: 2 }}>
                {analytics.dailyStats && analytics.dailyStats.length > 0 ? (
                  analytics.dailyStats.map((stat, index) => {
                    const maxCommands = Math.max(...analytics.dailyStats.map(s => s.commands))
                    const percentage = maxCommands > 0 ? (stat.commands / maxCommands) * 100 : 0
                    
                    return (
                      <Box key={stat.date} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2">
                            {new Date(stat.date).toLocaleDateString('fr-FR', { 
                              weekday: 'long', 
                              day: 'numeric', 
                              month: 'short' 
                            })}
                          </Typography>
                          <Typography variant="body2" color="primary" fontWeight="bold">
                            {stat.commands} sons
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={percentage} 
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                    )
                  })
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    Aucune donnée d'activité disponible
                  </Typography>
                )}
              </Box>
            </CardContent>
          </TrendCard>
        </Grid>

        {/* Top Sons */}
        <Grid item xs={12} md={6}>
          <TrendCard>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <StarRateIcon />
                Top Sons Populaires
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Son</TableCell>
                      <TableCell>Commande</TableCell>
                      <TableCell align="right">Lectures</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {analytics.popularSounds && analytics.popularSounds.length > 0 ? (
                      analytics.popularSounds.map((sound, index) => (
                        <TableRow key={sound.soundId}>
                          <TableCell>
                            <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', bgcolor: index < 3 ? 'primary.main' : 'grey.400' }}>
                              {index + 1}
                            </Avatar>
                          </TableCell>
                          <TableCell>{sound.name}</TableCell>
                          <TableCell>
                            <Chip label={sound.command} size="small" variant="outlined" />
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="bold" color="primary">
                              {sound.count}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                            Aucun son populaire pour le moment
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </TrendCard>
        </Grid>

        {/* Top Utilisateurs */}
        <Grid item xs={12} md={6}>
          <TrendCard>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PeopleIcon />
                Top Utilisateurs Actifs
              </Typography>
              <List>
                {analytics.activeUsers && analytics.activeUsers.length > 0 ? (
                  analytics.activeUsers.map((user, index) => (
                    <React.Fragment key={user.username}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: index < 3 ? 'secondary.main' : 'grey.400' }}>
                            {user.username.charAt(0).toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={user.username}
                          secondary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body2" color="text.secondary">
                                {user.count} actions
                              </Typography>
                              {user.lastSeen && (
                                <Typography variant="caption" color="text.secondary">
                                  {new Date(user.lastSeen).toLocaleString('fr-FR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < analytics.activeUsers.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                          Aucun utilisateur actif pour le moment
                        </Typography>
                      }
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </TrendCard>
        </Grid>

        {/* Activité Récente */}
        <Grid item xs={12}>
          <TrendCard>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTimeIcon />
                Activité Récente
              </Typography>
              <List>
                {analytics.recentActivity && analytics.recentActivity.length > 0 ? (
                  analytics.recentActivity.map((activity, index) => (
                    <React.Fragment key={activity.id}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'transparent' }}>
                            {getActivityIcon(activity.type)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body1">
                                {activity.description}
                              </Typography>
                              <Chip 
                                label={activity.type === 'play' ? 'Lecture' : activity.type === 'upload' ? 'Upload' : 'Utilisateur'}
                                size="small"
                                color={getActivityColor(activity.type) as any}
                                variant="outlined"
                              />
                            </Box>
                          }
                          secondary={formatDate(activity.timestamp)}
                        />
                      </ListItem>
                      {index < analytics.recentActivity.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                          Aucune activité récente
                        </Typography>
                      }
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </TrendCard>
        </Grid>
      </Grid>
    </Layout>
  )
}
