import React from 'react'
import { styled } from '@mui/material/styles'
import { IconButton } from '@mui/material'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import HelpOutlineRounded from '@mui/icons-material/HelpOutlineRounded'

export const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#151515',
    color: '#BEBEBE',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: '#151515',
  },
}));

const InfoTooltip = ({ title, color = 'inherit' }: { title: string, color?: string }) => (
  <LightTooltip title={title} placement="top" arrow>
    <IconButton component="span" sx={{ color: color }}>
      <HelpOutlineRounded sx={{ width: '11px', height: '11px' }} />
    </IconButton>
  </LightTooltip>
)

export default InfoTooltip;