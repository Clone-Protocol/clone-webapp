import { Box, Skeleton, LinearProgress, Stack, CircularProgress, Typography, Button } from '@mui/material'
import { makeStyles } from '@mui/styles';

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

const useCircleStyles = makeStyles(() => ({
  circle: {
    stroke: "url(#linearColors)",
  },
}));

export const LoadingButton = ({ width, height, buttonTxt = 'Confirming' }: { width?: string, height?: string, buttonTxt?: string }) => {
  const classes = useCircleStyles({});
  return (
    <Button sx={{ display: 'flex', alignItems: 'center', background: '#000e22', border: 'solid 1px #c4b5fd', borderRadius: '10px', width, height }} disabled>
      <Stack direction='row' alignItems='center' gap={2}>
        <Box display='flex' alignItems='center'>
          <svg width="8" height="6">
            <linearGradient id="linearColors" x1="0" y1="0" x2="1" y2="1">
              <stop offset="25%" stopColor="#c4b5fd" />
              <stop offset="90%" stopColor="rgba (0, 133, 255, 0.0)" />
            </linearGradient>
          </svg>
          <CircularProgress classes={{ circle: classes.circle }} size={10} thickness={4} />
        </Box>
        <Typography variant='p_lg' color='#989898' noWrap>{buttonTxt}</Typography>
      </Stack>
    </Button>
  )
}

export const LoadingSkeleton = ({ height = '450px' }: { height?: string }) => {
  const classes = useCircleStyles({});
  return (
    <Box position='relative' sx={{ display: 'flex', alignItems: 'center', width: '100%', backgroundColor: '#16141b' }}>
      <Skeleton variant="rounded" sx={{ bgcolor: '#16141b', height: { xs: height, md: height } }} animation="wave" width={'100%'} />
      <Box position='absolute' left={'calc(50% - 20px)'} display='flex' justifyContent='center' alignItems='center'>
        <svg width="8" height="6">
          <linearGradient id="linearColors" x1="0" y1="0" x2="1" y2="1">
            <stop offset="25%" stopColor="#c4b5fd" />
            <stop offset="90%" stopColor="rgba (0, 133, 255, 0.0)" />
          </linearGradient>
        </svg>
        <CircularProgress classes={{ circle: classes.circle }} size={40} thickness={4} />
      </Box>
    </Box>
  )
}