import React from 'react'
import {
  Drawer,
  Box,
  IconButton,
  Typography,
  DrawerProps,
} from '@mui/material'
import { X } from 'lucide-react'

export interface AppDrawerProps {
  open: boolean
  onClose: () => void
  anchor?: 'left' | 'right'
  width?: number | string
  title?: string
  header?: React.ReactNode
  footer?: React.ReactNode
  children: React.ReactNode
  drawerProps?: Partial<DrawerProps>
}

const AppDrawer: React.FC<AppDrawerProps> = ({
  open,
  onClose,
  anchor = 'right',
  width = 400,
  title,
  header,
  footer,
  children,
  drawerProps = {},
}) => {
  return (
    <Drawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: width,
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        },
      }}
      {...drawerProps}
    >
      {/* Sticky Header */}
      {(title || header) && (
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: 64,
          }}
        >
          {header ? (
            header
          ) : (
            <>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {title}
              </Typography>
              <IconButton
                onClick={onClose}
                size="small"
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    bgcolor: 'action.hover',
                    color: 'text.primary',
                  },
                }}
              >
                <X size={20} />
              </IconButton>
            </>
          )}
        </Box>
      )}

      {/* Scrollable Content */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          p: 2,
        }}
      >
        {children}
      </Box>

      {/* Sticky Footer */}
      {footer && (
        <Box
          sx={{
            position: 'sticky',
            bottom: 0,
            zIndex: 10,
            bgcolor: 'background.paper',
            borderTop: '1px solid',
            borderColor: 'divider',
            p: 2,
            minHeight: 64,
          }}
        >
          {footer}
        </Box>
      )}
    </Drawer>
  )
}

export default AppDrawer
