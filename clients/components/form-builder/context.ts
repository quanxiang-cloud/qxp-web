import React from 'react';
import {
  createFormActions, ISchemaFormActions,
} from '@formily/react-schema-renderer';

import Store from './store';

export const StoreContext = React.createContext<Store>(new Store({ schema: {}, appID: '', pageID: '' }));

type FieldConfigContextType = {
  actions: ISchemaFormActions;
}

export const fieldConfigContext = {
  actions: createFormActions(),
};

export const FieldConfigContext = React.createContext<FieldConfigContextType>(fieldConfigContext);
