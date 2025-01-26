import { useState, useEffect, useRef } from 'react';

/**
 * A reusable hook for lazy loading items in a scrollable container.
 * @param items Array of items to render.
 * @param initialCount Initial number of items to display.
 * @param increment Number of items to load with each scroll.
 */
const useLazyLoad = <T>(
  items: T[],
  initialCount: number,
  increment: number
) => {
  const [visibleItems, setVisibleItems] = useState<T[]>([]);
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setVisibleItems(items.slice(0, visibleCount));
  }, [items, visibleCount]);

  useEffect(() => {
    const handleScroll = () => {
      if (!listRef.current) return;

      const { scrollTop, clientHeight, scrollHeight } = listRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        setVisibleCount((prev) => Math.min(prev + increment, items.length));
      }
    };

    const refCurrent = listRef.current;
    refCurrent?.addEventListener('scroll', handleScroll);
    return () => refCurrent?.removeEventListener('scroll', handleScroll);
  }, [items.length, increment]);

  return { visibleItems, listRef };
};

export default useLazyLoad;
