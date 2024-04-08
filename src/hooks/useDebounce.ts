import { useRef, useState } from 'react';

const useDebounce = (callback: (newData: string) => void, term: number) => {
	const timer = useRef<ReturnType<typeof setTimeout>>();

	const dispatchDebounce = (newData: string) => {
		if (timer.current) {
			clearTimeout(timer.current);
		}
		const newTimer = setTimeout(() => {
			callback(newData);
		}, term);
		timer.current = newTimer;
	};
	return dispatchDebounce;
};
export default useDebounce;
