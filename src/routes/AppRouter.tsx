import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainRoutes from './MainRoutes'

const router = createBrowserRouter([
  {
    ...MainRoutes,
  },
])

const AppRouter = () => <RouterProvider router={router} />

export default AppRouter
