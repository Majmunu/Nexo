import { useCallback, useEffect, useState } from 'react';

interface ModalState {
  visible: boolean;
  props: Record<string, any>;
}

class ModalManager {
  private states = new Map<string, ModalState>();
  private listeners = new Set<() => void>();

  show(id: string, props: Record<string, any> = {}) {
    this.states.set(id, { visible: true, props });
    this.notify();
  }

  hide(id: string) {
    const current = this.states.get(id);
    if (current) {
      this.states.set(id, { ...current, visible: false });
      this.notify();
    }
  }

  remove(id: string) {
    this.states.delete(id);
    this.notify();
  }

  getState(id: string): ModalState | undefined {
    return this.states.get(id);
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }
}

const modalManager = new ModalManager();

export const useNiceModal = (id: string) => {
  const [state, setState] = useState<ModalState>(
    () => modalManager.getState(id) || { visible: false, props: {} },
  );

  useEffect(() => {
    modalManager.subscribe(() => {
      const newState = modalManager.getState(id);
      if (newState) {
        setState(newState);
      }
    });
  }, [id]);

  const show = useCallback(
    (props: Record<string, any> = {}) => {
      modalManager.show(id, props);
    },
    [id],
  );

  const hide = useCallback(() => {
    modalManager.hide(id);
  }, [id]);

  const remove = useCallback(() => {
    modalManager.remove(id);
  }, [id]);

  return {
    visible: state.visible,
    props: state.props,
    show,
    hide,
    remove,
  };
};

export { modalManager };
