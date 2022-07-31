import React, { createContext, useContext, PropsWithChildren } from 'react';

interface ContextState {
  onPanelHide?: () => void;
  onPanelClose?: () => void;
}

const FountainheadContext = createContext<ContextState>({});

type Props = PropsWithChildren<ContextState>;

export function FountainheadContextProvider({ children, ...props }: Props): JSX.Element {
  return <FountainheadContext.Provider value={props}>{children}</FountainheadContext.Provider>;
}

export function useFoutainheadContext(): ContextState {
  return useContext(FountainheadContext);
}
