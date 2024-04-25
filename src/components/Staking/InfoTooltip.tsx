import React from 'react'
import { styled } from '@mui/material/styles'
import { IconButton } from '@mui/material'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { InfoOutlineIcon } from '../Common/SvgIcons';

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
    <IconButton component="span" sx={{ color: color, marginLeft: '-3px' }}>
      <InfoOutlineIcon />
    </IconButton>
  </LightTooltip>
)

export default InfoTooltip;