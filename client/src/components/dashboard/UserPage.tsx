import React, { useState } from 'react'
import { UserTable, NewUserDialog, EditUserDialog } from '.'
import StreamerLayout from './StreamerLayout'
import { User } from '../../types'
import { useUsers } from '../../hooks'

import {
  Tooltip,
  Fab,
  Box
} from '@mui/material'

import { 
  People as PeopleIcon,
  PersonAdd as PersonAddIcon 
} from '@mui/icons-material'

export default () => {
  const [ isNewDialogOpen, setIsNewDialogOpen ] = useState(false)
  const [ editableUser, setEditableUser ] = useState<null | User>(null)
  const {
    users,
    loading,
    addUser,
    deleteUser,
    editUser
  } = useUsers()

  return (
    <StreamerLayout 
      title="Gestion des Utilisateurs" 
      icon={<PeopleIcon />}
      actions={
        <Tooltip title="Ajouter un nouvel utilisateur">
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
            <PersonAddIcon />
          </Fab>
        </Tooltip>
      }
    >
      <Box sx={{ mb: 3 }}>
        <UserTable
          users={users}
          loading={loading}
          onDelete={deleteUser}
          onEdit={(user) => setEditableUser(user)}
        />
      </Box>
      
      <NewUserDialog
        isOpen={isNewDialogOpen}
        onClose={() => setIsNewDialogOpen(false)}
        onAdd={addUser}
      />
      <EditUserDialog
        isOpen={editableUser !== null}
        onClose={() => setEditableUser(null)}
        user={editableUser}
        onEdit={editUser}
        setUser={setEditableUser}
      />
    </StreamerLayout>
  )
}
