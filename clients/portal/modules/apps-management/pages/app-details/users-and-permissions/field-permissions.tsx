import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { union, set, get } from 'lodash';

import Checkbox from '@c/checkbox';
import Icon from '@c/icon';

import store from './store';

type Props = {
  fields: SchemaFieldItem[];
  fieldPer: ISchema;
  className?: string;
  abled?: boolean
}

function FieldPermissions({
  fields, className = '', fieldPer, abled,
}: Props, ref: React.Ref<any>): JSX.Element {
  const [visibleField, setVisibleField] = useState<string[]>([]);
  const [revisableField, setRevisableField] = useState<string[]>([]);
  const [hideableField, setHideableField] = useState<string[]>([]);
  const [vIndeterminate, setVIndeterminate] = useState(false);
  const [rIndeterminate, setRIndeterminate] = useState(false);
  const [hIndeterminate, setHIndeterminate] = useState(false);
  const [vCheckAll, setVCheckAll] = useState(false);
  const [rCheckAll, setRCheckAll] = useState(false);
  const [hCheckAll, setHCheckAll] = useState(false);

  const fieldRevisable = fields.filter((field) => !field['x-internal']?.isSystem);

  useImperativeHandle(ref, () => ({
    getFieldPer: getFieldPer,
    reset: () => getFields(),
  }));

  const getPerMission = (key: string): number => {
    const visible = visibleField.includes(key);
    const revisable = revisableField.includes(key);
    const hideable = hideableField.includes(key);
    const permissions = (visible ? 1 : 0) | (revisable ? 10 : 0) | (hideable ? 100 : 0);

    return parseInt(permissions.toString(), 2);
  };

  const getFieldPer = (): ISchema => {
    const properties: Record<string, ISchema> = {};
    fields.forEach((field) => {
      set(
        properties,
        `${field.fieldName}.x-internal.permission`,
        getPerMission(field.id),
      );
    });

    // properties._id = {
    //   title: '_id',
    //   'x-internal': {
    //     permission: 5,
    //   },
    // };

    return {
      properties,
      title: '',
      type: 'object',
      'x-internal': { permission: visibleField.length ? 1 : 0 },
    };
  };

  const getFields = (): void => {
    const visibleList: string[] = [];
    const revisableList: string[] = [];
    const hideableList: string[] = [];
    if (fieldPer) {
      fields.forEach((field) => {
        switch (get(fieldPer, `properties.${field.fieldName}.x-internal.permission`)) {
        case 1:
          visibleList.push(field.id);
          break;
        case 3:
          visibleList.push(field.id);
          break;
        case 5:
          visibleList.push(field.id);
          hideableList.push(field.id);
          break;
        }
      });
      setVisibleField(visibleList);
      setRevisableField(revisableList);
      setHideableField(hideableList);
      return;
    }
    fields.forEach((field) => {
      if (!field['x-internal']?.isSystem ) {
        visibleList.push(field.id);
        revisableList.push(field.id);
      } else {
        visibleList.push(field.id);
        hideableList.push(field.id);
      }
    });
    setVisibleField(visibleList);
    setRevisableField(revisableList);
    setHideableField(hideableList);
  };

  useEffect(() => {
    getFields();
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

  useEffect(() => {
    setHIndeterminate(hideableField.length > 0 && hideableField.length !== fields.length);
    if (hideableField.length === fields.length) {
      setHCheckAll(true);
    } else {
      setHCheckAll(false);
    }
  }, [hideableField]);

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
      if (hideableField.includes(value)) {
        setHideableField(
          hideableField.filter((id) => id !== value),
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
      if (hideableField.includes(value)) {
        setHideableField(
          hideableField.filter((id) => id !== value),
        );
      }
    } else {
      setRevisableField(
        revisableField.filter((id) => id !== value),
      );
    }
  };

  const handleHideableChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value, checked } = e.target;
    if (checked) {
      setHideableField([...hideableField, value]);
      if (!visibleField.includes(value)) {
        setVisibleField([...visibleField, value]);
      }
      if (revisableField.includes(value)) {
        setRevisableField(
          revisableField.filter((id) => id !== value),
        );
      }
    } else {
      setHideableField(
        hideableField.filter((id) => id !== value),
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
      setHideableField([]);
    }
  };

  const handleRCheckAll = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.checked) {
      const ids = fieldRevisable.map(({ id }) => id);
      setVisibleField(union(visibleField, ids));
      setRevisableField(ids);
      setHideableField([]);
    } else {
      setRevisableField([]);
    }
  };

  const handleHCheckAll = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.checked) {
      const ids = fieldRevisable.map(({ id }) => id);
      setVisibleField(union(visibleField, ids));
      setHideableField(ids);
      setRevisableField([]);
    } else {
      setHideableField([]);
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

  return (
    <div className={className}>
      <div className='fields-tip text-14'>
        <Icon
          name='info'
          className='text-inherit mx-18'
          size={20}
        />
        系统字段不可修改。例如：创建时间、修改时间
      </div>
      <div className='pb-field-box'>
        <div className='pb-field-item-title'>
          <span>字段</span>
          <span>
            <Checkbox
              onChange={handleVCheckAll}
              checked={vCheckAll}
              indeterminate={vIndeterminate}
              disabled = {store.currentRights.types === 1 || !abled}
              label='全部可查看'
            />
          </span>
          <span>
            <Checkbox
              onChange={handleRCheckAll}
              checked={rCheckAll}
              indeterminate={rIndeterminate}
              disabled = {store.currentRights.types === 1 || !abled}
              label='全部可修改'
            />
          </span>
          <span>
            <Checkbox
              onChange={handleHCheckAll}
              checked={hCheckAll}
              indeterminate={hIndeterminate}
              disabled = {store.currentRights.types === 1 || !abled}
              label='全部可隐藏'
            />
          </span>
        </div>
        {fields.filter((field) => field.fieldName !== '_id').map((field) => (
          <div key={field.id} className='pb-field-item'>
            <span>
              <span>{getTitle(field.title || field['x-component'])}</span>
            </span>
            <Checkbox
              checked={visibleField.includes(field.id)}
              value={field.id}
              disabled={store.currentRights.types === 1 || !abled}
              onChange={handleVisibleChange}
            />
            {field['x-internal']?.isSystem ? <div></div> : (
              <Checkbox
                checked={revisableField.includes(field.id)}
                value={field.id}
                disabled = {store.currentRights.types === 1 || !abled}
                onChange={handleRevisableChange}
              />
            )}
            <Checkbox
              checked={hideableField.includes(field.id)}
              value={field.id}
              disabled = {store.currentRights.types === 1 || !abled}
              onChange={handleHideableChange}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default forwardRef(FieldPermissions);
