import React from 'react'
import { TwitchUser } from '../../types'
import {
  Typography,
  Button,
  Box,
  Avatar,
  Chip
} from '@mui/material'

import {
  Person as PersonIcon,
  ExitToApp as ExitToAppIcon
} from '@mui/icons-material'

interface Props {
  user: TwitchUser,
  onLogOut: () => void
}

export default ({
  user,
  onLogOut
}: Props) => {
  return (
    <Box sx={{ textAlign: 'center', py: 2 }}>
      <Avatar 
        sx={{ 
          width: 80, 
          height: 80, 
          mx: 'auto', 
          mb: 2,
          bgcolor: 'primary.main',
          fontSize: '2rem'
        }}
      >
        <PersonIcon fontSize="large" />
      </Avatar>
      
      <Typography variant="h4" gutterBottom color="primary">
        {user.username}
      </Typography>
      
      <Chip 
        label="Connecté" 
        color="success" 
        sx={{ mb: 3, fontWeight: 600 }}
      />
      
      <Button
        variant="contained"
        color="secondary"
        onClick={onLogOut}
        startIcon={<ExitToAppIcon />}
        size="large"
      >
        Changer d'utilisateur
      </Button>
    </Box>
  )
}
