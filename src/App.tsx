import React, { useEffect } from 'react'
import { AppShell } from './components/layout/AppShell'
import { useCalendarStore } from './store/calendarStore'
import { useStravaStore } from './store/stravaStore'
import { exchangeCode } from './lib/stravaApi'

// Handle Strava callback if code is in URL (fallback for SPA routing)
function useStravaCallback() {
  const stravaStore = useStravaStore()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    if (!code || !stravaStore.clientSecret) return

    // Remove code from URL without reloading
    window.history.replaceState({}, '', window.location.pathname)

    exchangeCode(code, stravaStore.clientSecret)
      .then(tokens => stravaStore.setTokens(tokens))
      .catch(err => console.error('Token exchange failed:', err))
  }, [])
}

export default function App() {
  const { darkMode } = useCalendarStore()
  useStravaCallback()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return <AppShell />
}
