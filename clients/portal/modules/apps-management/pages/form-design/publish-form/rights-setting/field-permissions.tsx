import React, { useState, useEffect } from 'react';
import { union } from 'lodash';

import Button from '@c/button';
import Checkbox from '@c/checkbox';
import { fetchFieldFilter, saveFieldFilter } from '@portal/modules/apps-management/lib/api';
import toast from '@lib/toast';

import store from '../../store';

type Props = {
  rightsID: string
}

function FieldPermissions({ rightsID }: Props) {
  const [visibleField, setVisibleField] = useState<string[]>([]);
  const [revisableField, setRevisableField] = useState<string[]>([]);
  const [vIndeterminate, setVIndeterminate] = useState(false);
  const [rIndeterminate, setRIndeterminate] = useState(false);
  const [vCheckAll, setVCheckAll] = useState(false);
  const [rCheckAll, setRCheckAll] = useState(false);

  const { fieldList } = store;
  const fieldRevisable = fieldList.filter(({ isSystem }) => !isSystem);

  useEffect(() => {
    fetchFieldFilter(rightsID).then((res) => {
      const { schema } = res.data || {};
      if (schema) {
        const visibleList: string[] = [];
        const revisableList: string[] = [];
        fieldList.forEach((field) => {
          if (!schema.properties[field.id]) {
            return;
          }
          switch (schema.properties[field.id]['x-internal'].permission) {
          case 3:
            visibleList.push(field.id);
            revisableList.push(field.id);
            break;
          case 1:
            visibleList.push(field.id);
            break;
          }
        });
        setVisibleField(visibleList);
        setRevisableField(revisableList);
      } else {
        const event: any = {
          target: {
            checked: true,
          },
        };
        handleRCheckAll(event);
        handleVCheckAll(event);
      }
    });
  }, []);

  useEffect(() => {
    setVIndeterminate(visibleField.length > 0 && visibleField.length !== fieldList.length);
    if (visibleField.length === fieldList.length) {
      setVCheckAll(true);
    } else {
      setVCheckAll(false);
    }
  }, [visibleField]);

  useEffect(() => {
    setRIndeterminate(revisableField.length > 0 && revisableField.length !== fieldRevisable.length);
    if (revisableField.length === fieldRevisable.length) {
      setRCheckAll(true);
    } else {
      setRCheckAll(false);
    }
  }, [revisableField]);

  const handleVisibleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setVisibleField([...visibleField, value]);
    } else {
      if (revisableField.includes(value)) {
        setRevisableField(
          revisableField.filter((id) => id !== value)
        );
      }

      setVisibleField(
        visibleField.filter((id) => id !== value)
      );
    }
  };

  const handleRevisableChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setRevisableField([...revisableField, value]);
      if (!visibleField.includes(value)) {
        setVisibleField([...visibleField, value]);
      }
    } else {
      setRevisableField(
        revisableField.filter((id) => id !== value)
      );
    }
  };

  const handleVCheckAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setVisibleField(
        fieldList.map(({ id }) => id)
      );
    } else {
      setRevisableField([]);
      setVisibleField([]);
    }
  };

  const handleRCheckAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const ids = fieldRevisable.map(({ id }) => id);
      setVisibleField(union(visibleField, ids));
      setRevisableField(ids);
    } else {
      setRevisableField([]);
    }
  };

  const handleSave = () => {
    const schema: any = {
      properties: {
        _id: {
          title: '_id',
          'x-internal': {
            permission: 1,
          },
        },
      },
      title: '',
      type: 'object',
      'x-internal': { permission: visibleField.length ? 1 : 0 },
    };

    fieldList.forEach((field) => {
      const visible = visibleField.includes(field.id);
      const revisable = revisableField.includes(field.id);
      const permissions = (visible ? 1 : 0) | (revisable ? 10 : 0);
      schema.properties[field.id] = {
        title: field.label,
        'x-internal': {
          permission: parseInt(permissions.toString(), 2),
        },
      };
    });

    saveFieldFilter({ permissionGroupID: rightsID, schema }).then(() => {
      toast.success('保存成功！');
    });
  };

  return (
    <div className=''>
      <div className='flex items-center justify-between mb-12'>
        <span className='text-caption-no-color text-gray-400'>系统字段不可修改。例如：提交时间、更新时间</span>
        <p className='flex gap-x-16'>
          <Checkbox
            onChange={handleVCheckAll}
            checked={vCheckAll}
            indeterminate={vIndeterminate}
            label='全选可见'
          />
          <Checkbox
            onChange={handleRCheckAll}
            checked={rCheckAll}
            indeterminate={rIndeterminate}
            label='全选可修改'
          />
        </p>
      </div>
      <div className='pb-field-box'>
        <div className='pb-field-item-title'><span>字段</span><span>可见</span><span>可修改</span></div>
        {fieldList.map((field) => (
          <div key={field.id} className='pb-field-item'>
            <span>{field.label}</span>
            <Checkbox
              checked={visibleField.includes(field.id)}
              value={field.id}
              onChange={handleVisibleChange}
            />
            {!field.isSystem && (
              <Checkbox
                checked={revisableField.includes(field.id)}
                value={field.id}
                onChange={handleRevisableChange}
              />
            )}
          </div>
        ))}
      </div>
      <div className='mt-20'>
        <Button onClick={handleSave} modifier='primary'>保存</Button>
      </div>
    </div>
  );
}

export default FieldPermissions;
