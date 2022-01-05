import React, { PropsWithChildren } from 'react';

import Card from '@c/card';

type Props = PropsWithChildren<{
  apps: AppInfo[];
}>;

export default function MyApps({ apps, children }: Props): JSX.Element {
  return (
    <Card
      className="applist-card p-20 mt-16"
      headerClassName="ml-8 pt-0"
      title={(
        <>
          <span className="font-semibold">我的应用</span>
          <span className="ml-4 text-gray-400">({apps.length})</span>
        </>
      )}
      itemTitleClassName="text-h6"
      contentClassName="app-list grid gap-16"
    >
      {children}
    </Card>
  );
}
