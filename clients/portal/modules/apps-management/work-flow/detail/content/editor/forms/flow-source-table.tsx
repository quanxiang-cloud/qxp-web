import React from 'react';

type ContextType = {
  tableID: string;
  tableName: string;
  tableSchema: ISchema;
}

export default React.createContext<ContextType>({ tableID: '', tableName: '', tableSchema: {} });
