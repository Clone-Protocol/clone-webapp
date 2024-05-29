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
	'& .MuiTabs-flexContainer': {
		overflowX: 'auto',
		'&::-webkit-scrollbar': {
			display: 'none'
		}
	},
	minHeight: '36px',
	height: '36px',
	paddingTop: '0px'
})

export const StyledTab = styled((props: StyledTabProps) => <Tab disableRipple iconPosition="start" {...props} sx={{ width: props.width ? props.width : '114px', borderRadius: props.allBorderRadius ? '5px' : '0px' }} />)(({ theme }) => ({
	'&.MuiTab-root': {
		height: '36px',
		minHeight: '0px',
		maxHeight: '55px',
		display: 'flex',
		whiteSpace: 'nowrap',
		borderRadius: '10px',
		'&:hover': {
			color: '#fff',
		}
	},
	fontWeight: '500',
	fontSize: '14px',
	marginLeft: '0px',
	color: '#8988a3',
	'&.Mui-selected': {
		border: 'solid 1px #c4b5fd',
		backgroundColor: '#1d142e',
		color: '#fff',
	},
}))

export const CommonTab = styled((props: StyledTabProps) => (
	<StyledTab {...props} />
))({
	width: '138px',
	'&.Mui-selected': {
		background: '#16141b',
		borderStyle: 'solid',
		borderTopLeftRadius: '10px',
		borderTopRightRadius: '10px',
		borderBottomLeftRadius: '0px',
		borderBottomRightRadius: '0px',
		border: 'none'
	}
})

export const LiquidityTab = styled((props: StyledTabProps) => (
	<StyledTab {...props} />
))({
	width: '138px',
	'&.Mui-selected': {
		background: '#201c27',
		borderColor: 'transparent',
		borderTopColor: '#332e46',
		borderLeftColor: '#332e46',
		borderRightColor: '#332e46',
		borderWidth: '1px',
		borderStyle: 'solid',
		borderTopLeftRadius: '10px',
		borderTopRightRadius: '10px',
		borderBottomLeftRadius: '0px',
		borderBottomRightRadius: '0px',
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

export const TabPanelForEdit = (props: TabPanelProps) => {
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