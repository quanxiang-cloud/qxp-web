import React, { useState } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { useUpdateEffect } from 'react-use';

import Icon from '@c/icon';
import FormDataValueRenderer from '@c/form-data-value-renderer';

import SelectAssociationModal from './select-association-modal';

import './index.scss';

type Props = {
  appID: string;
  associationTableID: string;
  fieldName: string;
  value?: LabelValue;
  placeholder?: string;
  filterConfig?: FilterConfig;
  onChange?: (value: LabelValue | null) => void;
}

export function AssociatedData({
  appID,
  associationTableID,
  placeholder,
  filterConfig,
  fieldName,
  value,
  onChange,
}: Props): JSX.Element {
  const [modalVisible, setVisible] = useState(false);
  const handleConfirm = (value: LabelValue): void => {
    onChange?.(value);
    setVisible(false);
  };

  useUpdateEffect(() => {
    onChange?.(null);
  }, [fieldName, associationTableID]);

  const handleClose = (): void => {
    onChange?.(null);
  };

  if (!associationTableID) {
    return (
      <div className='ant-input flex justify-between items-center h-32'>未设置关联记录表</div>
    );
  }

  return (
    <div className='w-full h-32'>
      <div className='ant-input h-full flex justify-between py-2 items-center'>
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
        />
      )}
    </div>
  );
}

export default function AssociatedDataWrap(p: ISchemaFieldComponentProps): JSX.Element {
  if (p.props.readOnly) {
    return <FormDataValueRenderer value={p.value} schema={p.schema} />;
  }

  return (
    <AssociatedData
      {...p.props['x-component-props']}
      filterConfig={p['x-component-props']?.filterConfig || p.props['x-component-props'].filterConfig}
      value={p.value}
      onChange={p.mutators.change}
    />
  );
}

AssociatedDataWrap.isFieldComponent = true;

