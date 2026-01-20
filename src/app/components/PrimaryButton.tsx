import { Button } from '@mui/material'
import { ReactNode } from 'react'

interface PrimaryButtonProps {
  label: string
  onClick?: () => void
  startIcon?: ReactNode
}

const PrimaryButton = ({ label, onClick, startIcon }: PrimaryButtonProps): JSX.Element => {
  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={startIcon}
      onClick={onClick}
      sx={{
        textTransform: 'none',
        fontWeight: 600,
        px: 3,
        py: 1,
      }}
    >
      {label}
    </Button>
  )
}

export default PrimaryButton
