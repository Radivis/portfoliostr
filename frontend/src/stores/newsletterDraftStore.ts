import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createDebouncedLocalStorage } from './createDebouncedStorage'

interface NewsletterDraftState {
  title: string
  htmlContent: string
  textContent: string
  setTitle: (title: string) => void
  setHtmlContent: (htmlContent: string) => void
  setTextContent: (textContent: string) => void
  reset: () => void
}

const initialDraft = {
  title: '',
  htmlContent: '',
  textContent: '',
}

export const useNewsletterDraftStore = create<NewsletterDraftState>()(
  persist(
    (set) => ({
      ...initialDraft,
      setTitle: (title) => set({ title }),
      setHtmlContent: (htmlContent) => set({ htmlContent }),
      setTextContent: (textContent) => set({ textContent }),
      reset: () => set(initialDraft),
    }),
    {
      name: 'newsletter-draft',
      storage: createDebouncedLocalStorage(),
      partialize: (state) => ({
        title: state.title,
        htmlContent: state.htmlContent,
        textContent: state.textContent,
      }),
    }
  )
)
