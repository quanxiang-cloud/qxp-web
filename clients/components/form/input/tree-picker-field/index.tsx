import React, { useState, useRef, useEffect } from 'react';
import useClickAway from 'react-use/lib/useClickAway';

import Icon from '@c/icon';
import { TreeNode } from '@c/headless-tree/types';
import Popper from '@c/popper';

import PathField from './path-field';
import TreePicker from './tree-picker';

import './index.scss';

export type Props<T> = {
  treeData: TreeNode<T>;
  labelKey?: string;
  value?: string;
  onChange?: (value: string) => void;
}

function TreePickerField<T extends { id: string; }>({
  value,
  onChange,
  treeData,
  labelKey = 'name',
}: Props<T>): JSX.Element {
  const [pathValue, setPathValue] = useState(value || '');
  const [popperWith, setPopperWith] = useState(0);

  const popperRef = useRef<Popper>(null);
  const reference = useRef<HTMLDivElement>(null);
  const pickerBoxRef = React.useRef<HTMLDivElement>(null);

  useClickAway(pickerBoxRef, () => popperRef.current?.close());

  useEffect(() => {
    if (!reference.current || reference.current.offsetWidth === popperWith) return;
    setPopperWith(reference.current.offsetWidth);
  });

  function handleTreeChange(currValue: string): void {
    if (currValue === pathValue) return;

    setPathValue(currValue);
    onChange && onChange(currValue);
  }

  return (
    <div className="flex flex-col items-center w-full">
      <PathField
        ref={reference}
        value={pathValue}
        labelKey={labelKey}
        treeData={treeData}
        appendix={(
          <Icon
            name="expand_more"
            size={20}
            className="cursor-pointer absolute top-1/2 right-6 transform -translate-y-1/2"
          />
        )}
      />
      <Popper
        ref={popperRef}
        reference={reference as any}
        placement="bottom-start"
      >
        <div
          ref={pickerBoxRef}
          className="tree-picker-filed-popper"
          style={{ width: popperWith }}
        >
          <TreePicker
            treeData={treeData}
            defaultValue={value || ''}
            onChange={handleTreeChange}
          />
        </div>
      </Popper>
    </div>
  );
}

export default TreePickerField;
