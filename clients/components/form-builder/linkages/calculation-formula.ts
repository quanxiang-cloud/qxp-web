import { get } from 'lodash';
import { of } from 'rxjs';
import { switchMap, debounceTime, filter } from 'rxjs/operators';
import { FormEffectHooks, ISchemaFormActions, IFieldState } from '@formily/antd';
import { flattenDeep, last, isArray } from 'lodash';
import { findVariables, parse, resolve } from 'qxp-formula';

import logger from '@lib/logger';
import { getFieldPath } from '@c/form-builder/linkages/default-value';

const { onFieldValueChange$ } = FormEffectHooks;

type Linkage = { rawFormula: string; targetField: string; };

export function findAllFormula(schema: ISchema, subTableFieldName?: string): Array<Linkage> {
  const linkages = Object.keys(schema.properties || {}).map<Linkage | Linkage[]>((fieldName) => {
    const field = get(schema, `properties.${fieldName}`);
    const defaultValueFrom = get(field, 'x-internal.defaultValueFrom');
    const calculationFormula = get(field, 'x-internal.calculationFormula');
    if (field.items && field['x-component']?.toLowerCase() === 'subtable') {
      return findAllFormula(field.items as ISchema, fieldName);
    }

    if (!calculationFormula || defaultValueFrom !== 'formula') {
      return [];
    }

    return {
      rawFormula: calculationFormula,
      targetField: subTableFieldName ? `${subTableFieldName}.*.${fieldName}` : fieldName,
    };
  });
  return flattenDeep(linkages).filter((linkage): linkage is Linkage => !!linkage);
}

type ExecuteFormulaProps = {
  rawFormula: string;
  targetField: string;
  formActions: ISchemaFormActions,
}

function executeFormula({ rawFormula, formActions, targetField }: ExecuteFormulaProps): void {
  const { setFieldState, getFieldValue } = formActions;
  const ast = parse(rawFormula);
  let dependentFields = [...findVariables(ast)];
  if (!dependentFields.length) {
    logger.warn('skip execution for formula: [%{rawFormula}], due to no dependentFields found.');
    return;
  }
  dependentFields = dependentFields.map((dependentField) => {
    const prefix = targetField.split('.').slice(0, -1).join('.');
    if (!dependentField.startsWith('subtable_')) {
      return dependentField;
    }
    return `${prefix}.${dependentField}`;
  });

  // *(abc,def,gij)
  onFieldValueChange$(`*(${dependentFields.join(',')})`).pipe(
    debounceTime(200),
    switchMap((state) => {
      let missingValueField = false;
      const values = dependentFields.reduce<{ [key: string]: any }>((acc, fieldName) => {
        let path = getFieldPath(fieldName, state.path);
        path = path.includes('.*.') ? path.split('.*.').slice(0, -1).join('.') : path;
        const value = getFieldValue(path);
        if (value === undefined || value === null) {
          missingValueField = true;
        }
        const lastLevelFieldName = last(fieldName.split('.'));
        if (lastLevelFieldName) {
          acc[lastLevelFieldName] = value;
        }
        return acc;
      }, {});
      return of([missingValueField, values, state]);
    }),
    filter((input): input is [true, Record<string, any>, IFieldState<any>] => {
      const [missingValueField] = input;
      if (missingValueField) {
        return false;
      }

      return true;
    }),
  ).subscribe(([, values, state]) => {
    logger.debug('execute calculation formula on form field', 'todo');
    try {
      const arrayKey = Object.keys(values).find((key) => isArray(values[key])) || '';
      const arrayValue = values[arrayKey];
      if (isArray(arrayValue)) {
        return arrayValue.forEach((val: any, index: number) => {
          const currentValues = { ...values, [arrayKey]: val[arrayKey] };
          const value = resolve(ast, currentValues);
          setFieldState(
            getFieldPath(targetField, targetField.replace('.*.', `.${index}.`)),
            (state) => state.value = value,
          );
        });
      }
      const value = resolve(ast, values);
      setFieldState(
        getFieldPath(targetField, state.path),
        (state) => state.value = value,
      );
    } catch (err) {
      logger.error('failed to calculate value from formula', err);
    }
  });
}

export default function CalculationFormulaEffect(
  schema: ISchema, formActions: ISchemaFormActions,
): void {
  findAllFormula(schema).forEach(({ rawFormula, targetField }) => {
    executeFormula({ rawFormula, targetField, formActions });
  });
}
