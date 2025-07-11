import { RefObject, useEffect, useRef } from 'react';

export function useScrollBottomReached(
  container: RefObject<HTMLElement | null>,
  callback: () => void,
  offset: number = 0
) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!container.current) return;
    
    const handleScroll = () => {
      if (!container.current) return;
      
      const { scrollTop, clientHeight, scrollHeight } = container.current;
      
      if (scrollTop + clientHeight >= scrollHeight - offset) {
        callbackRef.current();
      }
    };

    const element = container.current;
    element.addEventListener('scroll', handleScroll);

    return () => {
      element.removeEventListener('scroll', handleScroll);
    };
  }, [container, offset]);
} 