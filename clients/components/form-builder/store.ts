import { action, computed, observable, toJS } from 'mobx';
import { nanoid } from 'nanoid';
import { flatten, set } from 'lodash';

import Modal from '@c/modal';
import logger from '@lib/logger';
import { insertField, omitField, findField, updateField } from './utils/fields-operator';

import registry from './registry';
import {
  filterLinkageRules,
  shouldFilterLinkages,
  filterLinkageTargetKeys,
  filterLinkagesOnDeleteField,
  generateRandomFormFieldID,
} from './utils';

type Props = {
  schema: ISchema;
  appID: string;
  pageID: string;
}

const INTERNAL_FIELDS: Array<FormItem> = [
  {
    fieldName: '_id',
    componentName: 'Input',
    configValue: { displayModifier: 'hidden', title: 'id', isSystem: true },
  },
  {
    fieldName: 'created_at',
    componentName: 'DatePicker',
    configValue: { displayModifier: 'hidden', title: '创建时间', isSystem: true },
  },
  {
    fieldName: 'updated_at',
    componentName: 'DatePicker',
    configValue: { displayModifier: 'hidden', title: '修改时间', isSystem: true },
  },
  {
    fieldName: 'creator_name',
    componentName: 'Input',
    configValue: { displayModifier: 'hidden', title: '创建者', isSystem: true },
  },
  {
    fieldName: 'creator_id',
    componentName: 'Input',
    configValue: { displayModifier: 'hidden', title: '创建者 ID', isSystem: true },
  },
  {
    fieldName: 'modifier_name',
    componentName: 'Input',
    configValue: { displayModifier: 'hidden', title: '修改者', isSystem: true },
  },
  {
    fieldName: 'modifier_id',
    componentName: 'Input',
    configValue: { displayModifier: 'hidden', title: '修改者 ID', isSystem: true },
  },
];

// todo refactor this
export const INTERNAL_FIELD_NAMES = INTERNAL_FIELDS.map(({ fieldName }) => fieldName);

// todo support tree structure
function schemaToFormBuilderFields({ properties }: ISchema): Array<FormItem> {
  if (!properties) return [];
  const _fields: FormItem[] = [];

  const recursionProperties = (properties: Record<string, any>): void => {
    Object.keys(properties)
      .filter((key) => !INTERNAL_FIELD_NAMES.includes(key))
      .forEach((key) => {
        const componentName = properties[key]['x-component']?.toLowerCase();
        if (!componentName || !registry.elements[componentName]) {
          // todo refactor this message
          logger.error('fatal! there is no x-component in schema:', properties[key]);
          return null;
        }

        const configValue = registry.elements[componentName].toConfig(properties[key]);
        const parentField = properties[key]?.['x-internal']?.parentField;
        const tabIndex = properties[key]?.['x-internal']?.tabIndex;
        const xIndex = properties[key]?.['x-index'];

        const field: FormItem = {
          fieldName: key,
          componentName: componentName,
          configValue: configValue,
          parentField,
          tabIndex,
          'x-index': xIndex,
          'x-internal': properties[key]?.['x-internal'],
        };

        if (properties[key].properties) {
          recursionProperties(properties[key].properties);
        }

        _fields.push(field);
      });
  };

  recursionProperties(properties);

  const fields = _fields
    .sort((a, b) => Number(a?.['x-index']) - Number(b['x-index']))
    .filter((field) => !field.parentField)
    .map((field) => {
      return {
        ...field,
        children: _fields.filter((_field) => _field.parentField === field.fieldName),
      };
    });

  return fields;
}

export default class FormBuilderStore {
  appID: string;
  pageID: string;
  internalFields: Array<FormItem>;
  @observable fields: Array<FormItem>;
  @observable activeFieldName = '';
  @observable labelAlign: 'right' | 'top' = 'right';
  @observable columnsCount: 1 | 2 = 1;
  @observable isLinkageConfigVisible = false;
  @observable visibleHiddenLinkages: FormBuilder.VisibleHiddenLinkage[] = [];
  @observable hasEdit = false;
  @observable validations: Array<ValidationFormula>;
  @observable isDragging = false;

  constructor({ schema, appID, pageID }: Props) {
    this.internalFields = INTERNAL_FIELDS;
    this.fields = schemaToFormBuilderFields(schema);

    this.appID = appID;
    this.pageID = pageID;

    this.visibleHiddenLinkages = schema['x-internal']?.visibleHiddenLinkages || [];
    this.columnsCount = schema['x-internal']?.columns || 1;

    this.validations = schema['x-internal']?.validations || [];
  }

  @computed get activeField(): FormItem | null {
    return findField(this.activeFieldName, this.getAllFields);
  }

