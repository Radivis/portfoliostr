import { Snackbar } from '@mui/material'
import { SNACKBAR_AUTO_HIDE_MS } from '../constants/ui'

interface DraftRestoredSnackbarProps {
  open: boolean
  onClose: () => void
}

export function DraftRestoredSnackbar({ open, onClose }: DraftRestoredSnackbarProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={SNACKBAR_AUTO_HIDE_MS}
      onClose={onClose}
      message="Draft restored from cache"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    />
  )
}
