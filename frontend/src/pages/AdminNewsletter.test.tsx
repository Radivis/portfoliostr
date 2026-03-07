import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '../test-utils/test-utils'
import AdminNewsletter from './AdminNewsletter'
import { apiRequest } from '../api/client'
import { useNewsletterDraftStore } from '../stores/newsletterDraftStore'

vi.mock('../api/client', () => ({
  apiRequest: vi.fn(),
}))

describe('AdminNewsletter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useNewsletterDraftStore.setState({
      title: '',
      htmlContent: '',
      textContent: '',
    })
  })

  it('renders newsletter form with title and content fields', () => {
    render(<AdminNewsletter />)

    expect(screen.getByRole('heading', { name: 'Send a newsletter', level: 1 })).toBeInTheDocument()
    expect(screen.getByLabelText('Newsletter title')).toBeInTheDocument()
    expect(screen.getByLabelText('HTML content')).toBeInTheDocument()
    expect(screen.getByLabelText('Text content')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Send newsletter' })).toBeInTheDocument()
  })

  it('displays values from store when pre-populated', () => {
    useNewsletterDraftStore.setState({
      title: 'Test Newsletter',
      htmlContent: '<p>HTML content</p>',
      textContent: 'Plain text content',
    })

    render(<AdminNewsletter />)

    expect(screen.getByLabelText('Newsletter title')).toHaveValue('Test Newsletter')
    expect(screen.getByLabelText('HTML content')).toHaveValue('<p>HTML content</p>')
    expect(screen.getByLabelText('Text content')).toHaveValue('Plain text content')
  })

  it('updates store when user types in fields', async () => {
    const user = userEvent.setup()
    render(<AdminNewsletter />)

    await user.type(screen.getByLabelText('Newsletter title'), 'My Newsletter')

    expect(useNewsletterDraftStore.getState().title).toBe('My Newsletter')
  })

  it('calls apiRequest when form is submitted', async () => {
    vi.mocked(apiRequest).mockResolvedValue(undefined)
    useNewsletterDraftStore.setState({
      title: 'Test Title',
      htmlContent: '<p>HTML</p>',
      textContent: 'Plain text',
    })

    const user = userEvent.setup()
    render(<AdminNewsletter />)

    await user.click(screen.getByRole('button', { name: 'Send newsletter' }))

    expect(apiRequest).toHaveBeenCalledWith(
      '/api/admin/newsletters',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('"title":"Test Title"'),
      })
    )
  })

  it('resets form after successful submission', async () => {
    vi.mocked(apiRequest).mockResolvedValue(undefined)
    useNewsletterDraftStore.setState({
      title: 'Test Title',
      htmlContent: '<p>HTML</p>',
      textContent: 'Plain text',
    })

    const user = userEvent.setup()
    render(<AdminNewsletter />)

    await user.click(screen.getByRole('button', { name: 'Send newsletter' }))

    await waitFor(() => {
      expect(useNewsletterDraftStore.getState().title).toBe('')
      expect(useNewsletterDraftStore.getState().htmlContent).toBe('')
      expect(useNewsletterDraftStore.getState().textContent).toBe('')
    })
  })

  it('shows draft restored toast when store has content from rehydration', async () => {
    const persistedState = {
      state: {
        title: 'Cached Newsletter',
        htmlContent: '<p>Cached HTML</p>',
        textContent: 'Cached plain text',
      },
    }
    localStorage.setItem('newsletter-draft', JSON.stringify(persistedState))

    render(<AdminNewsletter />)

    await act(async () => {
      await useNewsletterDraftStore.persist.rehydrate()
    })

    await waitFor(() => {
      expect(screen.getByText('Draft restored from cache')).toBeInTheDocument()
    })
  })
})
