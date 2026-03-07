import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BlogPostStatus } from '../api/blog'
import { createDebouncedLocalStorage } from './createDebouncedStorage'

export interface BlogDraft {
  title: string
  content: string
  status: BlogPostStatus
}

interface BlogDraftState {
  drafts: Record<string, BlogDraft>
  upsertDraft: (postId: string, draft: Partial<BlogDraft>) => void
  getDraft: (postId: string) => BlogDraft | undefined
  clearDraft: (postId: string) => void
}

export const useBlogDraftStore = create<BlogDraftState>()(
  persist(
    (set, get) => ({
      drafts: {},
      upsertDraft: (postId, draft) =>
        set((state) => {
          const existing = state.drafts[postId] ?? {
            title: '',
            content: '',
            status: 'draft' as BlogPostStatus,
          }
          return {
            drafts: {
              ...state.drafts,
              [postId]: { ...existing, ...draft },
            },
          }
        }),
      getDraft: (postId) => get().drafts[postId],
      clearDraft: (postId) =>
        set((state) => ({
          drafts: Object.fromEntries(
            Object.entries(state.drafts).filter(([key]) => key !== postId)
          ),
        })),
    }),
    {
      name: 'blog-drafts',
      storage: createDebouncedLocalStorage(),
      partialize: (state) => ({ drafts: state.drafts }),
    }
  )
)
