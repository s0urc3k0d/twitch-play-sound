import React from 'react'
import {
  Paper,
  Typography,
  Box,
  styled,
  alpha
} from '@mui/material'

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  background: `linear-gradient(135deg, 
    ${alpha(theme.palette.primary.main, 0.02)} 0%, 
    ${alpha(theme.palette.secondary.main, 0.01)} 100%)`,
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  borderRadius: theme.spacing(2),
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.08)}`,
    borderColor: alpha(theme.palette.primary.main, 0.2),
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: `linear-gradient(90deg, 
      ${theme.palette.primary.main} 0%, 
      ${theme.palette.secondary.main} 100%)`,
    opacity: 0.7,
  }
}))

const TitleSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  position: 'relative',
  zIndex: 1,
}))

const GlowText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(135deg, 
    ${theme.palette.primary.main} 0%, 
    ${theme.palette.secondary.main} 100%)`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 700,
  fontSize: '1.5rem',
}))

const IconContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  borderRadius: '50%',
  background: `linear-gradient(45deg, 
    ${alpha(theme.palette.primary.main, 0.1)}, 
    ${alpha(theme.palette.secondary.main, 0.1)})`,
  color: theme.palette.primary.main,
  marginRight: theme.spacing(2),
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  }
}))

const ContentArea = styled(Box)({
  position: 'relative',
  zIndex: 1,
})

interface StreamerLayoutProps {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
  actions?: React.ReactNode
}

const StreamerLayout: React.FC<StreamerLayoutProps> = ({ 
  title, 
  icon, 
  children, 
  actions 
}) => {
  return (
    <StyledPaper elevation={1}>
      <TitleSection>
        {icon && (
          <IconContainer>
            {icon}
          </IconContainer>
        )}
        <Box sx={{ flexGrow: 1 }}>
          <GlowText variant="h4">
            {title}
          </GlowText>
        </Box>
        {actions && (
          <Box sx={{ ml: 2 }}>
            {actions}
          </Box>
        )}
      </TitleSection>
      
      <ContentArea>
        {children}
      </ContentArea>
    </StyledPaper>
  )
}

export default StreamerLayout
