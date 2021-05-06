import React from 'react';

import Breadcrumb from '@c/breadcrumb';
import { useURLSearch } from '@lib/hooks';

function ApprovalDetail(): JSX.Element {
  const [search] = useURLSearch();
  const listType = search.get('list') || 'todo';

  return (
    <div>
      <Breadcrumb
        segments={[
          { key: 'list', text: '返回审批列表', path: `/approvals?list=${listType}` },
          { key: 'current', text: 'todo current approval name' },
        ]}
      />
      <h1>this is approval detail page</h1>
    </div>
  );
}

export default ApprovalDetail;
