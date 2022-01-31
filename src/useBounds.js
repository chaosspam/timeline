import { useState, useEffect, useRef } from 'react';

export function useBounds() {
  const ref = useRef();
  const [bound, setBound] = useState(getRect(ref ? ref.current : null));

  function updateBound() {
    setBound(getRect(ref.current));
  }

  useEffect(() => {

    const element = ref.current;
    if (!element) {
      return;
    }

    updateBound();

    if (typeof ResizeObserver === 'function') {
      let resizeObserver = new ResizeObserver(updateBound);
      resizeObserver.observe(element);

      // Clean up, remove resize observer
      return () => {
        if (!resizeObserver) { return; }
        resizeObserver.disconnect();
        resizeObserver = null;
      }
    } else {
      // Fallback, update on resize
      window.addEventListener('resize', updateBound);
      return () => window.removeEventListener('resize', updateBound);
    }
  }, []);

  return [bound, ref, updateBound];
}

function getRect(element) {
  if (!element) {
    return {
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0,
    };
  }

  return element.getBoundingClientRect();
}