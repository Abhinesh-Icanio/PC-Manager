import { Box } from '@mui/material'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import ScrollToTop from './ScrollToTop'

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <ScrollToTop />
      {/* Sidebar - Full Height */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Main Content Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <Header />
        
        {/* Content */}
        <Box id="main-content" sx={{ flex: 1, overflowY: 'auto', bgcolor: 'background.default' }} role="main">
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

export default MainLayout
