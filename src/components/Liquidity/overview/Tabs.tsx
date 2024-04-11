import { Tab, Tabs, TabsProps, SxProps } from '@mui/material'
import { styled } from '@mui/system'
import React from 'react'

export const PageTabs: React.FC<Pick<TabsProps, 'value' | 'onChange' | 'sx' | 'variant' | 'scrollButtons'>> = ({
	children,
	sx,
	...props
}) => (
	<StyledTabs TabIndicatorProps={{ style: { height: '0px', backgroundColor: '#fff' } }} sx={sx as SxProps} {...props}>
		{children}
	</StyledTabs>
)

export const StyledTabs = styled(Tabs)`
	min-height: 28px;
`
export const PageTab = styled(Tab)`
	font-size: 11px;
	font-weight: 600;
	&.MuiTab-root {
		padding-left: 3px;
    padding-right: 3px;
		margin-right: 20px;
		min-width: 36px;
		min-height: 28px;
		height: 28px;
		color: ${(props) => props.theme.basis.slug};
	}
	&.Mui-selected {
		background-color: ${(props) => props.theme.basis.jurassicGrey};
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
