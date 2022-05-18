import React, { useState, useMemo } from 'react';
import cs from 'classnames';
import { Icon } from '@one-for-all/ui';

import styles from '../index.m.scss';

type Props = {
  name: string;
  spec: { apiID: string, [key: string]: unknown };
  onDelete?: () => void;
};

export default function DisplayApi({
  name,
  spec,
  onDelete,
}: Props): JSX.Element {
  const [expand, setExpand] = useState(true);

  const [apiPath, method] = useMemo(() => {
    return spec.apiID.split(':');
  }, [spec]);

  return (
    <div className={cs('px-8 py-4', styles.varItem, expand && styles.expand)}>
      <div
        className={cs('flex justify-between cursor-pointer', styles.bar)}
        onClick={() => setExpand(!expand)}
      >
        <div className={cs('flex-1 font-medium', styles.varName)}>
          <span>{name}</span>
        </div>
        <div className="flex">
          <Icon name='delete' clickable onClick={onDelete} />
          <Icon name={expand ? 'expand_less' : 'expand_more'} clickable onClick={() => setExpand(!expand)}/>
        </div>
      </div>
      <div className={styles.varCont}>
        <div className='flex items-center mb-8 mt-8'>
          <span>路径:</span>
          <span className='flex-wrap break-all flex-1 ml-6'>{apiPath}</span>
        </div>
        <div className='flex items-center mb-8'>
          <span>请求方法:</span>
          <span className='flex-wrap break-all flex-1 ml-6'>{method}</span>
        </div>
        <div className='flex items-center mb-8'>
          <span>描述:</span>
          <span className='flex-wrap break-all flex-1 ml-6'>{spec.desc as string}</span>
        </div>
      </div>
    </div>
  );
}
