import React, { useContext, useState } from 'react';
import { useQuery } from 'react-query';
// import { values, every } from 'lodash';

import Select from '@c/select';
import Toggle from '@c/toggle';

import SaveButtonGroup from '@flowEditor/components/_common/action-save-button-group';
import { getFormDataOptions } from '@c/form-table-selector/api';
import FlowContext from '@flow/detail/flow-context';
import FlowTableContext from '../flow-source-table';
import toast from '@lib/toast';

import TargetTableFields from './target-table-fields';
import { BusinessData, TableDataCreateData } from '@flowEditor/type';
import Context from './context';

interface Props {
  defaultValue: TableDataCreateData;
  onSubmit: (data: BusinessData) => void;
  onCancel: () => void;
}

function FormCreateTableData({ defaultValue, onSubmit, onCancel }: Props): JSX.Element {
  const { appID } = useContext(FlowContext);
  const { tableID } = useContext(FlowTableContext);
  const [value, setValue] = useState<TableDataCreateData>(defaultValue || {});

  const {
    data: allTables = [],
    isLoading,
    isError,
  } = useQuery(['GET_WORK_FORM_LIST', appID], getFormDataOptions, {
    enabled: !!appID,
  });

  const onSave = () => {
    // todo: validate
    if (!value.targetTableId) {
      toast.error('请选择目标数据表');
      return;
    }
    // if (!every(values(value), ({ valueOf }: { valueOf: any }) => !!valueOf)) {
    //   toast.error('部分字段值未填写');
    //   return;
    // }
    onSubmit(value);
  };

  const onClose = () => {
    onCancel();
  };

  function onChange(val: Partial<TableDataCreateData>): void {
    setValue((v) => ({ ...v, ...val }));
  }

  if (isLoading) {
    return (
      <div>Loading..</div>
    );
  }

  if (isError) {
    return (
      <div>获取目标表失败</div>
    );
  }

  return (
    <Context.Provider value={{ data: value, setData: onChange }}>
      <div className="flex flex-col">
        <div className="inline-flex items-center">
          <span className="text-body mr-10">目标数据表:</span>
          <Select
            options={allTables.filter((tb) => tb.value !== tableID)}
            placeholder="选择数据表"
            value={value.targetTableId}
            onChange={(table_id) => {
              onChange({ targetTableId: table_id });
            }}
          />
        </div>
        {value.targetTableId && (
          <div className="inline-flex items-center mt-10">
            <span className="text-body mr-10">表单数据是否触发工作流执行:</span>
            <Toggle
              onChange={(silent) => {
                onChange({ silent });
              }}
              defaultChecked={value.silent}
            />
          </div>)}
        <TargetTableFields
          appId={appID}
          tableId={value.targetTableId}
          defaultValue={defaultValue}
        />
        <SaveButtonGroup onSave={onSave} onCancel={onClose} />
      </div>
    </Context.Provider>

  );
}

export default FormCreateTableData;
