import { FormEffectHooks, ISchemaFormActions } from '@formily/antd';
import { debounceTime } from 'rxjs/operators';
import { get, set } from 'lodash';

const SUPPORT_FILTER_COMP = ['AssociatedData', 'AssociatedRecords'];

const { onFieldValueChange$ } = FormEffectHooks;

type LinkedFilterConfig = {
  field: string;
  targetFields: string[];
}

function getNewCondition(
  initConditions: Condition[],
  getFieldValue: (path: string) => any,
  rowNum:number,
): Condition[] {
  return initConditions.reduce((acc, conditionItem) => {
    const value = getFieldValue(conditionItem.path?.replace('*', rowNum.toString()) || '');
    if (
      conditionItem.valueFrom === 'form' && value
    ) {
      return acc.concat({ ...conditionItem, value: [].concat(value) });
    }

    return acc;
  }, [] as Condition[]);
}

function findLinkagesFilterComp(schema: ISchema, precedingPath = ''): LinkedFilterConfig[] {
  return Object.entries(schema.properties || {}).reduce((
    acc,
    [fieldName, fieldSchema]: [string, ISchema],
  ) => {
    if (fieldSchema.items && fieldSchema['x-component']?.toLowerCase() === 'subtable') {
      acc.push(...findLinkagesFilterComp(fieldSchema.items as ISchema, `${fieldName}.*.`));
    }

    if (SUPPORT_FILTER_COMP.includes(fieldSchema['x-component'] as string)) {
      const { filterConfig } = fieldSchema['x-component-props'] || {};
      if (filterConfig && filterConfig.condition && filterConfig.condition.length !== 0) {
        const targetFields = (filterConfig as FilterConfig).condition.reduce((targetFieldsAcc, condition) => {
          if (condition.valueFrom === 'form') {
            targetFieldsAcc.push(precedingPath + condition.value?.toString() || '');
            condition.path = precedingPath + condition.value?.toString() || '';
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

export default function formValueToFilter(schema: ISchema, formActions: ISchemaFormActions): void {
  const { setFieldState, getFieldValue } = formActions;
  findLinkagesFilterComp(schema).forEach(({ field, targetFields }) => {
    onFieldValueChange$(`*(${targetFields.join(',')})`).pipe(
      debounceTime(200),
    ).subscribe(({ name }) => {
      const xComp = getXComp(field, schema);
      if (xComp) {
        const [match] = /(?<=\.).*?(?=\.)/.exec(name) || [];
        setFieldState(field.replace('*', match), (state) => {
          set(state, 'props.x-component-props', {
            ...xComp,
            filterConfig: {
              ...xComp.filterConfig,
              condition: getNewCondition(xComp.filterConfig.condition, getFieldValue, Number(match)),
            },
          });
        });
      }
    });
  });
}
