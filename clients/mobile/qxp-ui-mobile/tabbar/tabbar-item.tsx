import React, { useContext, useMemo } from 'react';
import cs from 'classnames';
import Icon from '../icon';
import { TabbarItemProps } from '@m/qxp-ui-mobile/tabbar/types';
import TabbarContext from '@m/qxp-ui-mobile/tabbar/context';
import Badge from '@m/qxp-ui-mobile/badge';

const TabbarItem: React.FC<TabbarItemProps> = (props) => {
  const { setActive, index } = props;
  const { parent } = useContext(TabbarContext);
  if (!parent) return null;
  const { activeColor, inactiveColor } = parent;

  const active = useMemo(() => {
    return (props.name || index) === parent.value;
  }, [props.name, index, parent.value]);

  function onClick(event: React.MouseEvent): void {
    setActive?.(props.name ?? index ?? 0);
    props.onClick?.(event);
  }

  function renderIcon(): React.ReactNode {
    if (typeof props.icon === 'string') {
      return <Icon name={props.icon} />;
    }
    if (typeof props.icon === 'function') {
      return props.icon(active);
    }
    return null;
  }

  const color = active ? activeColor : inactiveColor;

  return (
    <div
      className={cs('tabbar-item', props.className, { 'tabbar-item--active': active })}
      style={{ ...props.style, color }}
      onClick={onClick}
    >
      <Badge {...props.badge} className={'tabbar-item__icon'}>
        {renderIcon()}
      </Badge>
      <div className='text'>
        {typeof props.children === 'function' ? props.children(active) : props.children}
      </div>
    </div>
  );
};

export default TabbarItem;
