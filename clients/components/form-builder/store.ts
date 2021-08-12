import { action, computed, observable, toJS } from 'mobx';
import { nanoid } from 'nanoid';

import Modal from '@c/modal';
import logger from '@lib/logger';

import registry from './registry';
import {
  filterLinkageRules,
  shouldFilterLinkages,
  wrapSchemaByMegaLayout,
  filterLinkageTargetKeys,
  filterLinkagesOnDeleteField,
  generateRandomFormFieldID,
} from './utils';

export type FormItem = {
  componentName: string;
  fieldName: string;
  configValue: any;
  'x-index'?: number;
  parentField?: string;
  tabIndex?: string;
  'x-internal'?: XInternal;
};

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
export function schemaToFields({ properties }: ISchema): [Array<FormItem>, Array<FormItem>] {
  if (!properties) {
    return [INTERNAL_FIELDS, []];
  }

  const _fiels: FormItem[] = [];

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

        _fiels.push(field);
      });
  };

  recursionProperties(properties);

  return [INTERNAL_FIELDS, _fiels];
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
    const [internalFields, fields] = schemaToFields(schema);
    this.internalFields = internalFields;
    this.fields = fields;

    this.appID = appID;
    this.pageID = pageID;

    this.visibleHiddenLinkages = schema['x-internal']?.visibleHiddenLinkages || [];
    this.columnsCount = schema['x-internal']?.columns || 1;

    this.validations = schema['x-internal']?.validations || [];
  }

  @computed get activeField(): FormItem | null {
    return this.fields.find(({ fieldName }) => fieldName === this.activeFieldName) || null;
  }

  @computed get activeFieldWrapperName(): string {
    if (!this.activeField) {
      return '';
    }

    return `wrap-${this.activeField?.fieldName}`;
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

    const schemas: IteratISchema[] = this.fields
      .concat(this.internalFields)
      .map((field) => {
        const { fieldName, componentName, configValue, parentField, tabIndex } = field;
        const isLayoutComponent = field?.['x-internal']?.isLayoutComponent;
        const { toSchema } = registry.elements[componentName.toLowerCase()] || {};
        if (!toSchema) {
          logger.error(`failed to find component: [${componentName}] in registry`);
        }

        const parsedSchema = toSchema(toJS(configValue));
        // ensure 'x-internal' exist

        const node: IteratISchema = {
          ...parsedSchema,
          id: fieldName,
          'x-internal': {
            ...(parsedSchema['x-internal'] || { defaultValueFrom: 'customized' }),
            isSystem: !!configValue.isSystem,
            parentField: parentField,
            tabIndex: tabIndex,
            isLayoutComponent,
          },
          'x-index': field['x-index'],
          'x-mega-props': {
            labelCol: this.labelAlign === 'right' ? 4 : undefined,
          },
        };

        return node;
      });

    schemas.forEach((schema) => {
      if (schema?.['x-internal']?.parentField) return;

      const { id } = schema;
      properties[id] = schema;
    });

    schemas.forEach((schema) => {
      const parentField = schema?.['x-internal']?.parentField;
      if (!parentField) return;

      const { id } = schema;
      const parentProperties = properties[parentField].properties;

      properties[parentField].properties = Object.assign({}, parentProperties, {
        [id]: schema,
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

  @computed get schemaForPreview(): ISchema {
    return wrapSchemaByMegaLayout(toJS(this.schema));
  }

  @computed get fieldsForLayout(): Record<string, Array<IteratISchema & { tabIndex?: string }>> {
    const layoutComponent: Record<string, Array<IteratISchema & { tabIndex?: string }>> = {};

    const fields = this.fields
      .concat(this.internalFields)
      .filter(({ fieldName }) => !INTERNAL_FIELD_NAMES.includes(fieldName));

    fields.forEach((field) => {
      if (field?.['x-internal']?.isLayoutComponent) {
        layoutComponent[field.fieldName] = [];
      }
    });

    fields.forEach((field) => {
      if (!field.parentField) return;

      const { fieldName, componentName, configValue, tabIndex } = field;
      const { toSchema } = registry.elements[componentName.toLowerCase()] || {};
      if (!toSchema) {
        logger.error(`failed to find component: [${componentName}] in registry`);
      }

      const parsedSchema = toSchema(toJS(configValue));

      parsedSchema['x-internal'] = parsedSchema['x-internal'] || { defaultValueFrom: 'customized' };
      parsedSchema['x-internal'].isSystem = !!configValue.isSystem;

      const node = {
        fieldName,
        ...parsedSchema,
        'x-index': field['x-index'],
        'x-mega-props': {
          labelCol: this.labelAlign === 'right' ? 4 : undefined,
        },
      };

      const schema: IteratISchema & { tabIndex?: string } = {
        display: parsedSchema.display,
        tabIndex,
        id: fieldName,
        type: 'object',
        'x-internal': parsedSchema?.['x-internal'],
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

      layoutComponent[field.parentField].push(schema);
    });

    Object.keys(layoutComponent).forEach((key) => {
      layoutComponent[key].sort((a, b) => {
        return (a?.properties?.FIELDs?.properties?.[a.id]?.['x-index'] || 0) -
          (b?.properties?.FIELDs?.properties?.[b.id]?.['x-index'] || 0);
      });
    });

    return layoutComponent;
  }

  @computed get fieldsForCanvas(): Array<IteratISchema> {
    return this.fields
      .concat(this.internalFields)
      .filter(({ fieldName }) => !INTERNAL_FIELD_NAMES.includes(fieldName))
      .filter(({ parentField }) => !parentField)
      .sort((a, b) => (a['x-index'] || 0) - (b['x-index'] || 0))
      .map((field): IteratISchema => {
        const { fieldName, componentName, configValue } = field;
        const { toSchema } = registry.elements[componentName.toLowerCase()] || {};
        if (!toSchema) {
          logger.error(`failed to find component: [${componentName}] in registry`);
        }

        const parsedSchema = toSchema(toJS(configValue));

        parsedSchema['x-internal'] = parsedSchema['x-internal'] || { defaultValueFrom: 'customized' };
        parsedSchema['x-internal'].isSystem = !!configValue.isSystem;

        const node = {
          // convert observable value to pure js object for debugging
          fieldName,
          ...parsedSchema,
          'x-index': field['x-index'],
          'x-mega-props': {
            labelCol: this.labelAlign === 'right' ? 4 : undefined,
          },
        };

        return {
          display: parsedSchema.display,
          id: fieldName,
          type: 'object',
          componentName: parsedSchema['x-component']?.toLowerCase(),
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
          'x-internal': parsedSchema?.['x-internal'],
        };
      }, {});
  }

  @computed get hiddenFieldsForCanvas(): Array<IteratISchema> {
    return this.fields
      .concat(this.internalFields)
      .filter(({ fieldName }) => !INTERNAL_FIELD_NAMES.includes(fieldName))
      .sort((a, b) => (a['x-index'] || 0) - (b['x-index'] || 0))
      .map((field): IteratISchema => {
        const { fieldName, componentName, configValue } = field;
        const { toSchema } = registry.elements[componentName.toLowerCase()] || {};
        if (!toSchema) {
          logger.error(`failed to find component: [${componentName}] in registry`);
        }

        const parsedSchema = toSchema(toJS(configValue));

        parsedSchema['x-internal'] = parsedSchema['x-internal'] || { defaultValueFrom: 'customized' };
        parsedSchema['x-internal'].isSystem = !!configValue.isSystem;

        const node = {
          // convert observable value to pure js object for debugging
          fieldName,
          ...parsedSchema,
          'x-index': field['x-index'],
          'x-mega-props': {
            labelCol: this.labelAlign === 'right' ? 4 : undefined,
          },
          display: true,
        };

        return {
          display: parsedSchema.display,
          id: fieldName,
          type: 'object',
          componentName: parsedSchema['x-component'],
          'x-internal': parsedSchema['x-internal'],
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
      })
      .filter((field) => !field.display);
  }

  @computed get schemaForCanvas(): ISchema {
    const properties = Object.keys(toJS(this.schema.properties) || {})
      .filter((key) => !INTERNAL_FIELD_NAMES.includes(key))
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

  validate(): boolean {
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

  @action appendComponentToLayout(
    layoutcomponentKey: string, fieldName: string, position: number, tabIndex?: string,
  ): void {
    this.hasEdit = true;

    const field = registry.elements[fieldName.toLocaleLowerCase()];

    const newField = {
      tabIndex,
      ...field,
      configValue: { ...field.defaultConfig, appID: this.appID },
      fieldName: generateRandomFormFieldID(),
      'x-index': position,
      parentField: layoutcomponentKey,
    };

    if (!this.fields.length) {
      this.fields.push(newField);
      this.setActiveFieldKey(newField.fieldName);
      return;
    }

    this.fields = this.fields.map((field) => {
      const currentIndex = field['x-index'] as number;

      const shouldIncreaseKey = field.parentField === layoutcomponentKey && (currentIndex >= position);

      return Object.assign({}, field, {
        'x-index': shouldIncreaseKey ? currentIndex + 1 : currentIndex,
      });
    }).concat(newField);

    this.setActiveFieldKey(newField.fieldName);
  }

  @action modComponentPosition(
    componentKey: string, position: number, layoutcomponentKey?: string, tabIndex?: string,
  ): void {
    this.hasEdit = true;

    this.fields = this.fields.map((field) => {
      if (field.fieldName === componentKey) {
        const newField = Object.assign(
          {},
          this.fields.find((itm) => itm.fieldName === componentKey) as FormItem,
          {
            tabIndex,
            'x-index': position,
            parentField: layoutcomponentKey,
          },
        );

        this.setActiveFieldKey(newField.fieldName);

        return newField;
      } else {
        const currentIndex = field['x-index'] as number;

        const shouldIncreaseKey = field.parentField === layoutcomponentKey && (currentIndex >= position);

        return Object.assign({}, field, {
          'x-index': shouldIncreaseKey ? currentIndex + 1 : currentIndex,
        });
      }
    });
  }

  @action
  updateFieldIndex(newIndex: number, oldIndex: number, updateFieldId: string): void {
    const upper = Math.max(newIndex, oldIndex);
    const lower = Math.min(newIndex, oldIndex);
    const increaseValue = newIndex > oldIndex ? -1 : 1;

    this.fields = this.fields.map((field) => {
      if (field.fieldName === updateFieldId) {
        return Object.assign({}, field, {
          'x-index': newIndex,
        });
      }

      const currentIndex = field['x-index'] as number;

      const shouldIncrease = !field.parentField && (currentIndex >= lower) && (currentIndex <= upper);

      return Object.assign({}, field, {
        'x-index': shouldIncrease ? currentIndex + increaseValue : currentIndex,
      });
    });
  }

  @action
  updateFieldInLayoutIndex(
    newIndex: number, oldIndex: number, updateFieldId: string, parentFieldId: string,
  ): void {
    const upper = Math.max(newIndex, oldIndex);
    const lower = Math.min(newIndex, oldIndex);
    const increaseValue = newIndex > oldIndex ? -1 : 1;

    this.fields = this.fields.map((field) => {
      if (field.fieldName === updateFieldId) {
        return Object.assign({}, field, {
          'x-index': newIndex,
        });
      }

      const currentIndex = field['x-index'] || 0;

      const shouldIncrease = (field.parentField === parentFieldId) &&
        (currentIndex >= lower) &&
        (currentIndex <= upper);

      return Object.assign({}, field, {
        'x-index': shouldIncrease ? currentIndex + increaseValue : currentIndex,
      });
    });
  }

  @action
  updateFieldInTabsIndex(
    newIndex: number, oldIndex: number, updateFieldId: string, parentFieldId: string, tabIndex: string,
  ): void {
    const upper = Math.max(newIndex, oldIndex);
    const lower = Math.min(newIndex, oldIndex);
    const increaseValue = newIndex > oldIndex ? -1 : 1;

    this.fields = this.fields.map((field) => {
      if (field.fieldName === updateFieldId) {
        return Object.assign({}, field, {
          'x-index': newIndex,
        });
      }

      const currentIndex = field['x-index'] || 0;
      const shouldIncrease = (field.parentField === parentFieldId) &&
        (field.tabIndex === tabIndex) &&
        (currentIndex >= lower) && (currentIndex <= upper);

      return Object.assign({}, field, {
        'x-index': shouldIncrease ? currentIndex + increaseValue : currentIndex,
      });
    });
  }

  @action
  appendComponent(fieldName: string, position: number): void {
    this.hasEdit = true;

    const fieldSourceElement = registry.elements[fieldName.toLocaleLowerCase()];
    const fieldSchema = fieldSourceElement.toSchema(fieldSourceElement.defaultConfig);

    const fieldNames = generateRandomFormFieldID();

    const newField: FormItem = {
      ...fieldSchema,
      componentName: fieldSourceElement.componentName,
      configValue: {
        ...fieldSourceElement.defaultConfig, appID: this.appID, id: fieldNames,
      },
      fieldName: fieldNames,
      'x-index': position,
    };

    if (!this.fields.length) {
      this.fields.push(newField);
      this.setActiveFieldKey(newField.fieldName);
      return;
    }

    // this.fields.splice(position, 0, newField);
    this.fields = this.fields.map((field) => {
      const currentIndex = field['x-index'] as number;

      const shouldIncreaseKey = (!field.parentField) && (currentIndex >= position);

      return Object.assign({}, field, {
        'x-index': shouldIncreaseKey ? currentIndex + 1 : currentIndex,
      });
    });
    this.fields.push(newField);

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

    this.fields = this.fields.filter((field) => {
      return field.fieldName !== fieldName && field.parentField !== fieldName;
    });
  }

  @action
  duplicate(fieldName: string): void {
    let index = -1;
    const field = this.fields.find((field, i) => {
      index = i;
      return field.fieldName === fieldName;
    });

    if (!field) {
      return;
    }

    const newField = { ...field, fieldName: generateRandomFormFieldID() };
    this.fields.splice(index + 1, 0, newField);
    this.hasEdit = true;
  }

  @action
  moveUp(fieldName: string): void {
    let index = -1;
    const field = this.fields.find((field, i) => {
      index = i;
      return field.fieldName === fieldName;
    });

    if (!field || index < 1) {
      return;
    }
  }

  @action
  moveDown(fieldName: string): void {
    let index = -1;
    const field = this.fields.find((field, i) => {
      index = i;
      return field.fieldName === fieldName;
    });

    if (!field || index >= this.fields.length - 1) {
      return;
    }

    const [previous, current] = this.fields.slice(index, index + 2);
    this.fields.splice(index, 2, current, previous);
    this.hasEdit = true;
  }

  // updateFieldConfig should be next method name
  @action
  updateFieldConfig(value: any): void {
    this.hasEdit = true;
    this.fields = this.fields.map((f) => {
      if (f.fieldName !== this.activeFieldName) {
        return f;
      }

      f.configValue = toJS(value);
      return f;
    });
  }

  @action
  updateFieldConfigValue(targetName: string, value: any): void {
    this.fields = this.fields.map((field) => {
      if (field.fieldName === targetName) {
        field.configValue = toJS(value);
      }
      return field;
    });
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
