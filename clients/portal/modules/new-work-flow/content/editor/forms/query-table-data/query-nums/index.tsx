import React, { } from 'react';

import RuleItem from './rule-item';
interface Props {
  defaultValue: any;
  nodesOutputOptions?: any;
  onChange?: any;
}

function QueryNums(props: any): JSX.Element {
  const {
    defaultValue,
    nodesOutputOptions,
    onChange,
    sizeKey,
  } = props;
  const handleChange = (val: any)=>{
    onChange && onChange(val);
  };

  return (
    <div className="flex flex-col wrap-filter-rules">
      <fieldset className="mt-20">
        <div className="flex flex-col update-conditions">
          <RuleItem
            key= {nodesOutputOptions?.length}
            size={defaultValue}
            sizeKey={sizeKey}
            nodesOutputOptions={nodesOutputOptions}
            onChange={handleChange}
          />
        </div>
      </fieldset>
    </div>
  );
}

export default QueryNums;
