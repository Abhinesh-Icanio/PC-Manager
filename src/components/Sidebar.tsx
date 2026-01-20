import { Box, Typography, IconButton, Avatar } from '@mui/material'
import {
  LayoutDashboard,
  Package,
  Calendar,
  Scale,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
const logoImage = '/assets/dcm-logo.png'

interface NavItem {
  label: string
  icon: React.ElementType
  path: string
}

interface SidebarProps {
  isOpen?: boolean
  onToggle?: () => void
}

const Sidebar = ({ isOpen = true, onToggle }: SidebarProps) => {
  const navigate = useNavigate()
  const location = useLocation()

  const mainMenuItems: NavItem[] = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'Products', icon: Package, path: '/products' },
    { label: 'Schedules', icon: Calendar, path: '/schedules' },
    { label: 'Rate Tables', icon: Scale, path: '/rate-tables' },
    { label: 'Methodologies', icon: HelpCircle, path: '/methodologies' },
  ]

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <Box
      sx={{
        width: isOpen ? 260 : 80,
        height: '100vh',
        bgcolor: '#1e3a5f',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
        transition: 'width 0.3s ease',
        position: 'relative',
      }}
    >
      {/* Floating Toggle Button */}
      <IconButton
        onClick={onToggle}
        sx={{
          position: 'absolute',
          right: -18,
          top: 65,
          transform: 'translateY(-50%)',
          color: '#ffffff',
          bgcolor: '#1e3a5f',
          width: 34,
          height: 34,
          border: '2px solid',
          borderColor: '#ffffff',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          zIndex: 30,
          transition: 'all 0.2s ease',
          '&:hover': {
            bgcolor: '#1e3a5f',
            transform: 'translateY(-50%) scale(1.05)',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.2)',
          },
          '&:active': {
            transform: 'translateY(-50%) scale(0.95)',
          },
        }}
      >
        {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </IconButton>

      {/* Logo Section */}
      <Box
        sx={{
          height: 70,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2.5,
          borderBottom: '1px solid',
          borderColor: 'rgba(255, 255, 255, 0.1)',
        }}
      >
        <Box
          sx={{
            width: isOpen ? 'auto' : 80,
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={logoImage}
            alt="DCM Logo"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
            }}
          />
        </Box>

      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: isOpen ? 2 : 1, py: 2 }}>

        {mainMenuItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          return (
            <Box
              key={item.path}
              onClick={() => navigate(item.path)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: isOpen ? 2 : 0,
                justifyContent: isOpen ? 'flex-start' : 'center',
                p: isOpen ? 1.25 : 1,
                mb: 0.5,
                borderRadius: 1,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                bgcolor: active ? '#2563eb' : 'transparent',
                color: active ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                boxShadow: active ? '0 2px 8px rgba(37, 99, 235, 0.3)' : 'none',
                '&:hover': {
                  bgcolor: active ? '#1d4ed8' : 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                },
              }}
              title={!isOpen ? item.label : ''}
            >
              <Icon size={18} />
              {isOpen && (
                <Typography variant="body2" sx={{ fontWeight: active ? 600 : 500, fontSize: '0.875rem' }}>
                  {item.label}
                </Typography>
              )}
            </Box>
          )
        })}


      </Box>

      <Box sx={{
        display: 'flex', alignItems: 'center', gap: 1, mb: 0.25, justifyContent: 'space-between',
        p: 2,

      }}>
        {/* User Profile at Bottom */}
        {isOpen && (
          <Box
            sx={{
              borderTop: '1px solid',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: '#fb923c',
                color: '#ffffff',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              AR
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  lineHeight: 1.2,
                }}
              >
                Alex Rivera
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '0.75rem',
                }}
              >
                PC Manager
              </Typography>
            </Box>
          </Box>
        )}
        <IconButton
          size="small"
          onClick={() => { }}
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            p: 0.5,
            '&:hover': {
              color: '#ffffff',
              bgcolor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <LogOut size={20} />
        </IconButton>
      </Box>
    </Box>
  )
}

export default Sidebar
