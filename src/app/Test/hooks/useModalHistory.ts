import { useCallback, useState } from 'react';

interface HistoryItem {
  view: string;
  props?: Record<string, any>;
}

export const useModalHistory = (
  initialView: string = 'user',
  initialProps?: Record<string, any>,
) => {
  const [history, setHistory] = useState<HistoryItem[]>([
    { view: initialView, props: initialProps },
  ]);

  const currentItem = history[history.length - 1];
  const currentView = currentItem.view;
  const currentProps = currentItem.props || {};

  const navigateTo = useCallback(
    (view: string, props?: Record<string, any>) => {
      setHistory((prev) => [...prev, { view, props }]);
    },
    [],
  );

  const goBack = useCallback(() => {
    if (history.length > 1) {
      setHistory((prev) => prev.slice(0, -1));
    }
  }, [history.length]);

  const canGoBack = history.length > 1;

  const reset = useCallback(
    (view: string = 'user', props?: Record<string, any>) => {
      setHistory([{ view, props }]);
    },
    [],
  );

  return {
    currentView,
    currentProps,
    history,
    navigateTo,
    goBack,
    canGoBack,
    reset,
  };
};
