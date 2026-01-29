import { useEffect, useRef, useCallback } from 'react';

/**
 * 监听滚动事件，滚动时显示滚动条，停止后自动隐藏
 */
export function useScrollbar<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const showScrollbar = useCallback(() => {
    if (ref.current) {
      ref.current.classList.add('show-scrollbar');
    }
  }, []);

  const hideScrollbar = useCallback(() => {
    if (ref.current) {
      ref.current.classList.remove('show-scrollbar');
    }
  }, []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    showScrollbar();
    timerRef.current = setTimeout(hideScrollbar, 1200);
  }, [showScrollbar, hideScrollbar]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => resetTimer();

    // 鼠标进入滚动条区域时保持显示
    const onMouseEnter = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      // 检测鼠标是否在右侧 12px 区域（滚动条区域）
      if (e.clientX > rect.right - 12) {
        if (timerRef.current) clearTimeout(timerRef.current);
        showScrollbar();
      }
    };

    const onMouseLeave = () => {
      resetTimer();
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    el.addEventListener('mouseenter', onMouseEnter);
    el.addEventListener('mouseleave', onMouseLeave);

    return () => {
      el.removeEventListener('scroll', onScroll);
      el.removeEventListener('mouseenter', onMouseEnter);
      el.removeEventListener('mouseleave', onMouseLeave);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [resetTimer, showScrollbar]);

  return ref;
}
