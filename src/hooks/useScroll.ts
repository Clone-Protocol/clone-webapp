import { useState, useEffect } from 'react'

export function useScroll() {
	const [scrolled, setScrolled] = useState(false)

	const listener = () => {
		if (window.pageYOffset === 0 && scrolled === true) setScrolled(false)
		else if (scrolled === false) setScrolled(true)
	}

	useEffect(() => {
		window.addEventListener('scroll', listener)
		return () => {
			window.removeEventListener('scroll', listener)
		}
	})

	return {
		scrolled,
	}
}
