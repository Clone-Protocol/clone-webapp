import { useEffect, useRef } from "react";

export function useClickOutside(callback: () => void) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const el = ref?.current;

      // Do nothing if clicking ref's element or descendent elements
      if (!el || el.contains(event.target as Node)) {
        return;
      }

      callback();
    }

    window?.addEventListener("click", handleClick, { capture: true });
    return () => {
      window?.removeEventListener("click", handleClick, { capture: true });
    };
  }, [callback, ref.current]);

  return ref;
}