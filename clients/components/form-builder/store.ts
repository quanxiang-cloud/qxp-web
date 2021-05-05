import { nanoid } from 'nanoid';
import { action, computed, observable, toJS } from 'mobx';

import registry from './registry';
import logger from '@lib/logger';

export type FormItem = {
  componentName: string;
  fieldName: string;
  configValue: any;
  title?: string;
};

type Props = {
  schema: FormBuilder.Schema;
}

const INTERNAL_FIELDS: Array<FormItem> = [
  {
    fieldName: '_id',
    componentName: 'Input',
    configValue: { displayModifier: 'hidden', title: 'id' },
  },
  {
    fieldName: 'created_at',
    componentName: 'DatePicker',
    configValue: { displayModifier: 'hidden', title: '创建时间' },
  },
  {
    fieldName: 'updated_at',
    componentName: 'DatePicker',
    configValue: { displayModifier: 'hidden', title: '修改时间' },
  },
  {
    fieldName: 'creator_name',
    componentName: 'Input',
    configValue: { displayModifier: 'hidden', title: '创建者' },
  },
  {
    fieldName: 'modifier_name',
    componentName: 'Input',
    configValue: { displayModifier: 'hidden', title: '修改者' },
  },
];

// todo refactor this
const INTERNAL_FIELD_NAMES = INTERNAL_FIELDS.map(({ fieldName }) => fieldName);

// todo support tree structure
function schemaToFields({ properties }: FormBuilder.Schema): [Array<FormItem>, Array<FormItem>] {
  if (!properties) {
    return [INTERNAL_FIELDS, []];
  }

  const sortedKeys = Object.keys(properties).sort((keyA, keyB) => {
    const keyAIndex = properties[keyA]['x-index'] || 0;
    const keyBIndex = properties[keyB]['x-index'] || 0;
    return keyAIndex - keyBIndex;
  }).filter((key) => !INTERNAL_FIELD_NAMES.includes(key));

  const fields = sortedKeys.map((key) => {
    const componentName = properties[key]['x-component']?.toLowerCase();
    if (!componentName || !registry.elements[componentName]) {
      // todo refactor this message
      logger.error('fatal! there is no x-component in schema:', properties[key]);
      return null;
    }

    const configValue = registry.elements[componentName].toConfig(properties[key]);

    return {
      fieldName: key,
      componentName: componentName,
      configValue: configValue,
    };
  }).filter((formItem): formItem is FormItem => !!formItem);

  return [INTERNAL_FIELDS, fields];
}

export default class FormBuilderStore {
  internalFields: Array<FormItem>;
  @observable fields: Array<FormItem>;
  @observable activeFieldName = '';
  @observable labelAlign = 'right';
  @observable hasEdit = false;

  constructor({ schema }: Props) {
    const [internalFields, fields] = schemaToFields(schema);
    this.internalFields = internalFields;
    this.fields = fields;
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

  @computed get activeFieldConfigSchema(): ISchema | null {
    const componentName = this.activeField?.componentName;
    if (!componentName) {
      return null;
    }

    return registry.elements[componentName.toLocaleLowerCase()].configSchema;
  }

  @computed get schema(): ISchema {
    const properties = this.internalFields
      .concat(this.fields)
      .reduce<Record<string, any>>((acc, field, index) => {
        const { fieldName, componentName, configValue } = field;

        const { toSchema } = registry.elements[componentName.toLowerCase()] || {};
        if (!toSchema) {
          logger.error(`failed to find component: [${componentName}] in registry`);
        }

        acc[fieldName] = {
          // convert observable value to pure js object for debugging
          ...toSchema(toJS(configValue)),
          'x-index': index,
          'x-mega-props': {
            labelCol: this.labelAlign === 'right' ? 4 : undefined,
          },
        };

        return acc;
      }, {});

    return {
      title: '',
      type: 'object',
      properties: properties,
      'x-internal': {
        version: '1.3.13',
      },
    };
  }

  @computed get schemaForPreview():ISchema {
    const { properties } = this.schema;
    return {
      type: 'object',
      properties: {
        FIELDs: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            labelAlign: this.labelAlign,
          },
          properties: properties,
        },
      },
    };
  }

  @computed get schemaForCanvas(): ISchema {
    const properties = Object.keys(toJS(this.schema.properties) || {})
      .filter((key) => !INTERNAL_FIELD_NAMES.includes(key))
      .reduce<Record<string, any>>((acc, key, index) => {
        const childrenInvisible = !this.schema.properties?.[key].display;
        const wrapperNode: ISchema = {
          type: 'object',
          'x-component': 'FormFieldWrapper',
          'x-index': index,
          // 'x-component-props': { childrenInvisible },
          properties: {
            [key]: {
              ...this.schema.properties?.[key],
              display: true,
              title: childrenInvisible ? '******' : this.schema.properties?.[key].title,
            },
          } as { [key: string]: ISchema; },
        };

        const newKey = `wrap-${key}`;
        acc[newKey] = wrapperNode;

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
          },
          properties: properties,
        },
      },
    };
  }

  @action updateLabelAlign(labelAlign: 'left' | 'right' | 'top') {
    this.labelAlign = labelAlign;
  }

  @action
  setActiveFieldKey(fieldName: string) {
    this.activeFieldName = fieldName;
  }

  @action
  append(field: SourceElement<any>, index?: number) {
    const newField = {
      ...field,
      // componentName: field.componentName.toLowerCase(), //Need change componentName to lowercase
      configValue: field.defaultConfig,
      fieldName: nanoid(8),
    };
    if (index === undefined) {
      this.fields.push(newField);
      return;
    }

    this.fields.splice(index + 1, 0, newField);
    this.hasEdit = true;
  }

  @action
  delete(fieldName: string) {
    this.hasEdit = true;
    this.fields = this.fields.filter((field) => field.fieldName !== fieldName);
  }

  @action
  duplicate(fieldName: string) {
    let index = -1;
    const field = this.fields.find((field, i) => {
      index = i;
      return field.fieldName === fieldName;
    });

    if (!field) {
      return;
    }

    const newField = { ...field, fieldName: nanoid(8) };
    this.fields.splice(index + 1, 0, newField);
    this.hasEdit = true;
  }

  @action
  moveUp(fieldName: string) {
    let index = -1;
    const field = this.fields.find((field, i) => {
      index = i;
      return field.fieldName === fieldName;
    });

    if (!field || index < 1) {
      return;
    }

    const [previous, current] = this.fields.slice(index - 1, index + 1);
    this.fields.splice(index - 1, 2, current, previous);
    this.hasEdit = true;
  }

  @action
  moveDown(fieldName: string) {
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

  @action
  updateFieldConfig(value: any) {
    this.hasEdit = true;
    this.fields = this.fields.map((f) => {
      if (f.fieldName !== this.activeFieldName) {
        return f;
      }

      f.configValue = toJS(value);
      return f;
    });
  }
}
