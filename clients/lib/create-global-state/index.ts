import { useState } from 'react';
import { IHookStateInitAction, IHookStateSetAction, resolveHookState } from './hook-state';
import useEffectOnce from './use-effect-once';
import useIsomorphicLayoutEffect from './useIsomorphic-layout-effect';

export function createGlobalState<S = any>(
  initialState: IHookStateInitAction<S>,
  isDev?: boolean,
): () => [S, (state: IHookStateSetAction<S>) => void];
export function createGlobalState<S = undefined>(): () => [
  S,
  (state: IHookStateSetAction<S>) => void,
];

export function createGlobalState<S>(initialState?: S, isDev?: boolean) {
  const store: {
    state: S;
    setState: (state: IHookStateSetAction<S>) => void;
    setters: any[];
  } = {
    state: initialState instanceof Function ? initialState() : initialState,
    setState(nextState: IHookStateSetAction<S>) {
      store.state = resolveHookState(nextState, store.state);
      if (isDev) {
        localStorage.setItem('globalState', JSON.stringify(store.state));
      }
      store.setters.forEach((setter) => setter(store.state));
    },
    setters: [],
  };

  return () => {
    const [globalState, stateSetter] = useState<S | undefined>(store.state);

    useEffectOnce(() => () => {
      store.setters = store.setters.filter((setter) => setter !== stateSetter);
    });

    useIsomorphicLayoutEffect(() => {
      if (!store.setters.includes(stateSetter)) {
        store.setters.push(stateSetter);
      }
    });

    return [globalState, store.setState];
  };
}

export default createGlobalState;
