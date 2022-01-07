import React from 'react';
import { useGetGlobalConfig } from '@lib/configuration-center';

import Routes from './routes';

export default function Application(): JSX.Element {
  const [userStyleConfig, loading] = useGetGlobalConfig('user_style_config', '0.1.0', { css: {} });
  React.useEffect(() => {
    if (loading) {
      return;
    }

    const head = document.getElementsByTagName('head')[0];

    Object.entries(userStyleConfig.css).map(([key, cssString]) => {
      const style = document.createElement('style');
      style.setAttribute('id', `custom-css-${key}`);
      style.appendChild(document.createTextNode(cssString as string));
      head.appendChild(style);
    });
  }, [userStyleConfig, loading]);

  return (
    <>
      <Routes />
    </>
  );
}
