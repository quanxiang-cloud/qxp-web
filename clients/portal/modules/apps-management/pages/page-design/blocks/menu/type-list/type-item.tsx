import React, { useRef, useEffect } from 'react';
import { when } from 'ramda';
import cs from 'classnames';

import { Icon } from '@one-for-all/ui';

import styles from './style.m.scss';

export interface TypeItemProps {
  icon: string;
  name: string;
  label: string;
  className?: string;
  active?: boolean;
  onClick?: () => void;
  clickOutsideWhiteList?: Set<HTMLElement>;
}

function TypeItem(props: TypeItemProps): JSX.Element {
  const { active, className, onClick, icon, label, clickOutsideWhiteList } = props;
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    when((list) => !!list, () => clickOutsideWhiteList?.add(ref.current!))(clickOutsideWhiteList);
    () => clickOutsideWhiteList?.delete(ref.current!);
  }, [clickOutsideWhiteList]);

  const cls = cs(
    'flex flex-col items-center mb-20 cursor-pointer',
    { [styles.active]: active },
    styles.group,
    className,
  );

  return (
    <div
      ref={ref}
      className={cls}
      onClick={onClick}
    >
      <Icon name={icon} color='gray' clickable changeable />
      <p className='text-gray-600 text-10'>{label}</p>
    </div>
  );
}

export default TypeItem;
