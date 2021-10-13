import { action, computed, observable, toJS } from 'mobx';
import { cloneDeep, groupBy, set } from 'lodash';
import { nanoid } from 'nanoid';

import logger from '@lib/logger';
import Modal from '@c/modal';

import registry from './registry';
import { INTERNAL_FIELDS } from './constants';
import {
  getNewField,
  getFieldId,
  convertSchemaTree,
  flattenSchemaToFields,
} from './utils/fields-operator';
import {
  filterLinkageRules,
  shouldFilterLinkages,
  filterLinkageTargetKeys,
  filterLinkagesOnDeleteField,
  generateRandomFormFieldID,
  updateFieldIndex,
} from './utils';

type Props = {
  schema: ISchema;
  appID: string;
  pageID: string;
}

export type AddOrUpdateField = {
  fieldId: string;
  index: number;
  parentFieldId?: string;
  tabIndex?: string;
}

// todo refactor this
export const INTERNAL_FIELD_NAMES = INTERNAL_FIELDS.map(({ fieldName }) => fieldName);

export default class FormBuilderStore {
  appID: string;
  pageID: string;
  internalFields: Array<FormItem>;
  @observable activeFieldId = '';
  @observable labelAlign: 'right' | 'top' = 'right';
  @observable columnsCount: 1 | 2 = 1;
  @observable isLinkageConfigVisible = false;
  @observable visibleHiddenLinkages: FormBuilder.VisibleHiddenLinkage[] = [];
  @observable hasEdit = false;
  @observable validations: Array<ValidationFormula>;
  @observable isDragging = false;
  @observable tabsActiveList: Record<string, string> = {};
  @observable activeObj: Record<string, any> = {};
  @observable flattenFields: FormItem[] = [];

  constructor({ schema, appID, pageID }: Props) {
    this.flattenFields = flattenSchemaToFields(schema);
    this.internalFields = INTERNAL_FIELDS;
    this.appID = appID;
    this.pageID = pageID;
    this.visibleHiddenLinkages = schema['x-internal']?.visibleHiddenLinkages || [];
    this.columnsCount = schema['x-internal']?.columns || 1;
    this.labelAlign = schema?.['x-internal']?.labelAlign || 'right';
    this.validations = schema['x-internal']?.validations || [];
  }

  @computed get activeField(): FormItem | undefined {
    return this.flattenFields.find((v: FormItem) => v?.['x-internal']?.fieldId === this.activeFieldId);
  }

  @computed get flattenFieldsMap(): Record<string, FormItem> {
    return this.flattenFields.reduce((acc, item) => {
      acc[getFieldId(item)] = item;

      return acc;
    }, {} as Record<string, FormItem>);
  }

  @computed get activeFieldSourceElement(): FormBuilder.SourceElement<any> | null {
    const componentName = this.activeField?.componentName;
    if (!componentName) {
      return null;
    }

    return registry.elements[componentName.toLocaleLowerCase()] || null;
  }

  @computed get currentActiveField(): ISchema {
    return this.flattenFields
      .find((field) => getFieldId(field) === this.activeFieldId) || {};
  }

  @computed get schema(): ISchema {
    let properties: Record<string, ISchema> = {};

    /** recovert field to schema tree */
    if (this.flattenFields.length > 0) {
      const flattenFiledsSchema: ISchema[] =
        this.flattenFields.filter(Boolean).map(
          (field, index) => this.fieldToSchema(field as FormItem, index));

      const { false: nonParentFields } =
        groupBy(this.flattenFields.filter(Boolean), (schema) => {
          return !!schema?.['x-internal']?.parentFieldId;
        });

      properties = convertSchemaTree(flattenFiledsSchema, nonParentFields?.length ?? 0);
    }

    return {
      title: '',
      type: 'object',
      properties,
      'x-internal': {
        version: '1.3.13',
        labelAlign: this.labelAlign,
        columns: 1,
        visibleHiddenLinkages: toJS(this.visibleHiddenLinkages),
        validations: this.validations ? toJS(this.validations) : undefined,
        defaultValueFrom: 'customized',
      },
    };
  }

  // field to schema; using: submit stage
  @action fieldToSchema(field: FormItem, index: number): ISchema {
    const { componentName, configValue } = field;

    const xInternal = field?.['x-internal'] || {};
    const { fieldId, parentFieldId: parentFieldKey } = xInternal;

    const { toSchema } = registry.elements[componentName.toLowerCase()] || {};
    if (!toSchema) {
      logger.error(`failed to find component: [${componentName}] in registry`);
    }

    const parsedSchema = toSchema(toJS(configValue));
    parsedSchema['x-internal'] = parsedSchema['x-internal'] || { defaultValueFrom: 'customized' };

    set(parsedSchema, 'x-internal.isSystem', !!configValue.isSystem);
    set(parsedSchema, 'x-internal.fieldId', fieldId);
    set(parsedSchema, 'x-internal.parentFieldId', parentFieldKey);
    set(parsedSchema, 'x-internal.tabIndex', field?.['x-internal']?.tabIndex || field.tabIndex);

    const curCols = this.flattenFields.find(
      (field) => getFieldId(field) === parentFieldKey,
    )?.configValue?.columns;

    const currentCompName = parsedSchema?.['x-component']?.toLocaleLowerCase() || '';
    const excludeLabelCol = ['associatedrecords', 'subtable'];
    const cols = (curCols && !excludeLabelCol.includes(currentCompName)) ? curCols * 4 : 4;

    const node = {
      // convert observable value to pure js object for debugging
      ...parsedSchema,
      'x-index': index, // lose the 'x-index' field when invoking toSchema function. So, must add this
      'x-mega-props': {
        labelCol: this.labelAlign === 'right' ? cols : undefined,
      },
    };

    return node;
  }

