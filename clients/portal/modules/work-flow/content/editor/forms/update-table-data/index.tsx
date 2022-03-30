import React, { useContext, useRef, useState, useMemo, useCallback } from 'react';
import { useQuery } from 'react-query';
import { every, isEmpty } from 'lodash';
import { useUpdateEffect } from 'react-use';

import Select from '@c/select';
import Toggle from '@c/toggle';
import Modal from '@c/modal';
import RadioButtonGroup from '@c/radio/radio-button-group';
import SaveButtonGroup from '@flow/content/editor/components/_common/action-save-button-group';
import { getFormDataMenuList } from '@c/form-table-selector/api';
import FlowContext from '@flow/flow-context';
import FlowSourceTableCtx from '@flow/content/editor/forms/flow-source-table';
import toast from '@lib/toast';
import { BusinessData, TableDataUpdateData } from '@flow/content/editor/type';

import Context from './context';
import FilterRules, { RefType as FilterRuleRef } from './filter-rules';
import UpdateRules, { RefType as UpdateRuleRef } from './update-rules';
import SelectTargetFields from './select-target-fields';

import './styles.scss';

interface Props {
  defaultValue: TableDataUpdateData;
  onSubmit: (data: BusinessData) => void;
  onChange: (data: BusinessData) => void;
  onCancel: () => void;
}
export type SelectComponentName = 'associatedrecords' | 'associateddata' | 'subtable'
type SelectFormType = 'work-form' | 'others';
const selectComponentNames: SelectComponentName[] = ['associatedrecords', 'associateddata', 'subtable'];
const initialValue: TableDataUpdateData = {
  targetTableId: '',
  silent: true,
  filterRule: undefined,
  updateRule: [],
};

