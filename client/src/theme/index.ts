import { createTheme } from '@mui/material/styles'

import palette, { customColors } from './palette'
import typography from './typography'

const theme = createTheme({
  palette: {
    mode: 'light',
    ...palette
  },
  typography,
  shape: {
    borderRadius: 12, // Coins arrondis pour un look moderne
  },
  zIndex: {
    appBar: 1200,
    drawer: 1100,
    modal: 1300,
    snackbar: 1250
  },
  components: {
    // Global Paper component (Cards, Modals, etc.)
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(145, 70, 255, 0.12)',
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
        elevation1: {
          boxShadow: '0 2px 4px rgba(145, 70, 255, 0.1)',
        },
        elevation2: {
          boxShadow: '0 4px 8px rgba(145, 70, 255, 0.15)',
        },
      },
    },
    // Buttons with gaming style
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
          padding: '10px 24px',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 16px rgba(145, 70, 255, 0.3)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #9146FF 0%, #A970FF 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #A970FF 0%, #B084FF 100%)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #00F5A0 0%, #4AFFB4 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4AFFB4 0%, #66FFC4 100%)',
          },
        },
      },
    },
    // Cards with streaming theme
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(145, 70, 255, 0.12)',
          borderRadius: 16,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 16px rgba(145, 70, 255, 0.15)',
            borderColor: 'rgba(145, 70, 255, 0.3)',
          },
        },
      },
    },
    // AppBar with gradient
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #9146FF 0%, #A970FF 50%, #B794F6 100%)',
          borderBottom: '1px solid rgba(145, 70, 255, 0.2)',
          boxShadow: '0 2px 8px rgba(145, 70, 255, 0.2)',
        },
      },
    },
    // Drawer with light theme
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
          color: '#212121',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(0, 0, 0, 0.05)',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(145, 70, 255, 0.3)',
            borderRadius: '4px',
          },
        },
      },
    },
    // List items for navigation
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          color: '#212121',
          '&.Mui-selected': {
            backgroundColor: 'rgba(145, 70, 255, 0.1)',
            borderLeft: '4px solid #9146FF',
            color: '#9146FF',
            '&:hover': {
              backgroundColor: 'rgba(145, 70, 255, 0.15)',
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(145, 70, 255, 0.05)',
          },
        },
      },
    },
    // Text fields with light theme
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#FFFFFF',
            '& fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.23)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(145, 70, 255, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#9146FF',
              boxShadow: '0 0 0 2px rgba(145, 70, 255, 0.2)',
            },
          },
        },
      },
    },
    // Chip for status indicators
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          '&.connected': {
            backgroundColor: '#00F5A0',
            color: '#000',
          },
          '&.disconnected': {
            backgroundColor: '#FF4757',
            color: '#fff',
          },
          '&.live': {
            backgroundColor: '#FF4757',
            color: '#fff',
            animation: 'pulse 2s infinite',
          },
        },
      },
    },
    // Tables with dark theme
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          color: '#212121',
        },
        head: {
          backgroundColor: 'rgba(145, 70, 255, 0.05)',
          fontWeight: 700,
          textTransform: 'uppercase',
          fontSize: '0.75rem',
          letterSpacing: '0.1em',
          color: '#9146FF',
        },
      },
    },
    // Tooltip with light theme
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#212121',
          border: '1px solid rgba(0, 0, 0, 0.12)',
          borderRadius: 8,
          fontSize: '0.75rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
          color: '#FFFFFF',
        },
        arrow: {
          color: '#212121',
        },
      },
    },
    // IconButton for hover effects
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: 'rgba(145, 70, 255, 0.12)',
            transform: 'scale(1.05)',
          },
        },
      },
    },
  },
})

// Add global CSS animations
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    
    .icon-wrapper {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 4px;
    }
    
    .icon-wrapper.ALL { color: #00F5A0; }
    .icon-wrapper.SUB { color: #9146FF; }
    .icon-wrapper.VIP { color: #FFD700; }
    .icon-wrapper.MOD { color: #00A8FC; }
    
    .inv-actions {
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    
    .contains-inv-actions:hover .inv-actions {
      opacity: 1;
    }
  `
  document.head.appendChild(style)
}

export default theme

export {
  customColors
}
