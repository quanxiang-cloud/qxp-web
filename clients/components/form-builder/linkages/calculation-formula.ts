import { get } from 'lodash';
import { of } from 'rxjs';
import { switchMap, debounceTime, filter } from 'rxjs/operators';
import { FormEffectHooks, ISchemaFormActions } from '@formily/antd';
import { findVariables, parse, resolve } from 'qxp-formula/lib/src/logical-formula';

import logger from '@lib/logger';

const { onFieldValueChange$ } = FormEffectHooks;

type Linkage = { rawFormula: string; targetField: string; };

function findAllFormula(schema: ISchema): Array<Linkage> {
  return Object.keys(schema.properties || {}).map<Linkage | null>((fieldName) => {
    const defaultValueFrom = get(schema, `properties.${fieldName}.x-internal.defaultValueFrom`);
    const calculationFormula = get(schema, `properties.${fieldName}.x-internal.calculationFormula`);

    if (!calculationFormula || defaultValueFrom !== 'formula') {
      return null;
    }

    return { rawFormula: calculationFormula, targetField: fieldName };
  }).filter((linkage): linkage is Linkage => !!linkage);
}

type ExecuteFormulaProps = {
  rawFormula: string;
  targetField: string;
  formActions: ISchemaFormActions,
}

function executeFormula({ rawFormula, formActions, targetField }: ExecuteFormulaProps) {
  const { setFieldState, getFieldValue } = formActions;
  const ast = parse(rawFormula);
  const dependentFields = [...findVariables(ast)];
  if (!dependentFields.length) {
    logger.warn('skip execution for formula: [%{rawFormula}], due to no dependentFields found.');
    return;
  }
  // *(abc,def,gij)
  onFieldValueChange$(`*(${dependentFields.join(',')})`).pipe(
    debounceTime(200),
    switchMap(() => {
      let missingValueField = false;
      const values = dependentFields.reduce<{ [key: string]: any }>((acc, fieldName) => {
        const value = getFieldValue(fieldName);
        if (value === undefined) {
          missingValueField = true;
        }
        acc[fieldName] = value;
        return acc;
      }, {});
      return of([missingValueField, values]);
    }),
    filter(([missingValueField]) => {
      if (missingValueField) {
        return false;
      }

      return true;
    }),
  ).subscribe(([, values]) => {
    logger.debug('execute calculation formula on form field', 'todo');
    try {
      const value = resolve(ast, values);
      setFieldState(targetField, (state) => state.value = value);
    } catch (err) {
      logger.error('failed to calculate value from formula', err);
    }
  });
}

export default function CalculationFormulaEffect(schema: ISchema, formActions: ISchemaFormActions) {
  findAllFormula(schema).forEach(({ rawFormula, targetField }) => {
    executeFormula({ rawFormula, targetField, formActions });
  });
}
