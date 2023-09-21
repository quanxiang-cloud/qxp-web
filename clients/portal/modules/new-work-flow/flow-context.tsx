import React from 'react';

export default React.createContext<{ appID: string; flowID: string; }>({ appID: '', flowID: '' });
