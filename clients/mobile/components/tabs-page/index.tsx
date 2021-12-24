import React from 'react';
import cs from 'classnames';
import { useHistory } from 'react-router-dom';

import NavBar from '@m/qxp-ui-mobile/nav-bar';
import Tabs from '@m/qxp-ui-mobile/tabs';
import { isDef } from '@m/qxp-ui-mobile/utils';
import { NumberString, Props } from '@m/qxp-ui-mobile';

export interface TabTitle {
  key: string;
  label: string;
}

export interface TabsPageProps extends Props {
  tabs: TabTitle[];
  active: NumberString;
  title?: React.ReactNode;
  onChange?: (active: NumberString) => void;
  navBottom?: React.ReactNode;
  renderTab?: (tab: TabTitle, index: number) => React.ReactNode;
  absolute?: boolean;
  useTabName?: boolean;
}

export default function TabsPage(props: TabsPageProps): JSX.Element {
  const history = useHistory();
  const hasTitle = isDef(props.title);

  return (
    <div className={cs(`bg-white ${props.absolute ? 'absolute top-0 left-0' : ''}`, props.className)}
      style={{ height: '100vh', zIndex: 1, ...(props.style ?? {}) }}>

      {hasTitle && (<NavBar leftArrow safeAreaInsetTop
        fixed placeholder
        title={props.title}
        onClickLeft={() => history.goBack()}
      />)}

      <Tabs sticky canSwipe animated
        active={props.active}
        offsetTop={hasTitle ? '0.44rem' : 0}
        titleClassName='title3'
        onChange={(active) => props.onChange?.(active)}
        navBottom={props.navBottom}
        titleActiveColor='var(--blue-600)'
        titleInactiveColor='var(--gray-400)'>
        {
          props.tabs.map((tab, index) => {
            return (
              <Tabs.TabPane
                title={tab.label}
                key={tab.key}
                name={props.useTabName ? tab.key : undefined}
              >
                {props.renderTab?.(tab, index)}
              </Tabs.TabPane>
            );
          })
        }
      </Tabs>

    </div>
  );
}
