import { Box, Skeleton, LinearProgress } from '@mui/material'

export const LoadingProgress = () => (
  <Box sx={{ width: '100%', }}>
    <LinearProgress color="inherit" />
  </Box>
)

export const LoadingTable = () => (
  <Box>
    <Skeleton sx={{ bgcolor: 'grey.300' }} component="div" width="100%" height="100%" animation="wave" />
  </Box>
)