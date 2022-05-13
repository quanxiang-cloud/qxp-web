import React from 'react';
import ClassSelector from './class-selector';

import { Props } from './class-selector';
import { useStyleData } from './hooks';

function ClassStation(
  { defaultClassName, onChange }: Pick<Props, 'defaultClassName' | 'onChange'>,
): JSX.Element {
  const [isLoading, styleData] = useStyleData();

  if (isLoading) {
    return <div>正在获取ClassName...</div>;
  }

  return (
    <ClassSelector
      onChange={onChange}
      styleData={styleData}
      defaultClassName={defaultClassName}
    />
  );
}

export default ClassStation;
