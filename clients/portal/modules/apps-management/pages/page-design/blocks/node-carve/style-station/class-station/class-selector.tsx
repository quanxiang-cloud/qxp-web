import React, { useMemo, useState } from 'react';

import ClassTagGroup from './class-tag-group';
import AutoComplete from './auto-complete';

import './index.scss';

export type StyleDataItem = {
  name: string;
  value: Record<string, string | number>;
  type: 'color' | 'typography' | string; // to be extend
}

export type Props = {
  styleData: StyleDataItem[];
  defaultClassName?: string;
  onChange?: (className: string) => void;
}

function ClassSelector({ defaultClassName, onChange, styleData }: Props): JSX.Element {
  const [curStyleData, setCurStyleData] = useState<StyleDataItem[]>(getSelectedStyleData(defaultClassName));

  const options = useMemo(() => styleData.filter((style) =>
    !curStyleData.find((curStyle) => curStyle.name === style.name),
  ).map((style) => ({ label: style.name, value: style.name }))
  , [styleData, curStyleData]);

  function getSelectedStyleData(className?: string): StyleDataItem[] {
    if (!className) return [];
    const classNameArr = className.replace(/\s+/g, ' ').split(' ');
    const validStyleData = styleData.filter((styleItem) => classNameArr.includes(styleItem.name));
    return validStyleData;
  }

  function handleClassNameSelect(value: string | number): void {
    const selectStyleItem = styleData.find((styleItem) => styleItem.name === value );
    selectStyleItem && setCurStyleData((prevStyleData) => {
      const newCurStyleData = [...prevStyleData, selectStyleItem];
      onClassChange(newCurStyleData);
      return newCurStyleData;
    });
  }

  function onDeleteClassName(value: string): void {
    setCurStyleData((prevStyleData) => {
      const newCurStyleData = prevStyleData.filter((styleItem) => styleItem.name !== value);
      onClassChange(newCurStyleData);
      return newCurStyleData;
    });
  }

  function onClassChange(styleData: StyleDataItem[]): void {
    const className = styleData.map((styleItem) => styleItem?.name).join(' ');
    onChange?.(className);
  }

  return (
    <div>
      <AutoComplete
        data={options}
        onSelect={handleClassNameSelect}
        placeholder='选择或者搜索 ClassName'
      />
      <ClassTagGroup
        styleData={curStyleData}
        onDeleteClassName={onDeleteClassName}
      />
    </div>
  );
}

export default ClassSelector;
