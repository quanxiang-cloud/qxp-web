import React, { PropsWithChildren } from 'react';
import { Input } from '@formily/antd-components';
import {
  SchemaForm,
  createFormActions,
} from '@formily/react-schema-renderer';

import Modal from '@c/modal';
import { CreateParams, NameSpace, UpdateParams } from '@orchestrationAPI/effects/api/api-namespace';
import useSchemaformKeypressSubmit from '@orchestrationAPI/effects/hooks/use-schema-form-keypress-submit';
import { ModalType } from '@orchestrationAPI/constants';

import { MODAL_SCHEMA_MAP } from '../constants';

type Props = PropsWithChildren<{
  modalType: ModalType;
  onClose: () => void;
  onSubmit: (formData?: CreateParams & UpdateParams) => void;
  defaultValue?: Partial<NameSpace>;
  loading?: boolean;
  modifier?: 'primary' | 'danger';
}>

const formActions = createFormActions();

export default function APINamespaceModal({
  modalType, onClose, onSubmit, defaultValue, children, loading, modifier = 'primary',
}: Props): JSX.Element | null {
  const [schema, title] = MODAL_SCHEMA_MAP[modalType] || [];
  const effects = useSchemaformKeypressSubmit(schema, ['title', 'name'], handleSubmit, !!modalType);

  function handleSubmit(): void {
    children ? onSubmit() : formActions.submit();
  }

  if (!modalType) {
    return null;
  }

  return (
    <Modal
      title={title}
      footerBtns={[
        { key: 'cancel', text: '取消', onClick: onClose },
        { key: 'submit', text: '确定', onClick: handleSubmit, modifier, loading },
      ]}
    >
      <div className="p-20">
        {children ? children : (
          <SchemaForm
            onSubmit={onSubmit}
            defaultValue={defaultValue}
            schema={schema}
            effects={effects}
            actions={formActions}
            components={{ Input, TextArea: Input.TextArea }}
          />
        )}
      </div>
    </Modal>
  );
}
