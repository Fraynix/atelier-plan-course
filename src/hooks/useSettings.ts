import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_SETTINGS } from '../lib/types'
import type { UserSettings } from '../lib/types'

const STORAGE_KEY = 'atelier_plan_settings'

function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_SETTINGS
    const parsed = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return DEFAULT_SETTINGS
    // Merge over defaults so a stale/partial save never crashes on a missing field.
    return { ...DEFAULT_SETTINGS, ...parsed }
  } catch {
    return DEFAULT_SETTINGS
  }
}

function saveSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // Storage unavailable (private mode, quota) — settings simply won't persist.
  }
}

/** Persists user settings to localStorage, merging over robust defaults. */
export function useSettings(): [UserSettings, (next: UserSettings) => void, () => void] {
  const [settings, setSettings] = useState<UserSettings>(loadSettings)

  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  const update = useCallback((next: UserSettings) => setSettings(next), [])
  const reset = useCallback(() => setSettings(DEFAULT_SETTINGS), [])

  return [settings, update, reset]
}
