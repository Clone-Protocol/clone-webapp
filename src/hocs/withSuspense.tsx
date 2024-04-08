import React, { ComponentProps, ReactElement, Suspense } from 'react'
import useMounted from '~/hooks/useMouted'

export default function withSuspense(Component: React.FC<any>, fallback: ReactElement) {
	return function withSuspenseComponent({ ...props }) {
		return (
			<SSRSafeSuspense fallback={fallback}>
				<Component {...props} />
			</SSRSafeSuspense>
		)
	}
}

function SSRSafeSuspense(props: ComponentProps<typeof Suspense>) {
	const isMounted = useMounted()

	if (isMounted) {
		return <Suspense {...props} />
	}
	return <>{props.fallback}</>
}
