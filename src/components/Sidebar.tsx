import { Box, Typography, IconButton } from '@mui/material'
import { 
  LayoutDashboard, 
  LogOut, 
  Package, 
  Calendar, 
  Scale, 
  HelpCircle,
  Menu,
  ChevronLeft
} from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

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

  const navItems: NavItem[] = [
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
        height: 'calc(100vh - 70px)',
        bgcolor: '#ffffff',
        borderRight: '1px solid',
        borderColor: '#e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '1px 0 2px rgba(0, 0, 0, 0.02)',
        transition: 'width 0.3s ease',
        position: 'relative',
      }}
    >
      {/* Floating Toggle Button */}
      <IconButton
        onClick={onToggle}
        sx={{
          position: 'absolute',
          right: -16,
          top: 20,
          transform: 'translateY(0)',
          color: '#64748b',
          bgcolor: '#ffffff',
          width: 30,
          height: 30,
          border: '1px solid',
          borderColor: '#4c81f4',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: '50%',
          zIndex: 10,
          '&:hover': {
            bgcolor: '#2563eb',
            borderColor: '#2563eb',
            color: '#e5e7eb',
          },
        }}
      >
        {isOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}
      </IconButton>

      {/* Navigation */}
      <Box sx={{ flex: 1, px: isOpen ? 2 : 1, py: 2 }}>
        {navItems.map((item) => {
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
                color: active ? '#ffffff' : '#64748b',
                '&:hover': {
                  bgcolor: active ? '#1d4ed8' : '#f1f5f9',
                  color: active ? '#ffffff' : '#1e293b',
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

      {/* Logout */}
      {isOpen && (
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: '#e2e8f0' }}>
          <Box
            onClick={() => {}}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 1.25,
              borderRadius: 1,
              border: '1px solid',
              borderColor: '#cbd5e1',
              color: '#475569',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              '&:hover': {
                bgcolor: '#2563eb',
                color: '#ffffff',
                borderColor: '#2563eb',
              },
            }}
          >
            <LogOut size={16} />
            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
              Logout
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default Sidebar
