import { Box, Grid } from '@mui/material'
import { Calendar, CheckCircle2, Package, Scale } from 'lucide-react'
import MetricCard from '../../appComponents/MetricCard'

const KeyMetrics = () => {
  const metrics = [
    {
      title: 'Products',
      value: '70',
      icon: Package,
      iconColor: '#2563eb', // Primary blue
      bgColor: 'rgba(37, 99, 235, 0.12)',
      route: '/products'
    },
    {
      title: 'Rate Tables',
      value: '40',
      icon: Scale,
      iconColor: '#10b981', // Success green
      bgColor: 'rgba(16, 185, 129, 0.12)',
      route: '/rate-tables'
    },
    {
      title: 'Schedules',
      value: '28',
      icon: Calendar,
      iconColor: '#8b5cf6', // Purple
      bgColor: 'rgba(139, 92, 246, 0.12)',
      route: '/schedules'
    },
    {
      title: 'Methodologies',
      value: '9',
      icon: CheckCircle2,
      iconColor: '#f59e0b', // Amber
      bgColor: 'rgba(245, 158, 11, 0.12)',
      route: '/methodologies'
    }
  ]

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <MetricCard
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              iconColor={metric.iconColor}
              bgColor={metric.bgColor}
              route={metric.route}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default KeyMetrics
