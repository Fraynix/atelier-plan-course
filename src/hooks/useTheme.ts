import { useCallback, useEffect, useState } from 'react'

export type ThemePreference = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'atelier_plan_theme'

function loadTheme(): ThemePreference {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === 'light' || raw === 'dark' || raw === 'system') return raw
    return 'system'
  } catch {
    return 'system'
  }
}

/** Applies `data-theme` on <html> and persists the choice. 'system' clears the attribute. */
export function useTheme(): [ThemePreference, (next: ThemePreference) => void] {
  const [theme, setThemeState] = useState<ThemePreference>(loadTheme)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'system') {
      root.removeAttribute('data-theme')
    } else {
      root.setAttribute('data-theme', theme)
    }
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // Storage unavailable — theme choice just won't persist across reloads.
    }
  }, [theme])

  const setTheme = useCallback((next: ThemePreference) => setThemeState(next), [])

  return [theme, setTheme]
}