  @action clone(fieldId: string): void {
    const cloneField = cloneDeep(this.flattenFields.find((v) => getFieldId(v) === fieldId));

    if (cloneField) {
      const xIndex = cloneField?.['x-index'] || 0;
      set(cloneField, 'x-internal.fieldId', generateRandomFormFieldID());
      set(cloneField, 'x-index', xIndex + 1);
      this.flattenFields.splice(xIndex, 0, cloneField);
      this.flattenFields = updateFieldIndex(this.flattenFields);
    }
  }

  @action insert({
    fieldId,
    index,
    parentFieldId,
    tabIndex,
  }: AddOrUpdateField): void {
    const newField = getNewField({ fieldId, tabIndex, parentFieldId, appID: this.appID });
    set(newField, 'x-index', index);
    this.flattenFields.splice(index, 0, newField as any);
    this.flattenFields = updateFieldIndex(this.flattenFields);
    this.setActiveFieldKey(getFieldId(newField as ISchema));
  }

  @action update({
    fieldId,
    parentFieldId,
    tabIndex,
    index,
  }: AddOrUpdateField): void {
    const delimiterIndex = index;

    const currentField = this.flattenFields.find((v: FormItem) => getFieldId(v) === fieldId);
    const currentIndex = this.flattenFields.findIndex((v: FormItem) => getFieldId(v) === fieldId);

    if (currentField) {
      set(currentField, 'x-internal.parentFieldId', parentFieldId);
      set(currentField, 'x-internal.tabIndex', tabIndex);
      set(currentField, 'x-index', index);
      this.flattenFields.splice(delimiterIndex, 0, currentField);
    }

    if (delimiterIndex < currentIndex) {
      this.flattenFields.splice(currentIndex + 1, 1);
    }
    if (delimiterIndex >= currentIndex) {
      this.flattenFields.splice(currentIndex, 1);
    }
    this.flattenFields = updateFieldIndex(this.flattenFields);
  }

  @action validate(fields: FormItem[] = this.flattenFields): boolean {
    if (!fields.length) {
      return true;
    }
    return fields.map(({ componentName, configValue, children }) => ({
      elem: registry.elements[componentName.toLowerCase()],
      configValue,
      children,
    })).every(({ elem, configValue, children = [] }) => {
      let isFieldValid = true;
      if (elem && typeof elem.validate === 'function') {
        isFieldValid = elem.validate(toJS(configValue), elem?.configSchema);
      }
      if (!isFieldValid) {
        return false;
      }
      return this.validate(children);
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
  setActiveFieldKey(fieldId: string): void {
    this.activeFieldId = fieldId;
  }

  @action setTabsActiveList(tabId: string, activeId: string): void {
    const _tabsList = { ...this.tabsActiveList };
    _tabsList[tabId] = activeId;

    this.tabsActiveList = _tabsList;
  }

  @action removeEmptyLayout(parentFieldId: string): void {
    const allParents = this.flattenFields.filter((v) => v?.['x-internal']?.parentFieldId === parentFieldId);

    if (allParents.length <= 0) {
      this.flattenFields = this.flattenFields.filter((v) => getFieldId(v) !== parentFieldId);
    }
  }

  @action
  deleteField(fieldId: string): void {
    this.hasEdit = true;
    const pid = this.flattenFieldsMap[fieldId]?.['x-internal']?.parentFieldId;

    if (shouldFilterLinkages(fieldId, this.visibleHiddenLinkages)) {
      const deleteConfirmModal = Modal.open({
        title: '提示',
        content: '有显隐规则引用到此字段，直接删除会清除对应的引用，是否确认删除？',
        onConfirm: () => {
          this.visibleHiddenLinkages = filterLinkagesOnDeleteField(
            fieldId,
            this.visibleHiddenLinkages,
            filterLinkageRules,
            filterLinkageTargetKeys,
          );

          this.flattenFields = this.flattenFields.filter((field) => getFieldId(field) !== fieldId);

          if (pid) this.removeEmptyLayout(pid);
          deleteConfirmModal.close();
        },
      });

      return;
    }

    this.flattenFields = this.flattenFields.filter((field) => getFieldId(field) !== fieldId);

    if (pid) this.removeEmptyLayout(pid);
  }

  // set field config by right panel
  @action
  updateFieldConfig(value: any): void {
    this.hasEdit = true;
    const targetField = this.currentActiveField as FormItem;

    if (!targetField) return;
    targetField.configValue = toJS(value);

    this.flattenFields = this.flattenFields.map((v) => {
      if (getFieldId(v) === this.activeFieldId) {
        return targetField;
      } else {
        return v;
      }
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
