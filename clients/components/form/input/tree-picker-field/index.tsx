import React, { useState, useRef, MutableRefObject, LegacyRef } from 'react';
import useClickAway from 'react-use/lib/useClickAway';
import { Icon } from '@QCFE/lego-ui';
import cs from 'classnames';

import { TreeNode } from '@c/headless-tree/types';

import PathField from './path-field';
import TreePicker from './tree-picker';

export type Props<T> = {
  label?: string;
  treeData: TreeNode<T>;
  labelKey?: string;
  name?: string;
  required?: boolean;
  help?: string;
  closeAble?: boolean;
  defaultValue?: string;
}

export default function TreePickerField<T extends { id: string; }>({
  treeData,
  labelKey = 'name',
  name = 'treePicker',
  required,
  help = '请选择项目',
  closeAble = false,
  defaultValue = '',
}: Props<T>): JSX.Element {
  const [paths, setPaths] = useState<T[]>([]);
  const domRef = useRef<HTMLDivElement>();
  const [open, setOpen] = useState(true);
  const [value, setValue] = useState(defaultValue);

  useClickAway(domRef as MutableRefObject<HTMLDivElement>, () => closeAble && setOpen(false));

  const path = paths.map((p) => (p as any)[labelKey]).reverse().join(' > ');

  function onChange(value: string, paths: T[]) {
    setValue(value);
    setPaths(paths);
  }

  function onToggle() {
    closeAble && setOpen((o) => !o);
  }

  return (
    <div
      className="flex flex-col items-center w-full mb-24"
      ref={domRef as LegacyRef<HTMLDivElement>}
    >
      <TreePicker<T>
        label="部门"
        treeData={treeData}
        defaultValue={defaultValue}
        onChange={onChange}
        onToggle={onToggle}
        visible={open}
      />
      <PathField
        name={name}
        value={value}
        path={path}
        required={required}
        help={help}
        onClick={onToggle}
        appendix={closeAble ? (
          <Icon
            name="chevron-down"
            size="20"
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
