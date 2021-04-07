import React from 'react';

import { usePortalGlobalValue } from '../portal/states_to_be_delete/portal';

export interface IAuthorized {
  authority: string[];
  noMatch?: JSX.Element | null;
  children: React.ReactNode;
}

export default function Authorized({ authority, children, noMatch = null }: IAuthorized) {
  const [{ userInfo }] = usePortalGlobalValue();
  if (authority.some((item) => userInfo.authority.includes(item))) {
    return <>{children}</>;
  }
  return noMatch;
}
