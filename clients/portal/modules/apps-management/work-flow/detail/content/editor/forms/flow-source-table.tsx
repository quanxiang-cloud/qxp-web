import React from 'react';

export default React.createContext<{ tableID: string; tableName: string }>({ tableID: '', tableName: '' });
