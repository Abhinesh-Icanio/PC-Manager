import { Card, CardContent, Box, Typography } from '@mui/material'
import { LucideIcon, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface MetricCardProps {
  title: string
  value: string
  icon: LucideIcon
  iconColor: string
  bgColor: string
  route: string
}

const MetricCard = ({ title, value, icon: Icon, iconColor, bgColor, route }: MetricCardProps) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(route)
  }

  return (
    <Card
      sx={{
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        border: '1px solid',
        borderColor: '#e2e8f0',
        bgcolor: '#ffffff',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: `0 8px 16px ${iconColor}20`,
          borderColor: iconColor,
          '& .metric-arrow': {
            color: iconColor,
            transform: 'translateX(4px)',
          },
        },
      }}
      onClick={handleClick}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Box
            sx={{
              display: 'inline-flex',
              p: 1.5,
              borderRadius: 2,
              backgroundColor: bgColor,
              border: `1px solid ${iconColor}20`,
            }}
          >
            <Icon 
              size={20} 
              style={{ color: iconColor }}
            />
          </Box>

        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary', fontSize: '1.75rem', lineHeight: 1.2 }}>
          {value}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '0.8125rem' }}>
          {title}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default MetricCard
