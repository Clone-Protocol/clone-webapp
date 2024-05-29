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
		width: '120px',
		minHeight: '0px',
		maxHeight: '29px',
		paddingLeft: '2px',
		display: 'flex',
		justifyContent: 'flex-start',
		gap: '5px'
	},
	textTransform: 'none',
	fontWeight: '500',
	fontSize: '14px',
	color: '#8988a3',
	'&.Mui-selected': {
		color: '#fff',
	},
	'&.Mui-focusVisible': {
		backgroundColor: '#3d3d3d',
	},
}))
