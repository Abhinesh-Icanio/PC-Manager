import { Box, Avatar, Typography, Badge, IconButton } from '@mui/material'
import { Bell } from 'lucide-react'
import logoImage from '../dcm-logo.png'

const Header = () => {
  return (
    <Box
      sx={{
        height: 70,
        bgcolor: 'primary.main',
        borderBottom: '1px solid',
        borderColor: 'primary.dark',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 4,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Logo Section */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{
            width: 150,
            height: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={logoImage}
            alt="DCM Logo"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </Box>
      </Box>
      
      {/* Right Side */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        {/* Notifications */}
        <IconButton
          sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
            },
          }}
        >
          <Badge badgeContent={3} color="error">
            <Bell size={20} />
          </Badge>
        </IconButton>

        {/* User Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar 
            sx={{ 
              width: 36, 
              height: 36, 
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            AT
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#ffffff', lineHeight: 1.2 }}>
              A. Thompson
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.75rem' }}>
              Admin
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Header
