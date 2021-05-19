import React, { useContext } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';

import { StoreContext } from '../../context';

function ColumnNumberOption(): JSX.Element {
  const store = useContext(StoreContext);

  return (
    <div className="pt-6">
      <div className="item-title">表单布局</div>
      <div className="grid grid-cols-2 gap-8">
        <div
          onClick={() => store.setColumnsCount(1)}
          className={cs('relative p-16 rounded-8 border hover:bg-blue-100 text-center', {
            'cursor-pointer': store.columnsCount !== 1,
            'bg-blue-100': store.columnsCount === 1,
            'border-blue-600': store.columnsCount === 1,
          })}
        >
          {store.columnsCount === 1 && (
            <svg className={cs('absolute -top-1 -right-1')} width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 0H0L32 32V8C32 3.58172 28.4183 0 24 0Z" fill="#375FF3" />
              <path d="M20 11.7799L17.22 8.9999L16.2733 9.9399L20 13.6666L28 5.66656L27.06 4.72656L20 11.7799Z" fill="white" />
            </svg>
          )}
          <svg className="m-auto mb-8" width="32" height="28" viewBox="0 0 32 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="4" fill="#CBD5E1" />
            <rect y="8" width="32" height="4" fill="#CBD5E1" />
            <rect y="16" width="32" height="4" fill="#CBD5E1" />
            <rect y="24" width="32" height="4" fill="#CBD5E1" />
          </svg>
          <span className="text-caption">一列</span>
        </div>
        <div
          onClick={() => store.setColumnsCount(2)}
          className={cs('relative p-16 rounded-8 border hover:bg-blue-100 text-center', {
            'cursor-pointer': store.columnsCount !== 2,
            'bg-blue-100': store.columnsCount === 2,
            'border-blue-600': store.columnsCount === 2,
          })}
        >
          {store.columnsCount === 2 && (
            <svg className={cs('absolute -top-1 -right-1')} width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 0H0L32 32V8C32 3.58172 28.4183 0 24 0Z" fill="#375FF3" />
              <path d="M20 11.7799L17.22 8.9999L16.2733 9.9399L20 13.6666L28 5.66656L27.06 4.72656L20 11.7799Z" fill="white" />
            </svg>
          )}
          <svg className="m-auto mb-8" width="32" height="28" viewBox="0 0 32 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="18" width="14" height="4" fill="#CBD5E1" />
            <rect x="18" y="8" width="14" height="4" fill="#CBD5E1" />
            <rect x="18" y="16" width="14" height="4" fill="#CBD5E1" />
            <rect x="18" y="24" width="14" height="4" fill="#CBD5E1" />
            <rect width="15" height="4" fill="#CBD5E1" />
            <rect y="8" width="15" height="4" fill="#CBD5E1" />
            <rect y="16" width="15" height="4" fill="#CBD5E1" />
            <rect y="24" width="15" height="4" fill="#CBD5E1" />
          </svg>
          <span className="text-caption">两列</span>
        </div>
      </div>
    </div>
  );
}

export default observer(ColumnNumberOption);
