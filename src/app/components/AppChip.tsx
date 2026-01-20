import { Chip, ChipProps } from '@mui/material'
import React from 'react'

export interface AppChipProps extends Omit<ChipProps, 'color'> {
  type?: 'rateTable' | 'methodology' | 'product' | 'schedule' | 'default'
  label: string
  size?: 'small' | 'medium'
}

// Color mapping based on dashboard metrics
const CHIP_COLORS = {
  rateTable: {
    bgcolor: 'rgba(16, 185, 129, 0.12)',
    color: '#10b981',
  },
  methodology: {
    bgcolor: 'rgba(245, 158, 11, 0.12)',
    color: '#f59e0b',
  },
  product: {
    bgcolor: 'rgba(37, 99, 235, 0.12)',
    color: '#2563eb',
  },
  schedule: {
    bgcolor: 'rgba(139, 92, 246, 0.12)',
    color: '#8b5cf6',
  },
  default: {
    bgcolor: '#f1f5f9',
    color: '#64748b',
  },
}

const AppChip: React.FC<AppChipProps> = ({
  type = 'default',
  label,
  size = 'small',
  sx,
  ...rest
}) => {
  const colors = CHIP_COLORS[type] || CHIP_COLORS.default

  return (
    <Chip
      label={label}
      size={size}
      sx={{
        height: 20,
        fontSize: '0.7rem',
        fontWeight: 500,
        bgcolor: colors.bgcolor,
        color: colors.color,
        border: `1px solid ${colors.color}20`,
        '& .MuiChip-label': {
          px: 1,
        },
        ...sx,
      }}
      {...rest}
    />
  )
}

export default AppChip
