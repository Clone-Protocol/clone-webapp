import React from 'react';
import { Box, Typography } from '@mui/material'
import { LoadingProgress } from '~/components/Common/Loading'
import { useWallet } from '@solana/wallet-adapter-react'
import withSuspense from '~/hocs/withSuspense'
import { useUserTotalBalanceQuery } from '~/features/Portfolio/UserBalance.query';
import { formatLocaleAmount } from '~/utils/numbers';

const PortfolioBalance: React.FC = () => {
	const { publicKey } = useWallet()

	const { data: balance } = useUserTotalBalanceQuery({
		userPubKey: publicKey,
		refetchOnMount: 'always',
		enabled: publicKey != null
	})

	return (
		<Box mt='30px'>
			<Box>
				<Box mb='33px'><Typography variant='p_xxlg' color='#c4b5fd'>My Portfolio Balance</Typography></Box>
				<Box>
					<Typography fontSize={38}>${balance ? formatLocaleAmount(balance) : '0.00'}</Typography>
				</Box>
			</Box>
		</Box>
	)
}

export default withSuspense(PortfolioBalance, <LoadingProgress />)
