import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainRoutes from './MainRoutes'
import FullScreenLayout from './FullScreenLayout'
import RateTableUpload from '../pages/rate-tables/RateTableUpload'

const router = createBrowserRouter([
  {
    ...MainRoutes,
  },
  {
    element: <FullScreenLayout />,
    children: [
      { path: '/rate-tables/create', element: <RateTableUpload /> },
      { path: '/rate-tables/:id/edit', element: <RateTableUpload /> },
    ],
  },
])

const AppRouter = () => <RouterProvider router={router} />

export default AppRouter
