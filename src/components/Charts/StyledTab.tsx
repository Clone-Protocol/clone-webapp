import { Tabs, Tab } from '@mui/material'
import { styled } from '@mui/material/styles'
import { ReactElement } from 'react'

export interface TabPanelProps {
	children?: React.ReactNode
	index: number
	value: number
}

interface StyledTabsProps {
	children?: React.ReactNode
	value: number
	onChange: (event: React.SyntheticEvent, newValue: number) => void
}

interface StyledTabProps {
	label: string
	value: number
	icon?: ReactElement
}

export const StyledTabs = styled((props: StyledTabsProps) => (
	<Tabs {...props} TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }} />
))({
	'& .MuiTabs-indicator': {
		display: 'flex',
		justifyContent: 'center',
		backgroundColor: 'transparent',
	},
	'& .MuiTabs-indicatorSpan': {
		display: 'none'
	},
})

export const StyledTab = styled((props: StyledTabProps) => <Tab disableRipple iconPosition="start" {...props} />)(({ theme }) => ({
	'&.MuiTab-root': {
		height: '29px',
		minHeight: '0px',
		maxHeight: '29px',
		paddingLeft: '2px',
		display: 'flex',
		gap: '5px'
	},
	textTransform: 'none',
	fontWeight: '500',
	fontSize: '12px',
	color: '#989898',
	'&.Mui-selected': {
		color: '#fff',
		textDecoration: 'underline',
		textUnderlinePosition: 'under'
	},
	'&.Mui-focusVisible': {
		backgroundColor: '#3d3d3d',
	},
}))
