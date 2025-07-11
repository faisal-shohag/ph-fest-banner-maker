import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles.css'
import { ThemeProvider } from './contexts-providers/theme-provider.tsx'
import { RouterProvider } from 'react-router'
import { router } from './routes.tsx'
import { AuthProvider } from './contexts-providers/auth-provider.tsx'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/react-query.ts'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
        <QueryClientProvider client={queryClient}>
    <ThemeProvider>
    <AuthProvider>
      <RouterProvider router={router} />
            <Toaster/>
    </AuthProvider>
    </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
