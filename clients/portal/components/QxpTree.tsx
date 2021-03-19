import React, { useState, useEffect, useCallback } from 'react';
import { TreeProps, Icon } from '@QCFE/lego-ui';
import { twCascade } from '@mariusmarais/tailwind-cascade';
import useDebounce from 'react-use/lib/useDebounce';

import { deepClone } from '@assets/lib/f';
import { usePrevious } from '@assets/lib/hooks/usePreviousValue';

interface IOnRow<T extends ITreeData> {
  onClick: (
    node: T,
    parent?: T | null,
    key?: string | string[] | null,
    row?: T | T[] | unknown,
  ) => void;
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

interface ITree<T extends ITreeData> extends TreeProps {
  treeData: ITreeData[];
  keyword?: string;
  visible?: boolean;
  onRow?: IOnRow<T>;
  className?: string;
  itemClassName?: string;
  appendixRender?: (
    row: ITreeData,
    isChecked: boolean,
    isIndeterminate: boolean,
    onChange: () => void,
  ) => JSX.Element;
  selectable?: boolean;
  selectedClassName?: string;
  expandOnSelect?: boolean;
  defaultKey?: string | null;
  selectedKeys?: string[];
}

interface ICurrentRow<T extends ITreeData> {
  row: T | null;
  parent: T | null;
}

const QXPTree = <T extends ITreeData>({
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
  multiple,
  defaultKey = null,
  selectedKeys: keys = [],
}: ITree<T>) => {
  const [dataSource, setDataSource] = useState<ITreeData[]>(deepClone(treeData));
  const [selectedKey, setSelectedKey] = useState<string | null>(selectable ? defaultKey : null);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(keys);
  const [map, setMap] = useState<Record<string, ITreeData>>({});
  const [currentRow, setCurrentRow] = useState<ICurrentRow<T>>({
    row: null,
    parent: null,
  });

  useDebounce(() => {
    if (multiple) {
      setSelectedKeys((selectedKeys) =>
        selectedKeys.filter((key) => keys.includes(key)),
      );
    }
  }, 1, [keys]);

  useDebounce(() => {
    const { row, parent } = currentRow;
    if (row) {
      onRow?.onClick(
          row,
          parent,
        multiple ? selectedKeys : selectedKey,
        multiple ? selectedKeys.map(
            (key) => map[key]).filter(Boolean) : selectedKey ? map[selectedKey] :
            undefined as unknown as T[],
      );
    }
  }, 1, [selectedKeys, selectedKey, currentRow, map]);

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
          onRow={onRow as IOnRow<ITreeData>}
          className={itemClassName}
          appendixRender={appendixRender}
          selectedClassName={selectedClassName}
          selectedKey={selectedKey}
          selectedKeys={selectedKeys}
          setSelectedKey={setSelectedKey}
          setSelectedKeys={setSelectedKeys}
          expandOnSelect={expandOnSelect}
          multiple={multiple}
          setCurrentRow={setCurrentRow}
          setMap={setMap}
          map={map}
          keys={keys}
        />
      ))}
    </ul>
  );
};

