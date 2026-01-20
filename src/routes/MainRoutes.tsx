import MainLayout from './MainLayout'
import Dashboard from '../components/Dashboard'
import Products from '../pages/Products'
import RateTables from '../pages/RateTables'
import Schedules from '../pages/Schedules'
import Methodologies from '../pages/Methodologies'

const MainRoutes = {
  element: <MainLayout />,
  children: [
    { path: '/', element: <Dashboard /> },
    { path: '/products', element: <Products /> },
    { path: '/rate-tables', element: <RateTables /> },
    { path: '/schedules', element: <Schedules /> },
    { path: '/methodologies', element: <Methodologies /> },
  ],
}

export default MainRoutes
