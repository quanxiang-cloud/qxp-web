import React, { useEffect, useState } from 'react';
import { useSearchParam } from 'react-use';
import { useHistory } from 'react-router-dom';
import cs from 'classnames';
import { observer } from 'mobx-react';

import { Tabbar } from '@m/qxp-ui-mobile/tabbar';
import Icon from '@m/qxp-ui-mobile/icon';
import msgCenter from '@portal/stores/msg-center';
import store from '@home/pages/store';
import { BadgeSettingProps } from '@m/qxp-ui-mobile/badge/types';
import { pathPrefix } from '@m/constant';
import { isNumeric } from '@m/qxp-ui-mobile/utils';

import { HomeItem } from './types';
import Notify from './notify';
import Workbench from './workbench';
import Mine from './mine';
import './index.scss';

const items: HomeItem[] = [
  {
    title: '通知',
    icon: 'notify',
    component: Notify,
  },
  {
    title: '工作台',
    icon: 'workbench',
    component: Workbench,
  },
  {
    title: '我的',
    icon: 'mine',
    component: Mine,
  },
];

function Dashboard(): JSX.Element {
  const history = useHistory();
  const active = useSearchParam('active');
  function initActive(): number {
    if (!isNumeric(active || '') || Number(active) > 2 || Number(active) < 0) {
      return 0;
    } else {
      return Number(active);
    }
  }
  const [ac, setAc] = useState(initActive());

  useEffect(() => {
    document.title = '工作台';
  }, []);

  function onActiveChange(ac: number): void {
    history.replace(`${pathPrefix}?active=${ac}`);
    setAc(ac);
  }

  function badgeProps(index: number): BadgeSettingProps | undefined {
    const showBadge = index === 0 && (
      !!store.TODO_LIST.find((itm) => itm.value > 0) ||
      !!store.HANDLE_LIST.find((itm) => (itm.count ?? 0) > 0) ||
      msgCenter.countUnread > 0
    );
    return showBadge ? { dot: true, offset: ['-0.02rem', '-0.02rem'] } : undefined;
  }

  function renderIcon(active: boolean, item: HomeItem): JSX.Element {
    return (
      <Icon
        addPrefix={true}
        name={item.icon}
        size='.28rem'
        style={{
          fill: active ? 'var(--blue-600)' : 'var(--gray-400)',
          color: active ? 'var(--gray-400)' : 'var(--gray-600)',
          opacity: active ? 1 : 0.5,
        }}/>
    );
  }

  return (
    <div className={cs('flex flex-col', ac !== 2 ? 'bg-white' : 'bg-app')} style={{ height: '100vh' }}>
      <div className={cs('flex-1 overflow-scroll', ac !== 2 ? 'bg-app' : 'bg-white')}>
        {items.map(
          (itm, index) => itm.component( {
            key: itm.icon,
            active: ac === index,
          }),
        )}
      </div>

      <Tabbar
        placeholder
        value={ac}
        className={cs({ footer: ac !== 2 })}
        onChange={(ac) => onActiveChange(ac as number)}>
        {items.map((itm, index) => (
          <Tabbar.Item
            key={itm.icon}
            icon={(ac) => renderIcon(ac, itm)}
            badge={badgeProps(index)}>
            {itm.title}
          </Tabbar.Item>
        ))
        }
      </Tabbar>
    </div>
  );
}

export default observer(Dashboard);
