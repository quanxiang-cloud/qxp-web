import NavBar from '@m/qxp-ui-mobile/nav-bar';
import Tabs from '@m/qxp-ui-mobile/tabs';
import React from 'react';
import { isDef } from '@m/qxp-ui-mobile/utils';
import { useHistory } from 'react-router-dom';
import { Props } from '@m/qxp-ui-mobile';
import cs from 'classnames';

export interface TabTitle {
  key: string;
  label: string;
}

export interface TabsPageProps extends Props {
  tabs: TabTitle[];
  active: number;
  title?: React.ReactNode;
  onChange?: (active: number) => void;
  navBottom?: React.ReactNode;
  renderTab?: (tab: TabTitle, index: number) => React.ReactNode;
}

export default function TabsPage(props: TabsPageProps): JSX.Element {
  const history = useHistory();
  const hasTitle = isDef(props.title);

  return (
    <div className={cs('bg-white', props.className)}
      style={{ height: '100vh', ...(props.style ?? {}) }}>

      {hasTitle && (<NavBar leftArrow safeAreaInsetTop
        fixed placeholder
        title={props.title}
        onClickLeft={() => history.goBack()}
      />)}

      <Tabs sticky canSwipe animated
        active={props.active}
        offsetTop={hasTitle ? '0.44rem' : 0}
        titleClassName='title3'
        onChange={(active) => props.onChange?.(active as number)}
        navBottom={props.navBottom}
        titleActiveColor='var(--blue-600)'
        titleInactiveColor='var(--gray-400)'>
        {
          props.tabs.map((tab, index) => {
            return (
              <Tabs.TabPane title={tab.label} key={tab.key}>
                {props.renderTab?.(tab, index)}
              </Tabs.TabPane>
            );
          })
        }
      </Tabs>

    </div>
  );
}
