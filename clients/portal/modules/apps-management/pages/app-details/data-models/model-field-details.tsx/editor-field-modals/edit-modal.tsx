import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { ValidateDescription } from '@formily/validator';
import { SchemaForm, useForm, FormEffectHooks, createFormActions, LifeCycleTypes } from '@formily/antd';
import { Input, Select, Switch, NumberPicker } from '@formily/antd-components';

import Modal, { FooterBtnProps } from '@c/modal';

import store from '../../store';
import { FIELD_FORM_SCHEMA } from '../form-schema';

type Props = {
  onCancel: () => void;
  onSubmit: (value: ModelField) => void;
  field: ModelField | undefined;
}

const PATH: Record<string, string> = {
  string: '*(length, validationRules)',
  datetime: 'format',
  number: '*(length, digits)',
  array: 'subType',
};

const { onFieldValueChange$ } = FormEffectHooks;
const actions = createFormActions();

function EditModal({ onCancel, onSubmit, field }: Props): JSX.Element {
  useEffect(() => {
    const rule: ValidateDescription = {
      id: 'repeat',
      validator: (value: string) => {
        if (store.existingFields.includes(value)) {
          return {
            type: 'error',
            message: '字段编码重复',
          };
        }

        return null;
      },
    };

    actions.setFieldState('id', (state) => {
      const index = state.rules.findIndex((rule) => {
        return typeof rule === 'object' && (rule as any).id === 'repeat';
      });

      if (index > -1) {
        state.rules.splice(index, 1, rule);
        return;
      }

      state.rules.push(rule);
    });
  }, [store.existingFields]);

  const form = useForm({
    actions,
    onSubmit: (formData) => {
      if (formData.subType) {
        formData.items = {
          title: '',
          type: formData.subType,
        };
      }

      onSubmit(formData);
    },
    initialValues: field,
    effects: ($) => {
      const { setFieldState } = actions;

      onFieldValueChange$('type').subscribe(({ value }) => {
        setFieldState('*(length, validationRules, digits, format, subType, regular)', (state) => {
          state.visible = false;
        });

        setFieldState(PATH[value] || '', (state) => {
          state.visible = true;
        });
      });

      onFieldValueChange$('validationRules').subscribe(({ value }) => {
        setFieldState('regular', (state) => {
          state.visible = value === 'custom';
        });
      });

      $(LifeCycleTypes.ON_FORM_INIT).subscribe(() => {
        setFieldState('*(id, type)', (state) => {
          state.props.readOnly = !!field;
        });
      });
    },
  });

  function handleSubmit(): void {
    form.submit().then(() => {
      onCancel();
    }).catch(() => null);
  }

  async function handleCreateNext(): Promise<void> {
    form.submit().then(() => {
      return form.reset();
    }).then(() => {
      return form.clearErrors();
    }).catch(() => null);
  }

  const btnList: FooterBtnProps[] = [
    {
      text: '取消',
      key: 'cancel',
      onClick: onCancel,
    },
    {
      text: '保存',
      key: 'next',
      modifier: 'primary',
      onClick: handleSubmit,
    },
  ];

  if (!field) {
    btnList.push({
      text: '保存且继续新建',
      key: 'save_creat',
      modifier: 'primary',
      onClick: handleCreateNext,
    });
  }

  return (
    <Modal
      title={`${field ? '编辑' : '添加'}字段`}
      onClose={onCancel}
      footerBtns={btnList}
    >
      <div className='p-20'>
        <SchemaForm
          form={form as any}
          components={{ Input, Select, Switch, NumberPicker }}
          schema={FIELD_FORM_SCHEMA}
        />
      </div>
    </Modal>
  );
}

export default observer(EditModal);
