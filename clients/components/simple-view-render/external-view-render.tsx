import React from 'react';

import { realizeLink } from '@lib/utils';

type Props = {
  link: string;
}

export default function ExternalViewRender({ link }: Props): JSX.Element {
  const appID = window.APP_ID;

  return (
    <div className="w-full h-full">
      <iframe
        className="w-full h-full"
        src={realizeLink(appID, link)}
        style={{ border: 'none' }}
      />
    </div>
  );
}
