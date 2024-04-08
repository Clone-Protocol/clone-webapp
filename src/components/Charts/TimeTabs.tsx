import { Tab, Tabs, TabsProps, SxProps } from '@mui/material'
import { styled } from '@mui/material/styles'
import React from 'react'

export enum FilterTimeMap {
	'24h' = '24h',
	'7d' = '7d',
	'30d' = '30d',
	'1y' = '1y',
}
export type FilterTime = keyof typeof FilterTimeMap

export const TimeTabs: React.FC<Pick<TabsProps, 'value' | 'onChange' | 'sx' | 'variant' | 'scrollButtons'>> = ({
	children,
	sx,
	...props
}) => (
	<StyledTabs TabIndicatorProps={{ style: { height: '0px', backgroundColor: '#fff' } }} sx={sx as SxProps} {...props}>
		{children}
	</StyledTabs>
)

export const StyledTabs = styled(Tabs)`
	height: 20px;
  border-radius: 10px;
  padding-top: 4px;
  padding-left: 4px;
	padding-right: 4px;
	min-height: 23px;
`
export const TimeTab = styled(Tab)`
	font-size: 10px;
	font-weight: 500;
	text-transform: none;
	color: #fff;
	&.MuiTab-root {
		padding: 0px;
    min-width: 36px;
		height: 15px;
		min-height: 15px;
		border-radius: 10px;
		color: #989898;
		text-transform: none;
	}
	&.Mui-selected {
    background-color: #414166;
		color: #fff;
	}
	&.Mui-focusVisible {
		background-color: #fff;
		color: #fff;
	}
	.highlight {
		color: #fff;
	}
`
