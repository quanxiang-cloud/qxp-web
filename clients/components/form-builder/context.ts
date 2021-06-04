import { createFormActions, createAsyncFormActions, ISchemaFormActions } from '@formily/react-schema-renderer';
import React from 'react';

import registry, { Registry } from './registry';
import Store from './store';

const defaultContext: ContextProps = {
  activeItem: {},
  registry: registry,
};

type ContextProps = {
  registry: Registry;
  activeItem: any;
  data?: any;
  setData?: (data: any) => void;
  deleteItem?: (item: any, index: number) => void;
  duplicateItem?: (item: any, index: number) => void;
  setCurrentActiveItem?: (item: any) => void;
}

export const FormBuilderContext = React.createContext<ContextProps>(defaultContext);

export const useFormBuilderContext = () => React.useContext(FormBuilderContext);

export const StoreContext = React.createContext<Store>(new Store({ schema: {} }));

type FieldConfigContextType = {
  actions: ISchemaFormActions;
}

export const fieldConfigContext = {
  actions: createFormActions(),
  asyncActions: createAsyncFormActions()
};

export const FieldConfigContext = React.createContext<FieldConfigContextType>(fieldConfigContext);
