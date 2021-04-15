import React from 'react';

import registry, { Registry } from './registry';
import Store from './store';

const defaultContext: ContextProps = {
  updateData: () => {},
  activeItem: {},
  registry: registry,
};

type ContextProps = {
  registry: Registry;
  activeItem: any;
  updateData: (source: Source, target: TargetItem, dropPosition: string) => void,
  data?: any;
  setData?: (data: any) => void;
  deleteItem?: (item: any, index: number) => void;
  duplicateItem?: (item: any, index: number) => void;
  setCurrentActiveItem?: (item: any) => void;
}

export const FormBuilderContext = React.createContext<ContextProps>(defaultContext);

export const useFormBuilderContext = () => React.useContext(FormBuilderContext);

export const StoreContext = React.createContext<Store>(new Store({ schema: {} }));
