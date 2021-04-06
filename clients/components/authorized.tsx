import React from 'react';

import { usePortalGlobalValue } from '../common/states/portal';

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
