import React from 'react';

export interface IAuthorized {
  authority: string[];
  noMatch?: JSX.Element | null;
  children: React.ReactNode;
}

export default function Authorized(
  { authority, children, noMatch = null }: IAuthorized,
): JSX.Element | null {
  if (authority.some((item) => window.ADMIN_USER_FUNC_TAGS.includes(item))) {
    return <>{children}</>;
  }
  return noMatch;
}