  @computed get activeFieldSourceElement(): FormBuilder.SourceElement<any> | null {
    const componentName = this.activeField?.componentName;
    if (!componentName) {
      return null;
    }

    return registry.elements[componentName.toLocaleLowerCase()] || null;
  }

  @computed get schema(): ISchema {
    const properties: Record<string, ISchema> = {};
    const schemas = this.getAllFields.map((field, idx) => this.fieldToSchema(field, idx));

    schemas.forEach((schema) => {
      if (schema?.['x-internal']?.parentField) return;

      const { fieldName } = schema;
      properties[fieldName] = schema;
    });

    schemas.forEach((schema) => {
      const parentField = schema?.['x-internal']?.parentField;
      if (!parentField) return;

      const { fieldName } = schema;
      const parentProperties = properties[parentField].properties;

      properties[parentField].properties = Object.assign({}, parentProperties, {
        [fieldName]: schema,
      });
    });

    return {
      title: '',
      type: 'object',
      properties: properties,
      'x-internal': {
        version: '1.3.13',
        labelAlign: this.labelAlign,
        // columns: this.columnsCount,
        columns: 1,
        visibleHiddenLinkages: toJS(this.visibleHiddenLinkages),
        validations: this.validations ? toJS(this.validations) : undefined,
        defaultValueFrom: 'customized',
      },
    };
  }

  @computed get getAllFields(): Array<FormItem> {
    const _flatten = (arr?: FormItem[]): FormItem[] => {
      if (!arr) return [];

      const fields = arr.map((field, idx) => {
        return [{
          ...field,
          'x-index': idx,
        } as FormItem].concat(_flatten(field?.children));
      });

      return flatten(fields);
    };

    return _flatten([...this.fields]);
  }

  @computed get fieldsForCanvas(): Array<IteratISchema> {
    const _fields = this.fields
      .map((field, idx) => this.getFieldSchema(field, idx))
      .map((field, idx) => ({
        ...field,
        'x-index': idx,
      })).filter((field) => !!field.display);

    return _fields;
  }

  @action fieldToSchema(field: FormItem, index: number): ISchema & { fieldName: string } {
    const { fieldName, componentName, configValue } = field;
    const { toSchema } = registry.elements[componentName.toLowerCase()] || {};
    if (!toSchema) {
      logger.error(`failed to find component: [${componentName}] in registry`);
    }

    const parsedSchema = toSchema(toJS(configValue));
    parsedSchema['x-internal'] = parsedSchema['x-internal'] || { defaultValueFrom: 'customized' };
    parsedSchema['x-internal'].isSystem = !!configValue.isSystem;
    parsedSchema['x-internal'].parentField = field.parentField;
    parsedSchema['x-internal'].tabIndex = field.tabIndex;

    const node = {
      // convert observable value to pure js object for debugging
      fieldName,
      ...parsedSchema,
      'x-index': index,
      'x-mega-props': {
        labelCol: this.labelAlign === 'right' ? 4 : undefined,
      },
    };

    return node;
  }

