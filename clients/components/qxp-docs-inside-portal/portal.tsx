import React from 'react';
import ReactDOM from 'react-dom';

import InsideDocsPortal from './index';
import type { Props } from './index';

export default function openDocsPortal(props: Props): Record<string, () => void> {
  const container = document.createElement('div');
  container.id = 'portal-wrap';

  const close = (): void => {
    ReactDOM.unmountComponentAtNode(container);
    document.body.removeChild(container);
  };

  if (!document.getElementById('portal-wrap')) {
    document.body.appendChild(container);
    ReactDOM.render((
      <InsideDocsPortal
        {...props}
        close={close}
      />
    ), container);
  }

  return {
    close,
  };
}

