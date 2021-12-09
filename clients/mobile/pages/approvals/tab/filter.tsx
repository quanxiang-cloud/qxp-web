import React, { useMemo, useState } from 'react';

import './filter.scss';
import { FlowType } from '@m/pages/approvals/tab/types';
import Icon from '@m/qxp-ui-mobile/icon';
import { ApplyStatus, ApprovalFilter, CCStatus, HandleTypes } from '@m/pages/approvals/constant';
import cs from 'classnames';

export interface FilterProps {
  type: FlowType;
  filterKey?: string;
  onFilterChange?: (filterKey: string, filterValue: string) => void;
  ccReadAll?: boolean;
}

export default function Filter({
  type, filterKey, onFilterChange, ccReadAll,
}: FilterProps): JSX.Element | null {
  if (!filterKey) return null;

  const [show, setShow] = useState(false);

  const [filter, setFilter] = useState<ApprovalFilter>({ text: '', value: '' });

  const filters = useMemo(() => {
    let _filters;
    switch (type) {
    case 'WAIT_HANDLE_PAGE':
      _filters = HandleTypes;
      break;
    case 'APPLY_PAGE':
      _filters = ApplyStatus;
      break;
    case 'CC_PAGE':
      _filters = CCStatus;
      break;
    }
    if (_filters) {
      setFilter(_filters[0]);
      return _filters;
    }
    return [];
  }, [type]);

  return (
    <div className="task-filter-wrapper body1">
      <div className="task-filter flex items-center justify-center">
        <div className="text-placeholder">{type === 'WAIT_HANDLE_PAGE' ? '处理类型' : '状态'}：</div>
        <div className={`flex-1 ${show ? 'text-highlight' : 'text-primary'}`}>
          {filter.text}
        </div>
        <Icon name="keyboard_arrow_down" size=".2rem"/>
      </div>

      {type === 'CC_PAGE' && (
        <div className={cs(
          'flex items-center justify-center cc-read-all',
          { pointer: ccReadAll },
          ccReadAll ? 'text-highlight' : 'disabled',
        )}
        >
          <Icon name="done_all" size=".17rem"/>
          <div className='ml-8'>全部已读</div>
        </div>
      )}

    </div>
  );
}
