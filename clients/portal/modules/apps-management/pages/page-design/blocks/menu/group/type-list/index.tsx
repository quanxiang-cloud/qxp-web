import React from 'react';
import cs from 'classnames';

import TypeItem from './type-item';
import { TYPE_LIST } from './constants';

import styles from './style.m.scss';

interface Props {
  current: string;
  onClick: (name: string) => void;
}

const TypeList = ({ current, onClick }: Props): JSX.Element => {
  return (
    <div className={cs(styles.sourcePanel, 'flex flex-col items-center relative')}>
      {TYPE_LIST.map((type) => {
        return (
          <TypeItem
            {...type}
            key={type.name}
            active={current === type.name}
            onClick={() => onClick(type.name)}
          />
        );
      })}
    </div>
  );
};

export default TypeList;
