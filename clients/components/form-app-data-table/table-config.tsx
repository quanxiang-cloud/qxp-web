import React, { useContext, useMemo } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';

import Icon from '@c/icon';
import Popover from '@c/popover';
import Checkbox from '@c/checkbox';

import { StoreContext } from './context';

function TableConfig(): JSX.Element {
  const store = useContext(StoreContext);

  const configurableColumns = useMemo(() => {
    return store.tableColumns.filter(({ id }) => id !== 'action');
  }, [store.tableColumns]);

  const [allShow, allHidden] = useMemo(() => {
    let hiddenCounter = 0;
    let _allShow = false;
    let _allHidden = false;
    configurableColumns.forEach(({ id = '' }) => {
      if (store.columnConfig[id]?.hidden) {
        hiddenCounter += 1;
      }
    });
    _allShow = hiddenCounter === 0;
    _allHidden = hiddenCounter === configurableColumns.length;
    return [_allShow, _allHidden];
  }, [store.columnConfig, configurableColumns]);

  const columnsItemRenderer = (column: any): JSX.Element => {
    const { hidden, fixed } = store.columnConfig[column.id] || {};
    const checked = !hidden;
    const _fixed = fixed ?? column.fixed;
    return (
      <div key={column.id} className='px-18 py-8 hover:bg-blue-100 flex justify-between items-center'>
        <Checkbox
          checked={checked}
          onChange={(e) => store.setColumnConfig({ hidden: !e.target.checked }, column.id || '')}
          label={column.Header?.toString()}
        />
        {checked && (
          <Icon
            clickable
            changeable
            className={cs({ 'form-table-fixed-active': _fixed })}
            onClick={() => store.setColumnConfig({ fixed: !_fixed }, column.id || '')}
            name='push_pin'
            size={20}
          />
        )}
      </div>
    );
  };

  return (
    <Popover content={(
      <div className='form-table-column-config'>
        <div className='flex justify-between px-18 py-10 border-gray-100 border-solid border-b-1' >
          <Checkbox
            indeterminate={!allHidden && !allShow}
            onChange={(e) => store.selectAllColumn(e.target.checked)}
            checked={allShow}
            label='列展示'
          />
          <span onClick={store.resetColumnConfig} className='text-btn'>重置</span>
        </div>
        {configurableColumns.map((col) => columnsItemRenderer(col))}
      </div>
    )}>
      <Icon clickable changeable size={25} name='settings' />
    </Popover>
  );
}

export default observer(TableConfig);
