import { Badge, Box, IconButton, Typography } from '@mui/material'
import { Bell } from 'lucide-react'

const Header = () => {
  const currentDate = new Date()
  const formattedDate = currentDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  const formattedTime = currentDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

  return (
    <Box
      sx={{
        height: 70,
        bgcolor: '#f8fafc',
        borderBottom: '1px solid',
        borderColor: '#e2e8f0',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'end',
        px: 4,
        position: 'relative',
        zIndex: 10,
      }}
    >
     
      {/* Right Side - Icons and Date/Time */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        {/* Notifications */}
        <IconButton
          sx={{
            color: '#475569',
            '&:hover': {
              bgcolor: '#ffffff',
              color: '#1e293b',
            },
          }}
        >
          <Badge badgeContent={3} color="error">
            <Bell size={20} />
          </Badge>
        </IconButton>


        {/* Date and Time */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: '#1e293b',
              fontSize: '0.875rem',
              lineHeight: 1.2,
            }}
          >
            {formattedDate}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: '#64748b',
              fontSize: '0.75rem',
            }}
          >
            {formattedTime}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default Header
