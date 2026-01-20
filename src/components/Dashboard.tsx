import { Box, Typography } from '@mui/material'
import ActiveManagementSchedules from './sections/ActiveManagementSchedules'
import KeyMetrics from './sections/KeyMetrics'

const Dashboard = () => {
    return (
        <Box
            sx={{
                flex: 1,
                overflowY: 'auto',
                bgcolor: 'background.default',
                p: 4,
            }}
        >
            {/* Welcome Section */}
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        color: 'text.primary',
                        mb: 1,
                        fontSize: '1.875rem',
                    }}
                >
                    Primary Compensation
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        color: 'text.secondary',
                        fontSize: '1rem',
                    }}
                >
                    Welcome back! Here's an overview of your compensation management dashboard.
                </Typography>
            </Box>

            <KeyMetrics />
            <ActiveManagementSchedules />
        </Box>
    )
}

export default Dashboard
