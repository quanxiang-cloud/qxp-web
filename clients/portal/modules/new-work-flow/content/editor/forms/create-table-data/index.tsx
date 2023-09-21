import React, { useContext, useState } from 'react';
import { useQuery } from 'react-query';
import { useUpdateEffect } from 'react-use';
import { get } from 'lodash';

import Select from '@c/select';
import Toggle from '@c/toggle';
import SaveButtonGroup from '@newFlow/content/editor/components/_common/action-save-button-group';
import { getFormDataMenuList } from '@c/form-table-selector/api';
import FlowContext from '@newFlow/flow-context';
import toast from '@lib/toast';
import Modal from '@c/modal';
import { BusinessData, TableDataCreateData } from '@newFlow/content/editor/type';
import { ValueRuleVal } from '@newFlow/content/editor/type';
import FlowTableContext from '@newFlow/content/editor/forms/flow-source-table';

import TargetTableFields from './target-table-fields';
import Context from './context';

interface Props {
  defaultValue: TableDataCreateData;
  onSubmit: (data: BusinessData) => void;
  onChange: (data: BusinessData) => void;
  onCancel: () => void;
}

const initialValue = {
  targetTableId: '',
  silent: true,
  createRule: {},
  ref: {},
};

function FormCreateTableData({ defaultValue, onSubmit, onCancel, onChange: _onChange }: Props): JSX.Element {
  const { appID } = useContext(FlowContext);
  const { tableID } = useContext(FlowTableContext);
  const [value, setValue] = useState<TableDataCreateData>(defaultValue || {});
  const [nextTable, setNextTable] = useState<string>('');
  const [switchTableModal, setSwitchTableModal] = useState(false);

  useUpdateEffect(() => {
    _onChange(value);
  }, [value]);

  const {
    data: allTables = [],
    isLoading,
    isError,
  } = useQuery(['GET_WORK_FORM_LIST', appID], () => getFormDataMenuList(appID), {
    enabled: !!appID,
  });

  function validateTips(validateValue: ValueRuleVal): boolean {
    const isNullValue = Array.isArray(validateValue) ? !validateValue.length : !validateValue;
    if (typeof validateValue === 'function' || isNullValue) {
      toast.error('必填项未填写完整');
      return false;
    }
    return true;
  }

  const onSave = (): void => {
    const subTableRequiredField = get(value, 'subTableRequiredField', []);
    const normalRequiredField = get(value, 'normalRequiredField', []);

    for (let index = 0; index < subTableRequiredField.length; index += 1) {
      const subFieldValue = get(value, `ref.${subTableRequiredField[index]}.valueOf`, '');
      if (!validateTips(subFieldValue)) {
        return;
      }
    }

    for (let index = 0; index < normalRequiredField.length; index += 1) {
      const normalFieldValue = get(value, `createRule.${normalRequiredField[index]}.valueOf`, '');
      if (!validateTips(normalFieldValue)) {
        return;
      }
    }

    if (!value.targetTableId) {
      toast.error('请选择目标数据表');
      return;
    }
    onSubmit(value);
  };

  const onClose = (): void => {
    onCancel();
  };

  const onChange = (val: Partial<TableDataCreateData>): void => {
    setValue((v) => ({ ...v, ...val }));
  };

  const onChangeTargetTable = (table_id: string): void => {
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

  const isSelfForm = value.targetTableId === tableID;

  return (
    <Context.Provider value={{ data: value, setData: onChange }}>
      <div className="flex flex-col overflow-auto flex-1 py-24">
        <div className="inline-flex items-center">
          <span className="text-body mr-10">目标数据表:</span>
          <Select
            options={allTables}
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
              defaultChecked={value.silent && !isSelfForm}
              disabled={isSelfForm}
            />
            <small className="ml-5 text-caption">新增本表数据时不支持再次触发工作流</small>
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
            onClose={()=> setSwitchTableModal(false)}
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
