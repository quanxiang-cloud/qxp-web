import React, { useState } from 'react';

import Breadcrumb from '@c/breadcrumb';
import { useURLSearch } from '@lib/hooks';

import TaskFrom from './form';

function ApprovalDetail(): JSX.Element {
  const [search] = useURLSearch();
  const listType = search.get('list') || 'todo';
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  console.log(formValues);

  return (
    <div>
      <Breadcrumb
        segments={[
          { key: 'list', text: '返回审批列表', path: `/approvals?list=${listType}` },
          { key: 'current', text: 'todo current approval name' },
        ]}
      />
      <h1>this is approval detail page</h1>
      <TaskFrom onChange={setFormValues} />
    </div>
  );
}

export default ApprovalDetail;
