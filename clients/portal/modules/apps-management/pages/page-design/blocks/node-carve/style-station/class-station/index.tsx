import React from 'react';
import ClassSelector, { StyleDataItem } from './class-selector';

type Props = {
  defaultClassName: string;
  classNameData: StyleDataItem[];
  onChange?: (className: string) => void;
}

function ClassStation({
  defaultClassName,
  onChange,
  classNameData,
}: Props): JSX.Element {
  return (
    <ClassSelector
      onChange={onChange}
      styleData={classNameData}
      defaultClassName={defaultClassName}
    />
  );
}

export default ClassStation;
