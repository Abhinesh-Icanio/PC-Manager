import { Button } from '@mui/material'
import { LucideIcon } from 'lucide-react'

interface ActionButtonProps {
  label: string
  icon?: LucideIcon
  variant?: 'text' | 'outlined' | 'contained'
  color?: 'primary' | 'secondary' | 'inherit'
  onClick?: () => void
}

const ActionButton = ({
  label,
  icon: Icon,
  variant = 'outlined',
  color = 'inherit',
  onClick,
}: ActionButtonProps) => {
  return (
    <Button
      variant={variant}
      color={color}
      startIcon={Icon ? <Icon size={18} /> : undefined}
      onClick={onClick}
      sx={{
        textTransform: 'none',
        fontWeight: 500,
      }}
    >
      {label}
    </Button>
  )
}

export default ActionButton
