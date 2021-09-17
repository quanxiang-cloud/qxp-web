import { createContext } from 'react';
import { createFormActions, ISchemaFormActions } from '@formily/antd';

export const ItemActionsContext = createContext<ISchemaFormActions>(createFormActions());
