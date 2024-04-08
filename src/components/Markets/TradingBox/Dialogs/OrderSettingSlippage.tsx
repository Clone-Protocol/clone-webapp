import { Tabs, Tab } from '@mui/material'
import { styled } from '@mui/material/styles'

interface StyledTabsProps {
	children?: React.ReactNode
	value: number
	onChange: (event: React.SyntheticEvent, newValue: number) => void
}

interface StyledTabProps {
	label: string
	value: number
}

export const StyledTabs = styled((props: StyledTabsProps) => (
	<Tabs {...props} TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }} />
))({
	minHeight: '0px',
	'& .MuiTabs-indicator': {
		display: 'flex',
		justifyContent: 'center',
		backgroundColor: 'transparent',
	},
	'& .MuiTabs-indicatorSpan': {
		display: 'none'
	},
})

export const StyledTab = styled((props: StyledTabProps) => <Tab disableRipple {...props} />)(({ theme }) => ({
	'&.MuiTab-root': {
		width: '50px',
		minWidth: '0px',
		maxWidth: '50px',
		minHeight: '0px',
		maxHeight: '40px',
		height: '40px',
		display: 'flex',
		// backgroundColor: 'rgba(255, 255, 255, 0.05)'
	},
	textTransform: 'none',
	fontSize: '14px',
	backgroundColor: 'rgba(255, 255, 255, 0.05)',
	color: 'rgba(255, 255, 255, 0.7)',
	'&:hover': {
		borderRadius: '7px',
		backgroundColor: 'rgba(255, 255, 255, 0.1)',
		color: '#fff',
	},
	'&.Mui-selected': {
		backgroundColor: 'rgba(255, 255, 255, 0.05)',
		color: '#fff',
		// border: 'solid 1px #c4b5fd',
		boxShadow: '#c4b5fd 0 0 1px 1px inset',
		borderRadius: '7px',
		// backgroundImage: 'radial-gradient(circle at -63% 50%, #ff6cdf, rgba(66, 0, 255, 0) 48%), radial-gradient(circle at 215% 71%, #ff6cdf, rgba(66, 0, 255, 0) 66%)'
	}
}))