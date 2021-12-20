import React, { forwardRef, useContext, useMemo, useState } from 'react';
import { TabPaneProps, TabsProps } from './types';
import TabsContext from './context';
import { NumberString } from '@m/qxp-ui-mobile';
import { useUpdateEffect } from 'react-use';

const TabPane = forwardRef<HTMLDivElement, TabPaneProps>((props: TabPaneProps, ref) => {
  const parent = useContext(TabsContext);

  const [inited, setInited] = useState(false);

  const { animated, canSwipe, lazyRender } = parent.props as TabsProps;
  const { index } = props;

  const getName = (): NumberString => props.name ?? index ?? 0;

  const init = (): void => {
    setInited(true);
  };

  const isActive = useMemo(() => {
    const active = getName() === parent.currentName;

    if (active && !inited) {
      init();
    }

    return active;
  }, [inited, parent.currentName]);

  useUpdateEffect(() => {
    parent.setLine?.();
    parent.scrollIntoView?.();
  }, [props.title]);

  const show = isActive;

  if (animated || canSwipe) {
    return <div className='tab__pane'>{props.children}</div>;
  }

  const shouldRender = inited || !lazyRender;
  const Content = shouldRender ? props.children : null;

  return (
    <div
      ref={ref}
      style={{ display: show ? 'block' : 'none' }}
      role="tabpanel"
      className='tab__pane'
    >
      {Content}
    </div>
  );
});

export default TabPane;