export default function UpdateTableData({
  defaultValue, onSubmit, onCancel, onChange: _onChange,
}: Props): JSX.Element {
  const { appID } = useContext(FlowContext);
  const { tableID: workFormId, tableSchema } = useContext(FlowSourceTableCtx);
  const [value, setValue] = useState<TableDataUpdateData>(defaultValue || {});
  const filterRef = useRef<FilterRuleRef>(null);
  const updateRef = useRef<UpdateRuleRef>(null);
  const [nextTable, setNextTable] = useState<string>('');
  const [switchTableModal, setSwitchTableModal] = useState(false);
  const [formType, setFormType] = useState<SelectFormType>(value.targetTableId === workFormId ? 'work-form' : 'others');

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
  const associatedDataList = useMemo(() => {
    return tableSchema.filter((item) => {
      return selectComponentNames.includes(item.componentName as SelectComponentName);
    }) ?? [] as SchemaFieldItem[];
  }, [tableSchema]);
  const setTypeAndTableId = useCallback((value, associatedDataList) => {
    if (value.selectField === 'normal') {
      Object.assign(value, { selectField: '', selectFieldType: undefined, selectFieldTableId: undefined });
      return;
    }
    associatedDataList.forEach((item: SchemaFieldItem) => {
      if (item.id === value.selectField) {
        const compoentProps = item['x-component-props'];
        const componentName = item.componentName;
        if (componentName === 'associatedrecords') {
          const recordsTableId = compoentProps?.tableID ?? '';
          Object.assign(value, { selectFieldType: 'associated_records', selectFieldTableId: recordsTableId });
        } else if (componentName === 'associateddata') {
          const dataTableId = compoentProps?.associationTableID ?? '';
          Object.assign(value, { selectFieldType: 'associated_data', selectFieldTableId: dataTableId });
        } else if (componentName === 'subtable') {
          const tableId = compoentProps?.tableID ?? '';
          const selectFieldType = compoentProps?.subordination ?? '';
          Object.assign(value, { selectFieldType, selectFieldTableId: tableId });
        }
      }
    });
  }, [associatedDataList, value]);
  const onSave = (): void => {
    if (!value.targetTableId) {
      toast.error('请选择目标数据表');
      return;
    }
    const filterRule = filterRef.current?.getValues();
    const updateRule = updateRef.current?.getValues();

    // filter rule is optional
    if (filterRule) {
      if (filterRule.conditions.length && !every(filterRule.conditions, (v) => !!v.fieldName)) {
        toast.error('过滤条件的目标表字段不能为空');
        return;
      }
    }

    if (!every(updateRule, (v) => !!v.fieldName)) {
      toast.error('更新规则的目标表字段不能为空');
      return;
    }

    const { formQueryRef, ..._filterRule } = filterRule || {};
    Object.assign(value, {
      // if no rule conditions, ignore filter rules
      filterRule: isEmpty(_filterRule) ? { conditions: [] } : _filterRule,
      updateRule,
      formQueryRef,
    });
    if (formType === 'work-form') {
      Object.assign(value, { silent: false });
    }
    setTypeAndTableId(value, associatedDataList);
    onSubmit(value);
  };

  const onClose = (): void => {
    onCancel();
  };

  const onChange = (val: Partial<TableDataUpdateData>): void => {
    setValue((v) => ({ ...v, ...val }));
  };

  function onChangeTargetTable(table_id: string): void {
    if (table_id !== value.targetTableId) {
      setNextTable(table_id);
      setSwitchTableModal(true);
    }
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

  function renderMain(): JSX.Element | null {
    const { targetTableId } = value;
    if (!targetTableId) return null;

    if (formType === 'others' && targetTableId === workFormId) {
      // not yet select other table
      return null;
    }

    if (targetTableId === workFormId) {
      return (
        <UpdateRules
          appId={appID}
          tableId={value.targetTableId}
          defaultValue={value.updateRule}
          ref={updateRef}
        />
      );
    }

    return (
      <>
        <div className="inline-flex items-center mt-10">
          <span className="text-body mr-10">表单数据是否触发工作流执行:</span>
          <Toggle
            onChange={(silent) => {
              onChange({ silent });
            }}
            defaultChecked={value.silent}
          />
        </div>
        <FilterRules
          appId={appID}
          tableId={value.targetTableId}
          defaultValue={value.filterRule}
          ref={filterRef}
        />
        <UpdateRules
          appId={appID}
          tableId={value.targetTableId}
          defaultValue={value.updateRule}
          ref={updateRef}
        />
      </>
    );
  }

  return (
    <Context.Provider value={{ data: value, setData: onChange }}>
      <div className="flex flex-col overflow-auto flex-1 py-24">
        <div className="inline-flex items-center">
          <span className="text-body mr-10">更新对象:</span>
          <RadioButtonGroup
            listData={[
              { label: '本条数据', value: 'work-form' },
              { label: '其它数据', value: 'others' },
            ]}
            onChange={(v) => {
              if (v === formType) return;
              setFormType(v as SelectFormType);
              if (v === 'work-form') {
                onChangeTargetTable(workFormId);
              } else {
                // reset table id when select other tables
                onChange({ targetTableId: '' });
              }
            }}
            currentValue={formType}
          />
          {formType === 'others' && (
            <Select
              className='ml-20'
              options={allTables.filter(({ value }) => value !== workFormId)}
              placeholder="选择数据表"
              value={value.targetTableId}
              onChange={onChangeTargetTable}
            />
          )}
        </div>
        <SelectTargetFields
          fieldId={value.selectField}
          tableId={value.targetTableId}
          onChangeField={(selectField) => {
            // when change select field, reset update rules
            onChange({ selectField, updateRule: [] });
          }}
        />
        {renderMain()}
        <SaveButtonGroup onSave={onSave} onCancel={onClose} />
        {switchTableModal && (
          <Modal
            title='切换目标数据表'
            onClose={() => setSwitchTableModal(false)}
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
            <p className="p-20">切换数据表之后数据更新的配置将清空，是否继续？</p>
          </Modal>
        )}
      </div>
    </Context.Provider>
  );
}
