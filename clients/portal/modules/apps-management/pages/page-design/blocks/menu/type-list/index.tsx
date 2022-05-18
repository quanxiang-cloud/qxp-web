import React, { useEffect } from 'react';
import cs from 'classnames';

import TypeItem from './type-item';
import type { BlockStates } from '../../fountainhead/type';
import { TYPE_LIST } from './constants';

import styles from './style.m.scss';

interface Props {
  current?: string;
  onClick: (name: string) => void;
  blockStates: BlockStates;
  initBlockStates: (names: string[]) => void;
  cleanBlockStates: (names: string[]) => void;
}

const TypeList = (props: Props): JSX.Element => {
  const { current, onClick, blockStates, initBlockStates, cleanBlockStates } = props;

  useEffect(() => {
    const names = TYPE_LIST.map((({ name }) => name));
    initBlockStates(names);
    return () => cleanBlockStates(names);
  }, []);

  return (
    <div className={cs(styles.sourcePanel, 'flex flex-col items-center relative')}>
      {TYPE_LIST.map((type) => {
        const { name } = type;
        return (
          <TypeItem
            {...type}
            key={name}
            active={current === name}
            onClick={() => onClick(name)}
            clickOutsideWhiteList={blockStates[name]?.clickOutsideWhiteList}
          />
        );
      })}
    </div>
  );
};

export default TypeList;
