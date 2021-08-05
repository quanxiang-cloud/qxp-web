import React from 'react';

type ContextType = {
  tableID: string;
  tableName: string;
  tableSchema: SchemaField[];
}

export default React.createContext<ContextType>({ tableID: '', tableName: '', tableSchema: [] });
