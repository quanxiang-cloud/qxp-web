import React, { useState } from 'react';
import { TreeProps, Icon } from '@QCFE/lego-ui';
import { twCascade } from '@mariusmarais/tailwind-cascade';
import useDebounce from 'react-use/lib/useDebounce';

import { deepClone } from '@assets/lib/f';

interface IOnRow {
  onClick: (node: ITreeData, parent?: ITreeData) => void;
}

export interface ITreeData {
  key: string;
  title: string;
  children: Array<ITreeData>;
  disabled?: boolean;
  selectable?: boolean;
  icon?: JSX.Element;
  id?: string;
}
interface ITree extends TreeProps {
  treeData: ITreeData[];
  keyword?: string;
  visible?: boolean;
  onRow?: IOnRow;
  className?: string;
  itemClassName?: string;
  appendixRender?: (row: ITreeData) => JSX.Element;
  selectable?: boolean;
  selectedClassName?: string;
  expandOnSelect?: boolean;
}

export const Tree = ({
  treeData,
  keyword,
  onRow,
  visible = true,
  className,
  itemClassName,
  appendixRender,
  selectable,
  selectedClassName,
  expandOnSelect,
}: ITree) => {
  const [dataSource, setDataSource] = useState<ITreeData[]>(deepClone(treeData));
  const [selectedKey, setSelectedKey] = useState<string | null>(
    selectable ? dataSource[0]?.key : null,
  );

  const buildDataSourceWithKeyword = (data: ITreeData[], k: string): ITreeData[] => {
    const newData = [];
    for (const item of data) {
      if (item.title.includes(k)) {
        newData.push(item);
      } else if (item.children) {
        newData.push(...buildDataSourceWithKeyword(item.children, k));
      }
    }
    return newData;
  };

  useDebounce(
    () => setDataSource(keyword ? () => buildDataSourceWithKeyword(treeData, keyword) : treeData),
    500,
    [keyword],
  );

  return (
    <ul
      className={twCascade(
        'flex flex-col transition-all',
        {
          'h-0': !visible,
          'overflow-hidden': !visible,
        },
        className,
      )}
    >
      {dataSource.map((row) => (
        <TreeRow
          visible
          row={row}
          key={row.key}
          keyword={keyword}
          level={1}
          onRow={onRow}
          className={itemClassName}
          appendixRender={appendixRender}
          selectedClassName={selectedClassName}
          selectedKey={selectedKey}
          setSelectedKey={setSelectedKey}
          expandOnSelect={expandOnSelect}
        />
      ))}
    </ul>
  );
};

interface ITreeRow {
  row: ITreeData;
  level: number;
  keyword?: string;
  visible?: boolean;
  parent?: ITreeData;
  onRow?: IOnRow;
  className?: string;
  appendixRender?: (row: ITreeData) => JSX.Element;
  selectedClassName?: string;
  selectedKey?: string | null;
  setSelectedKey: Function;
  expandOnSelect?: boolean;
}
const TreeRow = ({
  row,
  keyword,
  visible,
  level,
  parent,
  onRow,
  className,
  appendixRender,
  selectedClassName = '',
  selectedKey,
  setSelectedKey,
  expandOnSelect,
}: ITreeRow) => {
  const [childVisible, setChildVisible] = useState(false);
  const hasChild = row.children && !!row.children.length;

  return (
    <>
      <li
        className={twCascade(
          'transition-all',
          {
            'h-0': !visible,
            'overflow-hidden': !visible,
            'px-4': visible,
            'py-dot-8': visible,
          },
          className,
          selectedKey === row.key ? selectedClassName : '',
        )}
        style={{
          paddingLeft: `${level ? 1.2 * level : 1}rem`,
        }}
        onClick={() => {
          onRow?.onClick(row, parent);
          expandOnSelect && setChildVisible((v) => !v);
          setSelectedKey(row.key);
        }}
      >
        <div className="flex flex-row justify-between">
          <div className="flex items-center">
            {hasChild && (
              <div
                className={twCascade('transition transform cursor-pointer flex items-center', {
                  '-rotate-90': childVisible,
                })}
                onClick={() => {
                  !expandOnSelect && setChildVisible((v) => !v);
                }}
              >
                <Icon name="caret-right" size={20} />
              </div>
            )}
            <div className="ml-2">
              {row.icon && <span>{row.icon}</span>}
              {keyword && row.title.includes(keyword) ? (
                <span className="text-red-400">{row.title}</span>
              ) : (
                <>{row.title}</>
              )}
            </div>
          </div>
          {appendixRender && appendixRender(row)}
        </div>
      </li>
      {hasChild && (
        <>
          {row.children.map((child) => (
            <TreeRow
              key={child.key}
              row={child}
              keyword={keyword}
              visible={childVisible && visible}
              level={level + 1}
              parent={row}
              onRow={onRow}
              className={className}
              appendixRender={appendixRender}
              setSelectedKey={setSelectedKey}
              selectedClassName={selectedClassName}
              selectedKey={selectedKey}
              expandOnSelect={expandOnSelect}
            />
          ))}
        </>
      )}
    </>
  );
};
