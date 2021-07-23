import React, { useState } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { useUpdateEffect } from 'react-use';

import Icon from '@c/icon';
import Button from '@c/button';
import ToolTip from '@c/tooltip';

import SelectAssociationModal from './select-association-modal';
import './index.scss';

type Props = {
  appID: string;
  associationTableID: string;
  displayField: string;
  value?: LabelValue;
  placeholder?: string;
  readOnly?: boolean;
  onChange?: (value: LabelValue | null) => void;
}

export default function AssociatedData({
  appID,
  associationTableID,
  placeholder,
  readOnly,
  displayField,
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
  }, [displayField, associationTableID]);

  if (readOnly) {
    return <p className='preview-text'>{value ? value.label : 'N/A'}</p>;
  }

  return (
    <div>
      {associationTableID ? (
        <div className='items-center inline-flex gap-5'>
          {value ? (
            <span className='associated-span'>
              {value.label}
              <Icon onClick={() => onChange?.(null)} clickable size={16} name='close' />
            </span>
          ) : null}
          <Button onClick={() => setVisible(true)}>{placeholder}</Button>
        </div>
      ) : (
        <ToolTip
          position="top"
          label="请选择关联数据源表"
          labelClassName="whitespace-nowrap"
        >
          <Button forbidden={true}>{placeholder}</Button>
        </ToolTip>
      )}
      {modalVisible && (
        <SelectAssociationModal
          onSubmit={handleConfirm}
          appID={appID}
          displayField={displayField}
          tableID={associationTableID}
          onClose={() => setVisible(false)}
        />
      )}
    </div>
  );
}

export function AssociatedDataWrap(p: ISchemaFieldComponentProps): JSX.Element {
  return (
    <AssociatedData
      value={p.value}
      onChange={p.mutators.change}
      {...p.props['x-component-props']}
      readOnly={!!p.props.readOnly}
    />
  );
}

AssociatedDataWrap.isFieldComponent = true;