  @action getFieldSchema(field: FormItem, index: number): IteratISchema {
    const { fieldName, componentName, configValue } = field;
    const node = this.fieldToSchema(field, index);
    const { toSchema } = registry.elements[componentName.toLowerCase()] || {};
    if (!toSchema) {
      logger.error(`failed to find component: [${componentName}] in registry`);
    }

    const parsedSchema = toSchema(toJS(configValue));
    return {
      display: parsedSchema.display,
      id: fieldName,
      type: 'object',
      properties: {
        FIELDs: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            labelAlign: this.labelAlign,
            grid: true,
            columns: this.columnsCount,
            autoRow: true,
          },
          properties: {
            [fieldName]: node,
          },
        },
      },
    };
  }

  @computed get hiddenFieldsForCanvas(): Array<IteratISchema> {
    return this.getAllFields
      .map((field, idx) => this.getFieldSchema(field, idx))
      .filter((field) => !field.display)
      .map((field) => {
        set(field, ['properties', 'FIELDs', 'properties', field.id, 'display'], true);
        return {
          ...field,
          display: true,
        };
      });
  }

  @computed get schemaForCanvas(): ISchema {
    const properties = Object.keys(toJS(this.schema.properties) || {})
      .filter(Boolean)
      .reduce<Record<string, any>>((acc, key) => {
        const childrenInvisible = !this.schema.properties?.[key].display;
        const node = {
          ...this.schema.properties?.[key],
          display: true,
          title: childrenInvisible ? '******' : this.schema.properties?.[key].title,
        };

        acc[key] = node;

        return acc;
      }, {});

    return {
      type: 'object',
      properties: {
        FIELDs: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            labelAlign: this.labelAlign,
            grid: true,
            columns: this.columnsCount,
            autoRow: true,
          },
          properties: properties,
        },
      },
    };
  }

  @action validate(): boolean {
    return this.fields.map(({ componentName, configValue }) => ({
      elem: registry.elements[componentName.toLowerCase()],
      configValue,
    })).every(({ elem, configValue }) => {
      if (elem && typeof elem.validate === 'function') {
        return elem.validate(toJS(configValue), elem?.configSchema);
      }
      return true;
    });
  }

  @action setDragging(isD: boolean): void {
    this.isDragging = isD;
  }

  @action updateLabelAlign(labelAlign: 'right' | 'top'): void {
    this.labelAlign = labelAlign;
  }

  @action updateLinkageConfigVisible(visible: boolean): void {
    this.isLinkageConfigVisible = visible;
  }

  @action deleteLinkage(key: string): void {
    this.visibleHiddenLinkages = this.visibleHiddenLinkages.filter((linkage) => {
      return linkage.key !== key;
    });
  }

  @action handleLinkageChange(linkage: FormBuilder.VisibleHiddenLinkage): void {
    if (!linkage.key) {
      this.visibleHiddenLinkages.push({
        ...linkage,
        key: generateRandomFormFieldID(),
      });

      return;
    }

    this.visibleHiddenLinkages = this.visibleHiddenLinkages.map((config) => {
      return config.key === linkage.key ? linkage : config;
    });
  }

  @action
  setActiveFieldKey(fieldName: string): void {
    this.activeFieldName = fieldName;
  }

  @action updateFieldIndex(fieldName: string, index: number, parentField?: string, tabIndex?: string): void {
    const targetField = findField(fieldName, this.fields);
    if (tabIndex && targetField) targetField.tabIndex = tabIndex;
    const omitedFields = omitField(targetField, this.fields);
    const newFields = insertField(targetField, index, omitedFields, parentField);
    this.fields = newFields;
  }

  @action getFieldsInLayout(parentField: string): IteratISchema[] {
    const targetLayoutField = findField(parentField, this.fields);
    const children = targetLayoutField?.children || [];
    return children.map((field, idx) => this.getFieldSchema(field, idx))
      .filter((field) => !!field.display);
  }

  @action getNewField(fieldName: string, tabIndex?: string, parentField?: string): FormItem {
    const field = registry.elements[fieldName.toLocaleLowerCase()];

    const newField = {
      ...field,
      configValue: { ...field.defaultConfig, appID: this.appID },
      fieldName: generateRandomFormFieldID(),
      tabIndex,
      parentField,
    };

    return newField;
  }

  @action appendComponent(fieldName: string, index: number, parentField?: string, tabIndex?: string): void {
    const newField = this.getNewField(fieldName, tabIndex, parentField);
    const newFields = insertField(newField, index, this.fields, parentField);
    this.fields = newFields;
    this.setActiveFieldKey(newField.fieldName);
  }

  @action
  deleteField(fieldName: string): void {
    this.hasEdit = true;
    if (shouldFilterLinkages(fieldName, this.visibleHiddenLinkages)) {
      const deleteConfirmModal = Modal.open({
        title: '提示',
        content: '有显隐规则引用到此字段，直接删除会清除对应的引用，是否确认删除？',
        onConfirm: () => {
          this.visibleHiddenLinkages = filterLinkagesOnDeleteField(
            fieldName,
            this.visibleHiddenLinkages,
            filterLinkageRules,
            filterLinkageTargetKeys,
          );

          this.fields = this.fields.filter((field) => {
            return field.fieldName !== fieldName && field.parentField !== fieldName;
          });
          deleteConfirmModal.close();
        },
      });

      return;
    }

    const targetField = findField(fieldName, this.fields);
    const omitedFields = omitField(targetField, this.fields);
    this.fields = omitedFields;
  }

  @action
  updateFieldConfig(value: any): void {
    this.hasEdit = true;

    const targetField = findField(this.activeFieldName, this.fields);
    if (!targetField) return;
    targetField.configValue = toJS(value);

    this.fields = updateField(this.activeFieldName, targetField, this.fields);
  }

  @action
  setColumnsCount(count: 1 | 2): void {
    this.columnsCount = count;
  }

  @action
  updateValidation(validation: ValidationFormula): void {
    if (validation.id) {
      this.validations = toJS(this.validations).map((rule) => {
        if (rule.id === validation.id) {
          return validation;
        }

        return rule;
      });
      return;
    }

    this.validations.push({
      ...validation,
      id: nanoid(10),
    });
  }

  @action
  deleteValidation(id: string): void {
    this.validations = this.validations.filter((rule) => {
      return rule.id !== id;
    });
  }
}
