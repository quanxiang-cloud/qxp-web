import React from 'react';
import { observer } from 'mobx-react';

type Props = {
  associativeRules: FormBuilder.DataAssignment[],
}

function AssociativeRuleList({ associativeRules }: Props): JSX.Element {
  return (
    <>
      <div className="flex">
        <span className="text-center flex-1">关联表单字段</span>
        <span className="text-center mx-8 match-icon">{'=>'}</span>
        <span className="text-center flex-1">当前表单字段</span>
      </div>
      <div className="max-h-100 overflow-auto mt-8">
        {associativeRules.map(({ dataTarget, match, dataSource }) => {
          return (
            <div
              className="my-4 flex"
              key={`${dataSource}_${match}_${dataTarget}`}
            >
              <span className="text-center flex-1">{`${dataSource}`}</span>
              <span className="text-center mx-8 match-icon">{'=>'}</span>
              <span className="text-center flex-1">{`${dataTarget}`}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default observer(AssociativeRuleList);
