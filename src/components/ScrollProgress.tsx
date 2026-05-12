import { useEffect } from 'react';

export default function ScrollProgress() {
  useEffect(() => {
    let last = 0;
    const onScroll = () => {
      const now = Date.now();
      if (now - last < 50) return;
      last = now;
      const doc = document.documentElement;
      const scrollTop = window.pageYOffset || doc.scrollTop;
      const scrollHeight = doc.scrollHeight - window.innerHeight;
      const pct = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
      const bar = document.getElementById('scroll-progress');
      if (bar) bar.style.width = `${pct * 100}%`;
      document.documentElement.style.setProperty('--scroll-hue', `${Math.round(pct * 360)}`);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return <div id="scroll-progress" />;
}
