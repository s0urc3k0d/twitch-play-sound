import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Box,
  Divider,
  styled
} from '@mui/material'
import { 
  Menu as MenuIcon,
  Home as HomeIcon,
  MusicNote as MusicNoteIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material'
import clsx from 'clsx'
import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'

import HomePage from './HomePage'
import SoundPage from './SoundPage'
import ConnectionPage from './ConnectionPage'
import UserPage from './UserPage'
import AnalyticsPage from './AnalyticsPage'

const drawerWidth = 240

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    width: drawerWidth,
    '& .MuiDrawer-paper': {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
  }),
  ...(!open && {
    '& .MuiDrawer-paper': {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(8),
      },
    },
  }),
}))

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
}))

const ContentArea = styled('main')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
}))

const FooterArea = styled(Box)(({ theme }) => ({
  marginTop: 'auto',
  padding: theme.spacing(2),
  textAlign: 'center',
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}))

const Toolbar2 = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: '0 8px',
  ...theme.mixins.toolbar,
}))

const routes = [
  {
    name: 'Accueil',
    path: '',
    icon: HomeIcon,
    component: HomePage
  },
  {
    name: 'Sons',
    path: 'sounds',
    icon: MusicNoteIcon,
    component: SoundPage
  },
  {
    name: 'Utilisateurs',
    path: 'users',
    icon: PeopleIcon,
    component: UserPage
  },
  {
    name: 'Analytics',
    path: 'analytics',
    icon: AnalyticsIcon,
    component: AnalyticsPage
  },
  {
    name: 'Configuration',
    path: 'connection',
    icon: SettingsIcon,
    component: ConnectionPage
  }
]

export default () => {
  const [navActive, setNavActive] = useState(true)
  const location = useLocation()

  return (
    <div style={{ display: 'flex' }}>
      <StyledAppBar position="fixed">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="Open Menu"
            onClick={() => setNavActive(!navActive)}
            sx={{ mr: 1, ml: -0.75 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            Sourcekod Soundboard
          </Typography>
        </Toolbar>
      </StyledAppBar>
      
      <StyledDrawer variant="permanent" open={navActive}>
        <Toolbar2 />
        <List>
          {routes.map(route => (
            <ListItem
              key={route.path}
              component={Link}
              to={`/dashboard${route.path ? `/${route.path}` : ''}`}
              selected={location.pathname === `/dashboard${route.path ? `/${route.path}` : ''}`}
              sx={{
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                '&.Mui-selected': {
                  backgroundColor: 'action.selected',
                  borderLeft: 4,
                  borderColor: 'primary.main',
                  '& .MuiListItemIcon-root': {
                    color: 'primary.main',
                  },
                  '& .MuiListItemText-primary': {
                    color: 'primary.main',
                    fontWeight: 600,
                  }
                },
              }}
            >
              <ListItemIcon sx={{ color: 'text.secondary' }}>
                <route.icon />
              </ListItemIcon>
              <ListItemText 
                primary={route.name}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
              />
            </ListItem>
          ))}
        </List>
      </StyledDrawer>
      
      <ContentArea>
        <Toolbar2 />
        <Box sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="" element={<HomePage />} />
            {routes.map(route => (
              <Route
                key={route.path}
                path={route.path === '' ? '' : `${route.path}/*`}
                element={<route.component />}
              />
            ))}
          </Routes>
        </Box>
        <FooterArea>
          <Typography variant="body2" color="text.secondary">
            © 2025 Sourcekod - Application développée par Sourcekod
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Soundboard pour streamers et créateurs de contenu
          </Typography>
        </FooterArea>
      </ContentArea>
    </div>
  )
}
