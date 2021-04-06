import React, { useReducer, createContext } from 'react';
import { defaultContext, IDefaultContext } from './default-context';

interface IAction extends IDefaultContext { type: string; }
const reducer = (state: IDefaultContext, action: IAction) => {
  switch (action.type) {
  case 'reset':
    return defaultContext;
  case 'setTheme':
    return { ...state, themeName: action.themeName };
  case 'setLang':
    return { ...state, siteLang: action.siteLang };
  }
  return state;
};

export interface IContextValue {
  state: IDefaultContext;
  dispatch: React.Dispatch<IAction>;
}
const AppContext = createContext<IContextValue>({ state: defaultContext, dispatch: () => {} });

interface IAppContextProvider {
  children: React.ReactNode;
}
const AppContextProvider = ({ children }: IAppContextProvider) => {
  const [state, dispatch] = useReducer<typeof reducer>(reducer, defaultContext);
  const value = { state, dispatch };
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

const AppContextConsumer = AppContext.Consumer;

export { AppContext, AppContextProvider, AppContextConsumer };
