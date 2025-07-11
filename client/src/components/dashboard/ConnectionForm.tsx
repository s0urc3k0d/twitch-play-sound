import React, { useState } from 'react'
import { TwitchUser } from '../../types'

import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Typography,
  Box,
  Link
} from '@mui/material'

import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material'

interface Props {
  onAuth: (user: TwitchUser) => void
}

interface State {
  username: string,
  oauth: string,
  error: boolean,
  showKey: boolean
}

const getInitialState = (): State => ({
  username: '',
  oauth: '',
  error: false,
  showKey: false
})

export default ({
  onAuth
}: Props) => {
  const [state, setState] = useState<State>(getInitialState)

  const handleSubmit = () => {
    onAuth({
      username: state.username,
      oauth: state.oauth,
      channels: [state.username]
    })
    setState(getInitialState)
  }

  return (
    <Box sx={{ '& > *': { mb: 2 } }}>
      <TextField
        label="Nom d'utilisateur Twitch"
        value={state.username}
        onChange={e => setState({
          ...state,
          username: e.currentTarget.value
        })}
        fullWidth
        variant="outlined"
        error={state.error}
      />
      
      <FormControl fullWidth variant="outlined">
        <InputLabel htmlFor="adornment-oauth">Clé OAuth</InputLabel>
        <OutlinedInput
          id="adornment-oauth"
          type={state.showKey ? 'text' : 'password'}
          value={state.oauth}
          onChange={e => setState({
            ...state,
            oauth: e.currentTarget.value
          })}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setState({
                  ...state,
                  showKey: !state.showKey
                })}
                edge="end"
              >
                {state.showKey ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          }
          label="Clé OAuth"
        />
      </FormControl>
      
      <Typography variant="body2" color="text.secondary">
        Obtenir la clé OAuth: {' '}
        <Link 
          href="https://twitchapps.com/tmi/" 
          target="_blank" 
          rel="noopener noreferrer"
          sx={{ 
            color: 'secondary.main',
            fontWeight: 600,
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
        >
          Ici
        </Link>
      </Typography>
      
      <Button
        variant="contained"
        color="secondary"
        disabled={state.username === '' || state.oauth === ''}
        onClick={handleSubmit}
        size="large"
        fullWidth
      >
        S'authentifier
      </Button>
    </Box>
  )
}
