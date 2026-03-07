import { createDebouncedJSONStorage } from 'zustand-debounce'

export const DEBOUNCE_MS = 1000

export function createDebouncedLocalStorage() {
  return createDebouncedJSONStorage('localStorage', { debounceTime: DEBOUNCE_MS })
}
