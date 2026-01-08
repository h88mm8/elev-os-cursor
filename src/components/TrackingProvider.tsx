import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView } from '@/utils/tracking'

export function TrackingProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  useEffect(() => {
    // Track page view on route change
    trackPageView(location.pathname)
  }, [location])

  return <>{children}</>
}

