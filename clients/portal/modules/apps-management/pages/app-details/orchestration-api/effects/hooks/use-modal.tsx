import React, { useState, useEffect } from 'react';
import { UseMutationOptions, UseMutationResult } from 'react-query';
import { toJS } from 'mobx';
import { createFormActions, SchemaForm } from '@formily/react-schema-renderer';
import { Input, Select } from '@formily/antd-components';

import toast from '@lib/toast';
import Modal from '@c/modal';
import { ModalType, MODAL_SCHEMA_MAP } from '@orchestrationAPI/constants';
import useSchemaformKeypressSubmit from '@orchestrationAPI/effects/hooks/use-schema-form-keypress-submit';

const actions = createFormActions();

export default function useModal<I, O, D>(
  modalType: ModalType | undefined,
  matchedModalType: ModalType,
  mutationHooks: (options?: UseMutationOptions<O, Error, I>) => UseMutationResult<O, Error, I>,
  options: {
    onSuccess?: (data: O, variables: I, context: unknown) => void,
    onError?: (error: Error) => void,
    message?: string,
    modifier?: 'primary' | 'danger',
    content?: JSX.Element,
    defaultValue?: Partial<D>,
    formToApiInputConvertor: (form?: D) => I,
    keyPressFieldWhitelist?: string[],
    onClose: () => void,
  },
): JSX.Element | null {
  const {
    message, onClose, onSuccess, onError, formToApiInputConvertor, content, defaultValue,
    modifier = 'primary', keyPressFieldWhitelist = ['title', 'name'],
  } = options;
  const [loading, setLoading] = useState(false);
  const [schema, title] = modalType ? MODAL_SCHEMA_MAP[modalType] : [];
  const visible = matchedModalType === modalType;
  const effects = useSchemaformKeypressSubmit(schema, keyPressFieldWhitelist, handleSubmit, visible);

  function handleSubmit(): void {
    content ? onSubmit() : actions.submit();
  }

  useEffect(() => {
    !modalType && setLoading(false);
  }, [modalType]);

  const mutation = mutationHooks({
    onSuccess: (data, variables, context) => {
      message && toast.success(message);
      onClose();
      onSuccess?.(data, variables, context);
    },
    onError: (error) => {
      toast.error(error);
      onError?.(error);
      setLoading(false);
    },
  });

  function onSubmit(data?: D): void {
    setLoading(true);
    mutation.mutate(formToApiInputConvertor(data));
  }

  if (!visible) {
    return null;
  }

  return (
    <Modal
      title={title}
      onClose={onClose}
      footerBtns={[
        { key: 'cancel', text: '取消', onClick: onClose },
        { key: 'submit', text: '确定', onClick: handleSubmit, modifier, loading },
      ]}
    >
      <div className="p-20">
        {content ? content : (
          <SchemaForm
            onSubmit={onSubmit}
            defaultValue={toJS(defaultValue)}
            schema={schema}
            effects={effects}
            actions={actions}
            components={{ Input, TextArea: Input.TextArea, Select }}
          />
        )}
      </div>
    </Modal>
  );
}
