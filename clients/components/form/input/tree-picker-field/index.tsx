import React, { useState, useRef, MutableRefObject, LegacyRef } from 'react';
import useClickAway from 'react-use/lib/useClickAway';
import cs from 'classnames';

import Icon from '@c/icon';
import { TreeNode } from '@c/headless-tree/types';

import PathField from './path-field';
import TreePicker from './tree-picker';

export type Props<T> = {
  treeData: TreeNode<T>;
  labelKey?: string;
  closeAble?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

function TreePickerField<T extends { id: string; }>({
  value,
  onChange,
  treeData,
  labelKey = 'name',
  closeAble = false,
}: Props<T>): JSX.Element {
  const [paths, setPaths] = useState<T[]>([]);
  const domRef = useRef<HTMLDivElement>();
  const [open, setOpen] = useState(true);
  const [pathValue, setPathValue] = useState(value || '');

  useClickAway(domRef as MutableRefObject<HTMLDivElement>, () => closeAble && setOpen(false));

  const path = paths.map((p) => (p as any)[labelKey]).reverse().join(' > ');

  function handleTreeChange(currValue: string, paths: T[]): void {
    setPathValue(currValue);
    onChange && onChange(currValue);
    setPaths(paths);
  }

  function onToggle(): void {
    closeAble && setOpen((o) => !o);
  }

  return (
    <div
      className="flex flex-col items-center w-full"
      ref={domRef as LegacyRef<HTMLDivElement>}
    >
      <TreePicker
        treeData={treeData}
        defaultValue={value || ''}
        onChange={handleTreeChange}
        onToggle={onToggle}
        visible={open}
      />
      <PathField
        value={pathValue}
        path={path}
        onClick={onToggle}
        appendix={closeAble ? (
          <Icon
            name="expand_more"
            size={20}
            className={
              cs(
                'transition-all absolute cursor-pointer top-16 transform',
                {
                  '-rotate-180': open,
                },
              )
            }
            style={{
              right: '0.6rem',
            }}
          />
        ) : null}
      />
    </div>
  );
}

export default TreePickerField;
