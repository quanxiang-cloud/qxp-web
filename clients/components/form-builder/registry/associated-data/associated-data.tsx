/* eslint-disable max-len */
import React, { useState } from 'react';
import { useUpdateEffect } from 'react-use';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import Icon from '@c/icon';
import FormDataValueRenderer, { getBasicValue } from '@c/form-data-value-renderer';

import SelectAssociationModal from './select-association-modal';

import './index.scss';

type Props = {
  appID: string;
  associationTableID: string;
  fieldName: string;
  value?: LabelValue;
  placeholder?: string;
  filterConfig?: FilterConfig;
  onChange?: (dataRow: Record<string, any> | null, schema: ISchema | null) => void;
  selectedValue?: string;
}

export function AssociatedData({
  appID,
  associationTableID,
  placeholder,
  filterConfig,
  fieldName,
  value,
  selectedValue,
  onChange,
}: Props): JSX.Element {
  const [modalVisible, setVisible] = useState(false);

  function handleConfirm(dataRow: Record<string, string>, schema: ISchema): void {
    onChange?.(dataRow, schema);
    setVisible(false);
  }

  useUpdateEffect(() => {
    onChange?.(null, null);
  }, [fieldName, associationTableID]);

  function handleClose(): void {
    onChange?.(null, null);
  }

  if (!associationTableID) {
    return (
      <div className='ant-input flex justify-between items-center h-32'>未设置关联记录表</div>
    );
  }

  return (
    <div className='w-full h-32'>
      <div className={`ant-input h-full flex justify-between py-2 items-center ${window?.isMobile ? 'is-mobile-associated-data' : ''}`}>
        <div className='flex-1'>
          {value ? (
            <span className='associated-span'>
              {value.label}
              <Icon onClick={handleClose} clickable size={16} name='close' />
            </span>
          ) : <span className='text-gray-300'>{placeholder}</span>}
        </div>
        <span className='cursor-pointer text-blue-500' onClick={() => setVisible(true)}>
          选择关联数据
        </span>
      </div>
      {modalVisible && (
        <SelectAssociationModal
          onSubmit={handleConfirm}
          appID={appID}
          filterConfig={filterConfig}
          fieldName={fieldName}
          tableID={associationTableID}
          onClose={() => setVisible(false)}
          selectedValue={selectedValue}
        />
      )}
    </div>
  );
}

export default function AssociatedDataWrap(p: ISchemaFieldComponentProps): JSX.Element {
  const [selectedValue, setSelectedValue] = useState(p?.initialValue?.value || p?.value?.value);
  if (p.props.readOnly) {
    return <FormDataValueRenderer value={p.value} schema={p.schema} />;
  }

  function executeAssignMent(dataRow: Record<string, any>): void {
    const { setFieldState } = p?.form ?? {};
    const associativeConfig = p['x-component-props']?.associativeConfig ||
    p.props['x-component-props'].associativeConfig;

    associativeConfig && associativeConfig.rules.forEach((
      { dataSource, dataTarget }: FormBuilder.DataAssignment,
    ) => {
      const fullPath = p?.path?.split('.');
      const relativePath = fullPath?.slice(0, fullPath.length - 1).join('.');

      setFieldState(`${relativePath}.${dataTarget}`, (state) => {
        state.value = dataRow[dataSource];
      });
    });
  }

  return (
    <AssociatedData
      {...p.props['x-component-props']}
      value={p.value}
      readOnly={!!p.props.readOnly}
      selectedValue = {selectedValue}
      onChange={(dataRow, schema) => {
        if (!dataRow) {
          p.mutators.change(undefined);
          setSelectedValue('');
          return;
        }
        setSelectedValue(dataRow?._id);
        const value = dataRow[p.props['x-component-props'].fieldName];
        const label = value ? getBasicValue(schema as ISchema, value) : '--';
        executeAssignMent(dataRow);
        p.mutators.change({ label, value: dataRow._id });
      }}
      filterConfig={p['x-component-props']?.filterConfig || p.props['x-component-props'].filterConfig}
    />
  );
}

AssociatedDataWrap.isFieldComponent = true;
