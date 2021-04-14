import { nanoid } from 'nanoid';
import { action, computed, observable, toJS } from 'mobx';

export type FormItemInstance = SourceElement<any> & {
  fieldName: string;
  configValue: any;
};

type Props = {
  schema: FormBuilder.Schema;
}

// todo support tree structure
function schemaToFields({ properties }: FormBuilder.Schema): Array<FormItemInstance> {
  if (!properties) {
    return [];
  }

  return [];

  // return Object.keys(properties).sort((keyA, keyB) => {
  //   return properties[keyA] - properties[keyB];
  // }).map((key) => {
  //   return {
  //     fieldName: key,
  //     properties[key],
  //     configValue: {},
  //   };
  // });
}

export default class FormBuilderStore {
  @observable fields: Array<FormItemInstance>;
  @observable activeFieldName = '';
  @observable activeFieldWrapperName = '';

  constructor({ schema }: Props) {
    this.fields = schemaToFields(schema);

    if (this.fields.length) {
      this.activeFieldName = this.fields[0].fieldName;
    }
  }

  @computed get activeField(): FormItemInstance | null {
    return this.fields.find(({ fieldName }) => fieldName === this.activeFieldName) || null;
  }

  @computed get schema(): ISchema {
    const properties = this.fields.reduce<Record<string, any>>((acc, field, index) => {
      const { fieldName, toSchema, configValue } = field;
      acc[fieldName] = {
        // convert observable value to pure js object for debugging
        ...toSchema(toJS(configValue)),
        'x-index': index,
        'x-mega-props': {
          labelAlign: 'top',
        },
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
        'x-mega-props': {
          labelAlign: 'top',
        },
        properties: {
          [key]: this.schema.properties?.[key],
        } as { [key: string]: ISchema; },
      };

      const newKey = `wrap-${key}`;
      acc[newKey] = wrapperNode;

      return acc;
    }, {});

    return {
      title: '',
      type: 'object',
      properties: properties,
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
      ...field,
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
