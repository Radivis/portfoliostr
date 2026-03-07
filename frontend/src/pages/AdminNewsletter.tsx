import { useState, useEffect, useRef, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Snackbar,
} from '@mui/material'
import { apiRequest } from '../api/client'
import { useNewsletterDraftStore } from '../stores/newsletterDraftStore'

function AdminNewsletter() {
  const title = useNewsletterDraftStore((s) => s.title)
  const htmlContent = useNewsletterDraftStore((s) => s.htmlContent)
  const textContent = useNewsletterDraftStore((s) => s.textContent)
  const setTitle = useNewsletterDraftStore((s) => s.setTitle)
  const setHtmlContent = useNewsletterDraftStore((s) => s.setHtmlContent)
  const setTextContent = useNewsletterDraftStore((s) => s.setTextContent)
  const reset = useNewsletterDraftStore((s) => s.reset)

  const [idempotencyKey] = useState(() => crypto.randomUUID())
  const [showDraftRestoredToast, setShowDraftRestoredToast] = useState(false)
  const mountTimeRef = useRef(Date.now())
  const hasShownDraftRestoredToast = useRef(false)

  useEffect(() => {
    const hasContent = title || htmlContent || textContent
    const isLikelyFromCache = Date.now() - mountTimeRef.current < 500
    if (hasContent && isLikelyFromCache && !hasShownDraftRestoredToast.current) {
      hasShownDraftRestoredToast.current = true
      setShowDraftRestoredToast(true)
    }
  }, [title, htmlContent, textContent])

  const newsletterMutation = useMutation({
    mutationFn: async (data: {
      title: string
      html_content: string
      text_content: string
      idempotency_key: string
    }) => {
      return apiRequest('/api/admin/newsletters', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
    onSuccess: () => {
      reset()
    },
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    newsletterMutation.mutate({
      title,
      html_content: htmlContent,
      text_content: textContent,
      idempotency_key: idempotencyKey,
    })
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', py: 4 }}>
      <Paper sx={{ p: 4, maxWidth: 800, width: '100%' }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Send a newsletter
        </Typography>
        {newsletterMutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {newsletterMutation.error instanceof Error
              ? newsletterMutation.error.message
              : 'Failed to publish newsletter'}
          </Alert>
        )}
        {newsletterMutation.isSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            The newsletter issue has been accepted - emails will go out shortly.
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            placeholder="Enter a title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            required
            inputProps={{ 'aria-label': 'Newsletter title' }}
          />
          <TextField
            fullWidth
            label="HTML Content"
            placeholder="Enter the content of the regular (HTML) newsletter"
            value={htmlContent}
            onChange={(e) => setHtmlContent(e.target.value)}
            margin="normal"
            multiline
            rows={20}
            required
            inputProps={{ 'aria-label': 'HTML content' }}
          />
          <TextField
            fullWidth
            label="Plain text Content"
            placeholder="Enter the content of the plain text newsletter"
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            margin="normal"
            multiline
            rows={20}
            required
            inputProps={{ 'aria-label': 'Text content' }}
          />
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={newsletterMutation.isPending}
              aria-label="Send newsletter"
            >
              {newsletterMutation.isPending ? <CircularProgress size={24} /> : 'Send newsletter'}
            </Button>
            <Button
              component={Link}
              to="/admin/dashboard"
              variant="outlined"
              aria-label="Back to dashboard"
            >
              ← Back
            </Button>
          </Box>
        </form>
      </Paper>
      <Snackbar
        open={showDraftRestoredToast}
        autoHideDuration={4000}
        onClose={() => setShowDraftRestoredToast(false)}
        message="Draft restored from cache"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  )
}

export default AdminNewsletter
