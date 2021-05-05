import { createFormActions, ISchemaFormActions } from '@formily/react-schema-renderer';
import React from 'react';

type FieldConfigContextType = {
  actions: ISchemaFormActions;
}

export const fieldConfigContext = {
  actions: createFormActions(),
};

// todo give me a better name
export const FieldConfigContext = React.createContext<FieldConfigContextType>(fieldConfigContext);
