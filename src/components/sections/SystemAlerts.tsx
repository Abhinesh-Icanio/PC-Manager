import { Box, Typography, Card, CardContent, Grid } from '@mui/material'
import { CheckCircle2, AlertCircle, Cloud } from 'lucide-react'
import { LucideIcon } from 'lucide-react'

interface Alert {
  type: 'success' | 'error' | 'info'
  title: string
  message: string
  icon: LucideIcon
  iconColor: string
  bgColor: string
}

const SystemAlerts = () => {
  const alerts: Alert[] = [
    {
      type: 'success',
      title: 'Peak Performance',
      message: "Tiered Methodology 'Delta' reached 99.1% efficiency at 09:00 UTC.",
      icon: CheckCircle2,
      iconColor: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)'
    },
    {
      type: 'error',
      title: 'Latency Alert',
      message: 'Node US-E1 showing +15ms delay in schedule processing pipelines.',
      icon: AlertCircle,
      iconColor: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.1)'
    },
    {
      type: 'info',
      title: 'Cloud Sync',
      message: 'Global snapshot synchronization completed. 4.2GB of metadata archived.',
      icon: Cloud,
      iconColor: '#2563eb',
      bgColor: 'rgba(37, 99, 235, 0.1)'
    }
  ]

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          color: 'text.primary',
          mb: 2,
          textTransform: 'uppercase',
          letterSpacing: 1,
          fontSize: '0.875rem',
        }}
      >
        SYSTEM ALERTS & INSIGHTS
      </Typography>
      <Grid container spacing={2}>
        {alerts.map((alert, index) => {
          const Icon = alert.icon
          return (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  bgcolor: alert.bgColor,
                  border: '1px solid',
                  borderColor: alert.iconColor + '40',
                  borderRadius: 2.5,
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                    borderColor: alert.iconColor + '80',
                  },
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'start', gap: 1.5 }}>
                    <Box sx={{ color: alert.iconColor, mt: 0.5 }}>
                      <Icon size={22} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, color: 'text.primary' }}>
                        {alert.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem', lineHeight: 1.6 }}>
                        {alert.message}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}

export default SystemAlerts
