import { nanoid } from 'nanoid';
import { action, computed, observable, toJS } from 'mobx';

import registry from './registry';
import logger from '@clients/lib/logger';

export type FormItem = {
  componentName: string;
  fieldName: string;
  configValue: any;
};

type Props = {
  schema: FormBuilder.Schema;
}

const INTERNAL_FIELDS: Array<FormItem> = [
  {
    fieldName: '_id',
    componentName: 'Input',
    configValue: { displayModifier: 'hidden' },
  },
  {
    fieldName: '_created_time',
    componentName: 'Input',
    configValue: { displayModifier: 'hidden' },
  },
  {
    fieldName: '_updated_time',
    componentName: 'Input',
    configValue: { displayModifier: 'hidden' },
  },
  {
    fieldName: '_created_by',
    componentName: 'Input',
    configValue: { displayModifier: 'hidden' },
  },
  {
    fieldName: '_updated_by',
    componentName: 'Input',
    configValue: { displayModifier: 'hidden' },
  },
];

// todo support tree structure
function schemaToFields({ properties }: FormBuilder.Schema): Array<FormItem> {
  if (!properties) {
    return INTERNAL_FIELDS;
  }

  const sortedKeys = Object.keys(properties).sort((keyA, keyB) => {
    const keyAIndex = properties[keyA]['x-index'] || 0;
    const keyBIndex = properties[keyB]['x-index'] || 0;
    return keyAIndex - keyBIndex;
  });

  return sortedKeys.map((key) => {
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
}

export default class FormBuilderStore {
  @observable fields: Array<FormItem>;
  @observable activeFieldName = '';
  @observable activeFieldWrapperName = '';

  constructor({ schema }: Props) {
    this.fields = schemaToFields(schema);

    if (this.fields.length) {
      this.activeFieldName = this.fields[0].fieldName;
    }
  }

  @computed get activeField(): FormItem | null {
    return this.fields.find(({ fieldName }) => fieldName === this.activeFieldName) || null;
  }

  @computed get activeFieldConfigSchema(): ISchema | null {
    const componentName = this.activeField?.componentName;
    if (!componentName) {
      return null;
    }

    return registry.elements[componentName].configSchema;
  }

  @computed get schema(): ISchema {
    const properties = this.fields.reduce<Record<string, any>>((acc, field, index) => {
      const { fieldName, componentName, configValue } = field;

      const { toSchema } = registry.elements[componentName.toLowerCase()] || {};
      if (!toSchema) {
        logger.error(`failed to find component: [${componentName}] in registry`);
      }

      acc[fieldName] = {
        // convert observable value to pure js object for debugging
        ...toSchema(toJS(configValue)),
        'x-index': index,
      };

      return acc;
    }, {});

    return {
      title: '',
      type: 'object',
      properties: properties,
    };
  }

  @computed get schemaForCanvas(): ISchema {
    const originalProperties = toJS(this.schema.properties) || {};
    const properties = Object.keys(originalProperties).reduce<Record<string, any>>((acc, key) => {
      const wrapperNode: ISchema = {
        type: 'object',
        'x-component': 'FormFieldWrapper',
        'x-index': this.schema.properties?.[key]['x-index'],
        properties: {
          [key]: this.schema.properties?.[key],
        } as { [key: string]: ISchema; },
      };

      const newKey = `wrap-${key}`;
      acc[newKey] = wrapperNode;

      return acc;
    }, {});

    return {
      type: 'object',
      properties: {
        FILEDS: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            labelAlign: 'left',
          },
          properties: properties,
        },
      },
    };
  }

  @action
  setActiveFieldKey(fieldName: string) {
    this.activeFieldName = fieldName;
    this.activeFieldWrapperName = `wrap-${fieldName}`;
  }

  @action
  setActiveFieldWrapperKey(fieldName: string) {
    this.activeFieldWrapperName = fieldName;
    this.activeFieldName = fieldName.slice(5);
  }

  @action
  append(field: SourceElement<any>) {
    this.fields.push({
      componentName: field.componentName.toLowerCase(),
      configValue: field.defaultConfig,
      fieldName: nanoid(8),
    });
  }

  @action
  delete(fieldName: string) {
    this.fields = this.fields.filter((field) => field.fieldName !== fieldName);
  }

  @action
  updateFieldConfig(value: any) {
    this.fields = this.fields.map((f) => {
      if (f.fieldName !== this.activeFieldName) {
        return f;
      }

      f.configValue = toJS(value);
      return f;
    });
  }
}
