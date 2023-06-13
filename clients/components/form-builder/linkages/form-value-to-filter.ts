import {
  FormEffectHooks,
  ISchemaFormActions,
} from '@formily/antd';
import { get, set } from 'lodash';
import { debounceTime } from 'rxjs6/operators';

const SUPPORT_FILTER_COMP = ['AssociatedData', 'AssociatedRecords'];

const { onFieldValueChange$, onFieldMount$ } = FormEffectHooks;

type LinkedFilterConfig = {
  field: string;
  targetFields: string[];
}

function getFieldRealPath(path: string, rowIdxStr: string): string {
  if (!rowIdxStr) {
    return path;
  }

  return path?.replace('*', rowIdxStr.toString());
}

function getNewCondition(
  initConditions: Condition[],
  getFieldValue: (path: string) => any,
  rowIdxStr: string,
): Condition[] {
  return initConditions?.reduce((acc, conditionItem) => {
    const value = getFieldValue(getFieldRealPath(conditionItem.path || '', rowIdxStr));

    if (
      conditionItem.valueFrom === 'form' && value
    ) {
      return acc.concat({ ...conditionItem, value: [].concat(value) });
    }

    if ((conditionItem.valueFrom === 'parentForm') && value) {
      return acc.concat({ ...conditionItem, value: [].concat(value) });
    }

    if (conditionItem.valueFrom !== 'form' && conditionItem.valueFrom !== 'parentForm') {
      return acc.concat(conditionItem);
    }

    return acc;
  }, [] as Condition[]);
}

function findLinkagesFilterComp(schema: ISchema, precedingPath = ''): LinkedFilterConfig[] {
  return Object.entries(schema.properties || {})?.reduce((
    acc,
    [fieldName, fieldSchema]: [string, ISchema],
  ) => {
    if (fieldSchema.items && fieldSchema['x-component']?.toLowerCase() === 'subtable') {
      acc.push(...findLinkagesFilterComp(fieldSchema.items as ISchema, `${fieldName}.*.`));
    }

    if (SUPPORT_FILTER_COMP.includes(fieldSchema['x-component'] as string)) {
      const { filterConfig } = fieldSchema['x-component-props'] || {};
      if (filterConfig && filterConfig.condition && filterConfig.condition.length !== 0) {
        const targetFields = (filterConfig as FilterConfig).condition?.reduce((targetFieldsAcc, condition) => {
          if (condition.valueFrom === 'form') {
            targetFieldsAcc.push(precedingPath + condition.value?.toString() || '');
            condition.path = precedingPath + condition.value?.toString() || '';
          }
          if (condition.valueFrom === 'parentForm' ) {
            targetFieldsAcc.push(condition.value?.toString() || '');
            condition.path = condition.value?.toString() || '';
          }

          return targetFieldsAcc;
        }, [] as string[]);

        targetFields.length !== 0 && acc.push({ field: precedingPath + fieldName, targetFields });
      }
    }

    return acc;
  }, [] as LinkedFilterConfig[]);
}

function getXComp(field: string, schema: ISchema): Record<string, any> | undefined {
  const path = field.replace('*', 'items.properties') + '.x-component-props';
  return get(schema.properties, path);
}

export default function formValueToFilter(
  schema: ISchema,
  formActions: ISchemaFormActions,
): void {
  const { setFieldState, getFieldValue } = formActions;

  function setFilterConfig(name: string, field: string): void {
    const xComp = getXComp(field, schema);

    if (xComp) {
      const rowIdxStr = name.match(/\.(\S*?)\./)?.[1] || '';

      setFieldState(getFieldRealPath(field, rowIdxStr), (state) => {
        set(state, 'props.x-component-props', {
          ...xComp,
          filterConfig: {
            ...xComp.filterConfig,
            condition: getNewCondition(xComp.filterConfig.condition, getFieldValue, rowIdxStr),
          },
        });
      });
    }
  }

  findLinkagesFilterComp(schema).forEach(({ field, targetFields }) => {
    onFieldValueChange$(`*(${targetFields.join(',')})`).pipe(
      debounceTime(200),
    ).subscribe(({ name }) => setFilterConfig(name, field));
    onFieldMount$(`*(${targetFields.join(',')})`).subscribe(({ name }) =>{
      if (name) {
        setFilterConfig(name, field);
      }
    });
  });
}