interface ITreeRow<T extends ITreeData> {
  row: ITreeData;
  level: number;
  keyword?: string;
  visible?: boolean;
  parent?: ITreeData;
  onRow?: IOnRow<T>;
  className?: string;
  appendixRender?: (
    row: ITreeData,
    isChecked: boolean,
    isIndeterminate: boolean,
    onChange: () => void,
  ) => JSX.Element;
  selectedClassName?: string;
  selectedKey?: string | null;
  setSelectedKey: Function;
  setSelectedKeys: Function;
  expandOnSelect?: boolean;
  selectedKeys?: string[];
  multiple?: boolean;
  _onSelect?: (row: ITreeData) => void;
  parentSelectedChildrenKeys?: string[];
  setCurrentRow: Function;
  setMap: Function;
  map: Record<string, ITreeData>;
  setParentSelectedChildrenKeys?: Function;
  keys: string[];
}
const TreeRow = React.memo(<T extends ITreeData>({
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
  selectedKeys,
  setSelectedKeys,
  multiple = false,
  _onSelect,
  parentSelectedChildrenKeys = [],
  setCurrentRow,
  setMap,
  map,
  setParentSelectedChildrenKeys,
  keys,
}: ITreeRow<T>) => {
  const [childVisible, setChildVisible] = useState(false);
  const hasChild = row.children && !!row.children.length;
  const [selectedChildrenKeys, setSelectedChildrenKeys] = useState<string[]>([]);
  const isIndeterminate =
    multiple && !!selectedChildrenKeys.length && selectedChildrenKeys.length != row.children.length;
  const isChecked = !!(selectedKey === row.key || (multiple && selectedKeys?.includes(row.key)));

  const onCurrentChange = () => {
    setCurrentRow({ row, parent });
    expandOnSelect && setChildVisible((v) => !v);
    multiple && _onSelect && _onSelect(row);
    if (!row.children || !row.children.length) {
      if (multiple) {
        return setSelectedKeys((keys: string[]) => {
          if (keys.includes(row.key)) {
            return keys.filter((key) => key !== row.key);
          }
          return [...new Set([...keys, row.key])];
        });
      }
      return setSelectedKey((key: string) => (key === row.key ? null : row.key));
    }
    if (multiple) {
      setSelectedChildrenKeys(() => {
        if (isIndeterminate || isChecked) {
          return [];
        }
        return row.children.map(({ key }) => key);
      });
      return setSelectedKeys((keys: string[]) => {
        if (keys.includes(row.key)) {
          return keys.filter((key) => key !== row.key);
        }
        return [...new Set([...keys, row.key])];
      });
    }
    setSelectedKey((key: string) => (key === row.key ? null : row.key));
  };

  const preParentSelectedChildrenKeys = usePrevious(parentSelectedChildrenKeys);

  useEffect(() => {
    if (!multiple) {
      return;
    }
    if (!!preParentSelectedChildrenKeys?.length && !parentSelectedChildrenKeys.length) {
      setSelectedKeys((keys: string[]) => {
        return keys.filter((key) => !preParentSelectedChildrenKeys.includes(key));
      });
      if (preParentSelectedChildrenKeys.includes(row.key) && row.children && row.children.length) {
        setSelectedChildrenKeys([]);
      }
    }
    if (!preParentSelectedChildrenKeys?.length && !!parentSelectedChildrenKeys.length) {
      setSelectedKeys((keys: string[]) => {
        return [...new Set([...keys, ...parentSelectedChildrenKeys])];
      });
      if (parentSelectedChildrenKeys?.includes(row.key) && row.children && row.children.length) {
        setSelectedChildrenKeys(row.children.map(({ key }) => key));
      }
    }
  }, [parentSelectedChildrenKeys, preParentSelectedChildrenKeys, row]);

  useDebounce(() => {
    if (!multiple) {
      return;
    }
    if (!keys.includes(row.key)) {
      setParentSelectedChildrenKeys &&
      setParentSelectedChildrenKeys((keys: string[]) => keys.filter((key) => key !== row.key));
      setSelectedChildrenKeys([]);
    } else {
      if (setParentSelectedChildrenKeys && !parentSelectedChildrenKeys.includes(row.key)) {
        setParentSelectedChildrenKeys((keys: string[]) => [...keys, row.key]);
      }
    }
  }, 1, [keys]);

  useEffect(() => {
    setMap((mp: Record<string, ITreeData>) => ({
      ...mp,
      [row.key]: {
        ...row,
        parent: parent,
      },
    }));
  }, []);

  useEffect(() => {
    if (!multiple) {
      return;
    }
    if (!!selectedChildrenKeys.length) {
      setSelectedKeys((keys: string[]) => [...new Set([...keys, row.key])]);
    }
  }, [selectedChildrenKeys]);

  const _onChildSelect = useCallback((r: ITreeData) => {
    if (selectedChildrenKeys.includes(r.key)) {
      return setSelectedChildrenKeys((keys) => keys.filter((key) => key !== r.key));
    }
    setSelectedChildrenKeys((keys) => [...keys, r.key]);
    setParentSelectedChildrenKeys && setParentSelectedChildrenKeys((keys: string[]) => {
      return [...new Set([...keys, row.key])];
    });
  }, [selectedChildrenKeys, setSelectedChildrenKeys, setParentSelectedChildrenKeys]);

  return (
    <>
      <li
        className={twCascade(
            'transition-all',
            {
              'h-0': !visible,
              'overflow-hidden': !visible,
              'px-3': visible,
              'py-dot-8': visible,
            },
            className,
          isChecked ? selectedClassName : '',
        )}
        style={{
          paddingLeft: `${level ? 1 * level : 0.5}rem`,
        }}
        onClick={(e) => {
          e.stopPropagation();
          onCurrentChange();
        }}
      >
        <div className="flex flex-row justify-between">
          <div className="flex items-center">
            {hasChild && (
              <div
                className={twCascade('transition transform cursor-pointer flex items-center', {
                  '-rotate-90': childVisible,
                })}
                onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                  e.stopPropagation();
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
          {appendixRender && appendixRender(row, isChecked, isIndeterminate, onCurrentChange)}
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
              onRow={onRow as IOnRow<ITreeData>}
              className={className}
              appendixRender={appendixRender}
              setSelectedKey={setSelectedKey}
              selectedClassName={selectedClassName}
              selectedKey={selectedKey}
              expandOnSelect={expandOnSelect}
              selectedKeys={selectedKeys}
              setSelectedKeys={setSelectedKeys}
              multiple={multiple}
              _onSelect={_onChildSelect}
              parentSelectedChildrenKeys={selectedChildrenKeys}
              setParentSelectedChildrenKeys={setSelectedChildrenKeys}
              setCurrentRow={setCurrentRow}
              setMap={setMap}
              map={map}
              keys={keys}
            />
          ))}
        </>
      )}
    </>
  );
});

export const Tree = React.memo(QXPTree) as typeof QXPTree;
