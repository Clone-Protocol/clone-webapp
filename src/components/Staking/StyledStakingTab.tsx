import { styled } from '@mui/system'
import { Tabs, Tab, Box } from '@mui/material'
import { MouseEventHandler, ReactElement } from 'react'

export interface TabPanelProps {
	children?: React.ReactNode
	index: number
	value: number
}

interface StyledTabsProps {
	children?: React.ReactNode
	value: number
	onChange?: (event: React.SyntheticEvent, newValue: number) => void
}

interface StyledTabProps {
	label: string | ReactElement
	value: number
	width?: string
	allBorderRadius?: boolean
	icon?: ReactElement
	onMouseEnter?: MouseEventHandler
}

export const StyledTabs = styled((props: StyledTabsProps) => (
	<Tabs {...props} TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }} />
))({
	'& .MuiTabs-indicator': {
		display: 'none',
		justifyContent: 'center',
		backgroundColor: 'transparent',
	},
	'& .MuiTabs-indicatorSpan': {
		display: 'none'
	},
	minHeight: '32px',
	height: '32px',
	paddingTop: '0px'
})

export const StyledTab = styled((props: StyledTabProps) => <Tab disableRipple iconPosition="end" {...props} sx={{ width: props.width ? props.width : '114px', borderRadius: props.allBorderRadius ? '5px' : '0px' }} />)(({ theme }) => ({
	'&.MuiTab-root': {
		width: '72px',
		minWidth: '68px',
		height: '32px',
		minHeight: '0px',
		maxHeight: '55px',
		display: 'flex',
		whiteSpace: 'nowrap',
		borderRadius: '5px',
		'&:hover': {
			color: '#fff',
		}
	},
	fontWeight: '500',
	fontSize: '12px',
	marginLeft: '0px',
	color: '#8988a3',
	'&.Mui-selected': {
		border: 'solid 1px #332e46',
		backgroundColor: '#201c27',
	},
}))

export const CommonTab = styled((props: StyledTabProps) => (
	<StyledTab {...props} />
))({
	'&.Mui-selected': {
		border: 'solid 1px #332e46',
		backgroundImage: 'linear-gradient(106deg, #b5fdf9 1%, #c4b5fd 93%)',
		'-webkit-background-clip': 'text',
		'background-clip': 'text',
		'-webkit-text-fill-color': 'transparent',
	}
})

export const TabPanel = (props: TabPanelProps) => {
	const { children, value, index, ...other } = props

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}>
			{value === index && (
				<Box>
					<div>{children}</div>
				</Box>
			)}
		</div>
	)
}
