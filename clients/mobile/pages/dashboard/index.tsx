import React, { useEffect, useState } from 'react';
import { Tabbar } from '@m/qxp-ui-mobile/tabbar';
import Icon from '@m/qxp-ui-mobile/icon';
import './index.scss';
import Notify from './notify';
import Workbench from './workbench';
import Mine from './mine';
import { HomeItem } from '@m/pages/dashboard/types';
import cs from 'classnames';
import { observer } from 'mobx-react';
import msgCenter from '@portal/stores/msg-center';
import store from '@home/pages/store';
import { BadgeSettingProps } from '@m/qxp-ui-mobile/badge/types';

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
  const [active, setActive] = useState(0);

  useEffect(() => {
    document.title = '工作台';
  }, []);

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
    <div className='flex flex-col' style={{ height: '100vh' }}>
      <div className='flex-1 overflow-scroll'>
        {items.map(
          (itm, index) => itm.component( {
            key: itm.icon,
            active: active === index,
          }),
        )}
      </div>

      <Tabbar
        fixed={false}
        value={active}
        className={cs({ footer: active !== 2 })}
        onChange={(ac) => setActive(ac as number)}>
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
