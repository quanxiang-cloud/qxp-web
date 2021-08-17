import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { union } from 'lodash';
import { fieldsToSchema } from '@lib/schema-convert';

import Checkbox from '@c/checkbox';

type Props = {
  fields: SchemaFieldItem[];
  fieldPer: Record<string, any>;
  className?: string;
}

function FieldPermissions({ fields, className = '', fieldPer }: Props, ref: React.Ref<any>): JSX.Element {
  const [visibleField, setVisibleField] = useState<string[]>([]);
  const [revisableField, setRevisableField] = useState<string[]>([]);
  const [vIndeterminate, setVIndeterminate] = useState(false);
  const [rIndeterminate, setRIndeterminate] = useState(false);
  const [vCheckAll, setVCheckAll] = useState(false);
  const [rCheckAll, setRCheckAll] = useState(false);

  const fieldRevisable = fields.filter((field) => !field['x-internal']?.isSystem);

  useImperativeHandle(ref, () => ({
    getFieldPer: getFieldPer,
  }));

  const getFieldPer = (): ISchema => {
    const getPerMission = (key: string): number => {
      const visible = visibleField.includes(key);
      const revisable = revisableField.includes(key);
      const permissions = (visible ? 1 : 0) | (revisable ? 10 : 0);

      return parseInt(permissions.toString(), 2);
    };

    const _fields = fields.map((field) => {
      if (field.parentField) {
        return Object.assign({}, field, {
          'x-internal': {
            permission: getPerMission(field.parentField),
          },
        });
      }

      return Object.assign({}, field, {
        'x-internal': {
          permission: getPerMission(field.id),
        },
      });
    });

    return fieldsToSchema(_fields);
  };

  useEffect(() => {
    if (fieldPer) {
      const visibleList: string[] = [];
      const revisableList: string[] = [];
      fields.forEach((field) => {
        if (!fieldPer.properties[field.id]) {
          return;
        }
        switch (fieldPer.properties[field.id]['x-internal'].permission) {
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
  }, []);

  useEffect(() => {
    setVIndeterminate(visibleField.length > 0 && visibleField.length !== fields.length);
    if (visibleField.length === fields.length) {
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

  const handleVisibleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value, checked } = e.target;
    if (checked) {
      setVisibleField([...visibleField, value]);
    } else {
      if (revisableField.includes(value)) {
        setRevisableField(
          revisableField.filter((id) => id !== value),
        );
      }

      setVisibleField(
        visibleField.filter((id) => id !== value),
      );
    }
  };

  const handleRevisableChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value, checked } = e.target;
    if (checked) {
      setRevisableField([...revisableField, value]);
      if (!visibleField.includes(value)) {
        setVisibleField([...visibleField, value]);
      }
    } else {
      setRevisableField(
        revisableField.filter((id) => id !== value),
      );
    }
  };

  const handleVCheckAll = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.checked) {
      setVisibleField(
        fields.map(({ id }) => id),
      );
    } else {
      setRevisableField([]);
      setVisibleField([]);
    }
  };

  const handleRCheckAll = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.checked) {
      const ids = fieldRevisable.map(({ id }) => id);
      setVisibleField(union(visibleField, ids));
      setRevisableField(ids);
    } else {
      setRevisableField([]);
    }
  };

  const getTitle = (title: any): any => {
    switch (title) {
    case 'LayoutTabs':
      return '选项卡';
    case 'LayoutCard':
      return '分组';
    case 'LayoutGrid':
      return '栅格';
    }

    return title;
  };

  const getSuffix = (field: SchemaFieldItem, fields: SchemaFieldItem[]): string | null => {
    const currentFieldName = field.id;

    const sf = fields.filter((itm) => itm.parentField === currentFieldName)
      .map((itm) => itm.title)
      .join(',');

    return sf ? `(${sf})` : null;
  };

  return (
    <div className={className}>
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
        {fields.map((field) => (
          <div key={field.id} className='pb-field-item'>
            <span>
              <span>{getTitle(field.title || field['x-component'])}</span>
              <span className="suffix-text">{getSuffix(field, fields)}</span>
            </span>
            <Checkbox
              checked={visibleField.includes(field.id)}
              value={field.id}
              onChange={handleVisibleChange}
            />
            {!field['x-internal']?.isSystem && (
              <Checkbox
                checked={revisableField.includes(field.id)}
                value={field.id}
                onChange={handleRevisableChange}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default forwardRef(FieldPermissions);
