import { Box, Typography } from '@mui/material'
import { Filter, Download, History, Plus } from 'lucide-react'
import ActionButton from '../../app/components/ActionButton'
import PrimaryButton from '../../app/components/PrimaryButton'

const QuickActions = () => {
  const actions = [
    {
      label: 'Update Methodology',
      icon: Filter
    },
    {
      label: 'Export Report',
      icon: Download
    },
    {
      label: 'Archive Sessions',
      icon: History
    }
  ]

  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 600,
          color: '#1f2937',
          mb: 2,
          fontSize: '0.875rem',
        }}
      >
        Quick Actions
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
        {actions.map((action, index) => (
          <ActionButton
            key={index}
            label={action.label}
            icon={action.icon}
            variant="outlined"
          />
        ))}
        <Box sx={{ flex: 1 }} />
        <PrimaryButton label="New Pipeline" startIcon={<Plus size={18} />} />
      </Box>
    </Box>
  )
}

export default QuickActions
