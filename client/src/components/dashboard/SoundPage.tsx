import React, { useState } from 'react'
import { useSounds } from '../../hooks/useSounds'
import { EditSound } from '../../types'
import StreamerLayout from './StreamerLayout'

import {
  SoundTable,
  NewSoundDialog,
  EditSoundDialog
} from '.'

import {
  Tooltip,
  Fab,
  Box
} from '@mui/material'

import { 
  VolumeUp as VolumeUpIcon,
  Add as AddIcon 
} from '@mui/icons-material'

export default () => {
  const {
    sounds,
    loading,
    addSound,
    editSound,
    deleteSound
  } = useSounds()

  const [ isNewDialogOpen, setIsNewDialogOpen ] = useState(false)
  const [ editableSound, setEditableSound ] = useState<null | EditSound>(null)

  return (
    <StreamerLayout 
      title="Gestionnaire de Sons" 
      icon={<VolumeUpIcon />}
      actions={
        <Tooltip title="Ajouter un nouveau son">
          <Fab
            color="secondary"
            onClick={() => setIsNewDialogOpen(true)}
            sx={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              background: 'linear-gradient(45deg, #00F5A0 30%, #00C875 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #00C875 30%, #00A563 90%)',
                boxShadow: '0 8px 32px rgba(0, 245, 160, 0.4)',
                transform: 'scale(1.05)',
              }
            }}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
      }
    >
      <Box sx={{ mb: 3 }}>
        <SoundTable
          sounds={sounds}
          loading={loading}
          onDelete={deleteSound}
          onEdit={setEditableSound}
        />
      </Box>
      
      <NewSoundDialog
        isOpen={isNewDialogOpen}
        onClose={() => setIsNewDialogOpen(false)}
        onAdd={addSound}
      />
      <EditSoundDialog
        isOpen={editableSound !== null}
        onClose={() => setEditableSound(null)}
        sound={editableSound}
        onEdit={editSound}
        setSound={setEditableSound}
      />
    </StreamerLayout>
  )
}
