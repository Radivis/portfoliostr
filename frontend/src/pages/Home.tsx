import {
  Typography,
  Box,
  Container,
} from '@mui/material'
import { useTheme } from '../contexts/ThemeContext'
import { getHomePageGradient } from '../theme'
import { bodyParagraphSx } from '../styles'
import SubscribeForm from '../components/SubscribeForm'


function Home() {
  const { mode } = useTheme()

  const gradientBackground = getHomePageGradient(mode)

  return (
    <Box
      sx={{
        minHeight: '60vh',
        background: gradientBackground,
        display: 'flex',
        alignItems: 'center',
        borderRadius: 2,
        py: 6,
        borderTop: '2px solid',
        borderBottom: '2px solid',
        borderColor: 'primary.main',
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 600,
            textAlign: 'center',
            mb: 4,
          }}
        >
          My Portfolio
        </Typography>

        <Typography variant="body1" sx={{ ...bodyParagraphSx, mb: 2 }}>
          This is a simple portfolio page based on Portfoliostr that I use to showcase my work.
        </Typography>
        <SubscribeForm />
      </Container>
    </Box>
  )
}

export default Home
