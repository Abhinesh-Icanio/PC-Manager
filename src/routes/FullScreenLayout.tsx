import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import ScrollToTop from './ScrollToTop'

const FullScreenLayout = () => {
  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: 'background.default' }}>
      <ScrollToTop />
      {/* Full Screen Content - No Sidebar */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', width: '100%' }}>
        {/* Content */}
        <Box id="main-content" sx={{ flex: 1, overflowY: 'auto', bgcolor: 'background.default' }} role="main">
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

export default FullScreenLayout
