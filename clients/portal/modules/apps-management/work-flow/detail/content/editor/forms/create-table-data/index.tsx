import React, { useContext, useState } from 'react';
import { useQuery } from 'react-query';

import Select from '@c/select';
import Toggle from '@c/toggle';

import SaveButtonGroup from '@flowEditor/components/_common/action-save-button-group';
import { getFormDataOptions } from '@c/form-table-selector/api';
import FlowContext from '@flow/detail/flow-context';
import FlowTableContext from '../flow-source-table';
import toast from '@lib/toast';
import Modal from '@c/modal';

import TargetTableFields from './target-table-fields';
import { BusinessData, TableDataCreateData } from '@flowEditor/type';
import Context from './context';
import { filterTables } from '../utils';

interface Props {
  defaultValue: TableDataCreateData;
  onSubmit: (data: BusinessData) => void;
  onCancel: () => void;
}

const initialValue = {
  targetTableId: '',
  silent: true,
  createRule: {},
  ref: {},
};

function FormCreateTableData({ defaultValue, onSubmit, onCancel }: Props): JSX.Element {
  const { appID } = useContext(FlowContext);
  const { tableID } = useContext(FlowTableContext);
  const [value, setValue] = useState<TableDataCreateData>(defaultValue || {});
  const [nextTable, setNextTable] = useState<string>('');
  const [switchTableModal, setSwitchTableModal] = useState(false);

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
    onSubmit(value);
  };

  const onClose = () => {
    onCancel();
  };

  const onChange = (val: Partial<TableDataCreateData>): void => {
    setValue((v) => ({ ...v, ...val }));
  };

  const onChangeTargetTable = (table_id: string) => {
    if (!value.targetTableId) {
      onChange({ targetTableId: table_id });
      return;
    }
    if (value.targetTableId && table_id !== value.targetTableId) {
      setNextTable(table_id);
      setSwitchTableModal(true);
    }
  };

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
      <div className="flex flex-col overflow-auto flex-1 py-24">
        <div className="inline-flex items-center">
          <span className="text-body mr-10">目标数据表:</span>
          <Select
            options={filterTables(allTables).filter((tb) => tb.value !== tableID)}
            placeholder="选择数据表"
            value={value.targetTableId}
            onChange={onChangeTargetTable}
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
          </div>
        )}
        <TargetTableFields
          appId={appID}
          tableId={value.targetTableId}
        />
        <SaveButtonGroup onSave={onSave} onCancel={onClose} />
        {switchTableModal && (
          <Modal
            title='切换目标数据表'
            footerBtns={[
              {
                key: 'cancel',
                text: '取消',
                onClick: () => setSwitchTableModal(false),
              },
              {
                key: 'confirm',
                text: '确认',
                onClick: () => {
                  setSwitchTableModal(false);
                  setValue({ ...initialValue, targetTableId: nextTable }); // reset value
                },
                modifier: 'primary',
              },
            ]}
          >
            <p className="p-20">切换数据表之后数据新增的配置将清空，是否继续？</p>
          </Modal>
        )}
      </div>
    </Context.Provider>
  );
}

export default FormCreateTableData;
