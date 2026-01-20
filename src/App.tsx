import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline, Box } from '@mui/material'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import { theme } from './theme/theme'
import Dashboard from './components/Dashboard'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Products from './pages/Products'
import RateTables from './pages/RateTables'
import Schedules from './pages/Schedules'
import Methodologies from './pages/Methodologies'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
          {/* Header spans full width */}
          <Header />
          
          {/* Sidebar and Content below header */}
          <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/rate-tables" element={<RateTables />} />
                <Route path="/schedules" element={<Schedules />} />
                <Route path="/methodologies" element={<Methodologies />} />
              </Routes>
            </Box>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
