import React, { useState, useEffect } from 'react';

import Toggle from '@c/toggle';

import CustomFieldTable from './custom-field-table';
import SystemFieldTable from './system-field-table';
import { FieldPermission, CustomFieldPermission, SystemFieldPermission } from '../../../store';

interface Props {
  defaultValue?: FieldPermission;
  onChange: (fieldPermission: FieldPermission) => void;
}

export default function({ defaultValue, onChange }: Props) {
  const [editable, setEditable] = useState(false);
  let defaultValues = defaultValue;
  if (!defaultValue?.custom || !defaultValue.system) {
    defaultValues = {
      custom: [{
        id: '1',
        fieldName: '姓名',
        read: true,
        write: false,
        initialValue: {
          variable: '',
          static: '',
        },
        submitValue: {
          variable: '',
          static: '',
        },
      }, {
        id: '2',
        fieldName: '年龄',
        read: true,
        write: false,
        initialValue: {
          variable: '',
          static: '',
        },
        submitValue: {
          variable: '',
          static: '',
        },
      }, {
        id: '3',
        fieldName: '明细',
        read: true,
        write: false,
        initialValue: {
          variable: '',
          static: '',
        },
        submitValue: {
          variable: '',
          static: '',
        },
        children: ['4', '5', '6'],
      }, {
        id: '4',
        fieldName: '金额',
        read: true,
        write: false,
        initialValue: {
          variable: '',
          static: '',
        },
        submitValue: {
          variable: '',
          static: '',
        },
        parent: '3',
      }, {
        id: '5',
        fieldName: '规格',
        read: false,
        write: false,
        initialValue: {
          variable: '',
          static: '',
        },
        submitValue: {
          variable: '',
          static: '',
        },
        parent: '3',
      }, {
        id: '6',
        fieldName: '数量',
        read: true,
        write: false,
        initialValue: {
          variable: '',
          static: '',
        },
        submitValue: {
          variable: '',
          static: '',
        },
        parent: '3',
      }, {
        id: '7',
        fieldName: '附件',
        read: true,
        write: false,
        initialValue: {
          variable: '',
          static: '',
        },
        submitValue: {
          variable: '',
          static: '',
        },
      }],
      system: [{
        id: '1',
        fieldName: '提交时间',
        read: true,
      }, {
        id: '2',
        fieldName: '发起人',
        read: true,
      }],
    };
  }

  const [fieldPermission, setFieldPermissions] = useState<FieldPermission>(defaultValues || {
    custom: [],
    system: [],
  });

  useEffect(() => {
    onChange(fieldPermission);
  }, [fieldPermission]);

  function onUpdateFields(type: 'custom' | 'system') {
    return (value: (CustomFieldPermission | SystemFieldPermission)[]) => {
      setFieldPermissions((sf) => ({
        ...sf,
        [type]: value,
      }));
    };
  }

  return (
    <>
      <section className="mt-14">
        <header className="flex justify-between items-center mb-10">
          <div className="text-caption-no-color text-gray-400">自定义字段</div>
          <div className="flex justify-between items-center">
            <span className="mr-8">为字段赋值</span>
            <Toggle onChange={() => setEditable((s) => !s)} />
          </div>
        </header>
        <CustomFieldTable
          editable={editable}
          fields={fieldPermission.custom}
          updateFields={onUpdateFields('custom')}
        />
      </section>
      <section className="pb-56">
        <header className="flex justify-between items-center mb-12 mt-16">
          <div className="text-caption-no-color text-gray-400">系统字段</div>
        </header>
        <SystemFieldTable fields={fieldPermission.system} updateFields={onUpdateFields('system')} />
      </section>
    </>
  );
}
