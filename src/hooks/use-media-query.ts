import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    const listener = () => setMatches(media.matches);
    
    // Support for older browsers
    media.addEventListener
      ? media.addEventListener('change', listener)
      : media.addListener(listener);
    
    return () => {
      media.removeEventListener
        ? media.removeEventListener('change', listener)
        : media.removeListener(listener);
    };
  }, [matches, query]);

  return matches;
}
