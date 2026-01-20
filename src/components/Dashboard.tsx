import { Box } from '@mui/material'
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
      <KeyMetrics />
      <ActiveManagementSchedules />

    </Box>
  )
}

export default Dashboard
