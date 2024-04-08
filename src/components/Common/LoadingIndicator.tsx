import React from 'react'
import { CircularProgress, Modal, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

const LoadingIndicator = ({ open, msg, inline }: Props) => {
	if (inline)
		return (
			<LoadingBox>
				<CircularProgress color="info" />
				{msg && <Desciption variant="subtitle1">{msg}</Desciption>}
			</LoadingBox>
		)

	return (
		<Modal open={open}>
			<LoadingBox>
				<CircularProgress color="info" />
				{msg && <Desciption variant="subtitle1">{msg}</Desciption>}
			</LoadingBox>
		</Modal>
	)
}

export default LoadingIndicator

interface Props {
	inline?: boolean
	open: boolean
	msg?: string
}

const LoadingBox = styled('div')`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	display: flex;
	flex-direction: column;
	align-items: center;
	outline: none;
`

const Desciption = styled(Typography)`
	margin-top: 2rem;
	white-space: pre-line;
	text-align: center;
`

export const LoadingWrapper = styled('div')`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 999999;
`