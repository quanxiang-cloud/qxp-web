import React from 'react';

import { usePortalGlobalValue } from '../state/portal';

export interface IAuthorized {
  authority: string[];
  noMatch?: JSX.Element | null;
  children: React.ReactNode;
}

export default function Authorized({ authority, children, noMatch = null }: IAuthorized) {
  const [value] = usePortalGlobalValue();
  if (authority.some((item) => value.authority.includes(item))) {
    return children;
  }
  return noMatch;
}
