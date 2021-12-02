import React, { useState, useEffect } from 'react';
import { ISchemaFieldComponentProps } from '@formily/antd';
import cs from 'classnames';

import Select from '@c/select';

import { useOrchestrationAPIStore } from '../context';
import { useQueryPolyList } from '../effects/api/poly';

function CopyPolySelect(props: ISchemaFieldComponentProps): JSX.Element {
  const [options, setOptions] = useState<LabelValue[]>([]);
  const { currentNamespacePath: nameSpacePath = '' } = useOrchestrationAPIStore() ?? {};
  const { data: queryData } = useQueryPolyList(
    { path: nameSpacePath.slice(1), body: { page: 1, pageSize: 10000, active: -1 } },
    { enabled: !!nameSpacePath },
  );

  useEffect(() => {
    queryData?.list.length && setOptions(
      queryData.list.map((poly) => ({ label: poly.title, value: poly.fullPath })),
    );
  }, [queryData]);

  return (
    <div className={cs('w-full copy-poly-select', { 'no-value': !props.value })}>
      <hr className="mb-24 h-1 relative -left-40" style={{ width: 'calc(100% + 80px)' }} />
      <div className="mb-8 text-caption">通过已有API复制新建:</div>
      <Select<string>
        options={options}
        placeholder="选填"
        className="w-full"
        style={{ maxWidth: 'unset' }}
        onChange={(value) => props.mutators.change(value)}
      />
    </div>
  );
}

CopyPolySelect.isFieldComponent = true;

export default CopyPolySelect;
