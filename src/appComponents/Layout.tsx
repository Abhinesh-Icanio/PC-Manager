import { Box } from '@mui/material'
import React from 'react'

interface LayoutProps {
    header: React.ReactNode
    children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ header, children }) => {
    return (
        <Box
            sx={{
                p: 4,

                minHeight: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Sticky Header */}
            <Box
                sx={{

                    top: 0,
                    zIndex: 5,
                    bgcolor: 'background.default',
                    pb: 3,
                    pt: 1
                }}
            >
                {header}
            </Box>

            {/* Main Content */}
            <Box
                sx={{
                    flex: 1,
                }}
            >
                {children}
            </Box>
        </Box>
    )
}

export default Layout
