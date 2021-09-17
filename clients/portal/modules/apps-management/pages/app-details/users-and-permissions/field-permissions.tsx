import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import { get, isNumber, transform } from 'lodash';

import Checkbox from '@c/checkbox';
import Icon from '@c/icon';
import { NORMAL, PERMISSION } from '@c/form-builder/constants';
import { binaryStringToNumber, numberToBinaryString } from '@lib/binary';
import {
  calculateFieldPermission,
  isPermissionEditable,
  isPermissionInvisible,
  isPermissionReadable,
  isPermissionWriteable,
} from '@c/form-builder/utils';

import store from './store';
import { COMPONENT_NAME_TITLE_MAP } from './constants';

type Props = {
  fields: SchemaFieldItem[];
  fieldPer: ISchema;
  className?: string;
  abled?: boolean
}

type ConfigValue = {
  editable: boolean;
  invisible: boolean;
  writeable: boolean;
  readable: boolean;
  fieldTitle?: string;
  fieldComponentName?: string;
  isSystem?: boolean;
}

type Config = Record<string, ConfigValue>;

function FieldPermissions({
  fields, className = '', fieldPer, abled,
}: Props, ref: React.Ref<any>): JSX.Element {
  const [permission, setPermission] = useState<ISchema>();
  const [config, setConfig] = useState<Config>();
  const fieldNameRefs = useRef(new Map<string, boolean>());
  const isPermissionDisabled = store.currentRights.types === 1 || !abled;

  useEffect(() => {
    const config: Config = {};
    const permission = fields.reduce((permissionAcc: ISchema, fieldSchema: SchemaFieldItem) => {
      const defaultPermission = fieldSchema?.['x-internal']?.permission as PERMISSION | undefined;
      const permission: PERMISSION | undefined = get(
        fieldPer, `properties.${fieldSchema.id}.x-internal.permission`,
      );
      const targetPermission = (
        fieldPer && isNumber(permission) ?
          updatePermissionWithDefault(permission, defaultPermission) :
          defaultPermission
      ) as PERMISSION;
      Object.assign(permissionAcc.properties, {
        [fieldSchema.id]: {
          'x-internal': {
            permission: targetPermission,
          },
        },
      });
      const readable = isPermissionReadable(targetPermission);
      Object.assign(config, {
        [fieldSchema.id]: {
          editable: readable ? isPermissionEditable(targetPermission) : false,
          invisible: readable ? isPermissionInvisible(targetPermission) : false,
          writeable: readable ? isPermissionWriteable(targetPermission) : false,
          readable,
          fieldTitle: fieldSchema.title,
          fieldComponentName: fieldSchema?.['x-component'],
          isSystem: fieldSchema?.['x-internal']?.isSystem,
        },
      });
      return permissionAcc;
    }, { type: 'object', title: '', properties: {}, 'x-internal': { permission: NORMAL } });
    setPermission(permission);
    setConfig(config);
  }, [fieldPer, fields]);

  useEffect(() => {
    const permissionProperties = get(permission, 'properties');
    if (!permissionProperties || !permission) {
      return;
    }
    const properties = transform(
      permissionProperties,
      (acc: Record<string, ISchema>, fieldSchema: ISchema, fieldKey: string) => {
        const configPermission = config?.[fieldKey];
        const newPermissionSchema: ISchema = configPermission ? {
          'x-internal': {
            permission: calculateFieldPermission(
              configPermission.editable,
              configPermission.invisible,
              configPermission.writeable,
              configPermission.readable,
            ),
          },
        } : fieldSchema;
        acc[fieldKey] = newPermissionSchema;
      },
      {},
    );
    setPermission((permission) => ({ ...permission, properties }));
  }, [config]);

  useImperativeHandle(ref, () => ({
    getFieldPer: () => permission,
  }));

  function updatePermissionWithDefault(permission: PERMISSION, defaultPermission?: PERMISSION): PERMISSION {
    if (!defaultPermission) {
      return permission;
    }
    const permissionStr = numberToBinaryString(permission).slice(-2);
    const readPermission = permissionStr[1];
    if (readPermission === '0') {
      return 0;
    }
    const defaultPermissionStr = numberToBinaryString(defaultPermission).slice(0, 2);
    return binaryStringToNumber(`${defaultPermissionStr}${permissionStr}`) as PERMISSION;
  }

  function setFieldNameRefs(fieldKey: string) {
    return (el: HTMLElement) => {
      fieldNameRefs.current.set(fieldKey, el?.offsetWidth < el?.scrollWidth);
    };
  }

  function getPartialPermission(
    type: 'read' | 'write', checked: boolean, configPermission: ConfigValue,
  ): Partial<ConfigValue> {
    const valueMapper = {
      read: { readable: checked, writeable: !checked ? false : configPermission.writeable },
      write: { writeable: checked, readable: checked ? true : configPermission.readable },
    };
    return valueMapper[type];
  }

  function handleChange(type: 'read' | 'write') {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value, checked } = e.target;
      const previousConfig = config?.[value];
      if (!previousConfig) {
        return;
      }
      const partialPermission = getPartialPermission(type, checked, previousConfig);
      Object.assign(previousConfig, {
        ...partialPermission,
        editable: partialPermission.writeable ? !!previousConfig?.editable : false,
        invisible: partialPermission.readable ? !!previousConfig?.invisible : false,
      });
      setConfig((config) => ({ ...config, [value]: previousConfig }));
    };
  }

  function handleAllChange(type: 'read' | 'write') {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setConfig((config) => transform(config || {}, (accConfig: Config, configValue, fieldId) => {
        const partialPermission = getPartialPermission(type, e.target.checked, configValue);
        accConfig[fieldId] = {
          ...configValue,
          ...partialPermission,
          editable: partialPermission.writeable ? configValue.editable : false,
          invisible: partialPermission.readable ? configValue.invisible : false,
        };
        return accConfig;
      }, {}));
    };
  }

  const configValues = Object.values(config || {});
  const isAllReadable = configValues.every((configValue) => configValue.readable);
  const isNotAllReadable = !isAllReadable && configValues.some((configValue) => configValue.readable);
  const isAllWriteable = configValues.filter((configValue) => !configValue.isSystem).every(
    (configValue) => configValue.writeable,
  );
  const isNotAllWriteable = !isAllWriteable && configValues.some((configValue) => configValue.writeable);

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
              onChange={handleAllChange('read')}
              checked={isAllReadable}
              indeterminate={isNotAllReadable}
              disabled = {store.currentRights.types === 1 || !abled}
              label='全部可查看'
            />
          </span>
          <span>
            <Checkbox
              onChange={handleAllChange('write')}
              checked={isAllWriteable}
              indeterminate={isNotAllWriteable}
              disabled={isPermissionDisabled}
              label='全部可修改'
            />
          </span>
        </div>
        {Object.entries(config || {})?.filter(([fieldID]) => fieldID !== '_id').map(
          ([fieldId, configPermission]) => {
            const { fieldTitle, fieldComponentName, isSystem } = configPermission;
            const title = fieldTitle || COMPONENT_NAME_TITLE_MAP[fieldComponentName || ''];
            return (
              <div key={fieldId} className='pb-field-item'>
                <span className="grid">
                  <span
                    ref={setFieldNameRefs(fieldId)}
                    title={fieldNameRefs.current.get(fieldId) ? title : ''}
                    className="truncate"
                  >
                    {title}
                  </span>
                </span>
                <Checkbox
                  checked={configPermission.readable}
                  value={fieldId}
                  disabled={isPermissionDisabled}
                  onChange={handleChange('read')}
                />
                {!isSystem && (
                  <Checkbox
                    checked={configPermission.writeable}
                    value={fieldId}
                    disabled={isPermissionDisabled}
                    onChange={handleChange('write')}
                  />
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default forwardRef(FieldPermissions);
