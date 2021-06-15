import { createContext } from 'react';
import { createFormActions, ISchemaFormActions } from '@formily/antd';

import { FieldConfigContext } from '../../../form-settings-panel/form-field-config/context';

export { StoreContext } from '../../../context';

export const ActionsContext = FieldConfigContext;
export const ItemActionsContext = createContext<ISchemaFormActions>(createFormActions());
