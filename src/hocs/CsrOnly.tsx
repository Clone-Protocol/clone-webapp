import React from 'react'
import useMounted from '~/hooks/useMouted'

const CsrOnly: React.FC = ({ children, ...delegated }) => {
	const isMounted = useMounted()

	if (!isMounted) return null

	return <React.Fragment {...delegated}>{children}</React.Fragment>
}

export function withCsrOnly(Component: React.FC<any>) {
	return function withCsrOnlyComponent({ ...props }) {
		return (
			<CsrOnly>
				<Component {...props} />
			</CsrOnly>
		)
	}
}

export default CsrOnly
