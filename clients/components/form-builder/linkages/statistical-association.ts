import { get, isNull } from 'lodash';
import { of, Observable } from 'rxjs6';
import { switchMap, debounceTime, reduce, map as mapOp } from 'rxjs6/operators';
import { FormEffectHooks, ISchemaFormActions, IFieldState } from '@formily/antd';
import { flattenDeep, isArray, isEmpty, isUndefined } from 'lodash';
import { findVariables, parse, resolve } from 'qxp-formula';
import { pipe, map, ifElse, pick, last, fromPairs } from 'ramda';

import logger from '@lib/logger';
import { getFieldPath } from '@c/form-builder/linkages/default-value';

const { onFieldValueChange$ } = FormEffectHooks;

type Linkage = { rawFormula: string; targetField: string; };

export function findAllLinkStatistics(schema: ISchema, subTableFieldName?: string): Array<Linkage> {
  const linkages = Object.keys(schema.properties || {}).map((fieldName) => {
    const field = get(schema, `properties.${fieldName}`);
    const linkStatistics = get(field, 'x-component-props.linkStatistics');
    const sourceFieldId = get(field, 'x-component-props.sourceFieldId');
    // @ts-ignore
    if (field.items && field['x-component']?.toLowerCase() === 'subtable') {
      // @ts-ignore
      return findAllLinkStatistics(field.items as ISchema, fieldName);
    }
    if (!linkStatistics || !sourceFieldId) {
      return;
    }

    return {
      rawFormula: sourceFieldId,
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

type DependentFieldsValue = {
  values: Record<string, any>;
  missingValueField: boolean;
}

function executeFormula({ rawFormula, formActions, targetField }: ExecuteFormulaProps): void {
  const { setFieldState, getFieldValue } = formActions;
  const ast = parse(rawFormula);

  const getDependentFields = pipe(
    () => ast,
    findVariables,
    (variables) => [...variables],
    map((dependentField: string) => dependentField.replace('_dot_star_dot_', '.*.')),
  );
  const dependentFields = getDependentFields();
  const subTableDependtFields = dependentFields
    .filter((field) => field.includes('.*.'))
    .map((field) => last(field.split('.*.')))
    .filter(Boolean) as string[];

  if (!dependentFields.length) {
    logger.warn('skip execution for formula: [%{rawFormula}], due to no dependentFields found.');
    return;
  }

  function dependentFieldsValueReducerGenerator(state: IFieldState): (
      acc: DependentFieldsValue, current: string
    ) => DependentFieldsValue {
    let missingValueField = false;
    return (valuesAcc: DependentFieldsValue, fieldName: string) => {
      let fieldPath = getFieldPath(fieldName, state.path);
      if (fieldPath.includes('.*.')) {
        fieldPath = fieldPath.split('.*.').slice(0, -1).join('.');
      }
      const fieldValue = getFieldValue(fieldPath);
      const fieldValueFilter = (val: Record<string, any>[] | string): Record<string, any> | string => {
        if (!isArray(val)) {
          return val;
        }
        return val.filter((value) => Object.values(pick(subTableDependtFields, value)).every(
          (value) => !isUndefined(value),
        ));
      };
      const condition = ifElse(
        () => isUndefined(fieldValue) || isNull(fieldValue) ||
            (isArray(fieldValue) && fieldValue.every(isEmpty)),
        () => missingValueField = true,
        () => valuesAcc.values[fieldPath] = fieldValueFilter(fieldValue),
      );
      condition();
      return { ...valuesAcc, missingValueField };
    };
  }

  function combineOperator(state: IFieldState) {
    return (obs$: Observable<any>) => new Observable((observer) => obs$.subscribe({
      next: (value: { values: Record<string, any>, missingValueField: boolean }) => {
        return observer.next([value.missingValueField, value.values, state]);
      },
      error: (err: Error) => observer.error(err),
      complete: () => observer.complete(),
    }));
  }
  // *(abc,def,gij)
  onFieldValueChange$(`*(${dependentFields.join(',')})`).pipe(
    debounceTime(200),
    switchMap((state) => of(...dependentFields).pipe(
      reduce(dependentFieldsValueReducerGenerator(state), { values: {}, missingValueField: false }),
      combineOperator(state),
    )),
    mapOp(([, values, state]: any) => [values, state.path]),
  ).subscribe(([_values, _currentPath]) => {
    const values = _values as Record<string, any>;
    const currentPath = _currentPath as string;
    let lineNumber: number | undefined = Number(currentPath.match(/\.(\d+)\./)?.[1]);
    lineNumber = isNaN(lineNumber) ? undefined : lineNumber;
    const subTableFieldKey = lineNumber ? undefined : Object.keys(values).find((key) => isArray(values[key]));
    function assignValue(values: Record<string, any>, path: string): void {
      try {
        const resultValue = resolve(ast, values);
        setFieldState(path, (state) => state.value = resultValue);
      } catch (err: any) {
        setFieldState(path, (state) => state.value = undefined);
        // logger.debug('execute calculation formula on form field', 'todo');
      }
    }
    function subTableValueConvertor(value: Record<string, any>, prefix?: string): Record<string, any> {
      return fromPairs(Object.entries(value).map(([key, value]) => {
        return [prefix ? `${prefix}_dot_star_dot_${key}` : key.replace(/\.\d+\./, '_dot_star_dot_'), value];
      }));
    }
    function processMainTableChange(): void {
      values[subTableFieldKey as string].forEach((value: Record<string, any>, lineNumber: number) => {
        assignValue(
          { ...values, ...subTableValueConvertor(value, subTableFieldKey) },
          targetField.replace('.*.', `.${lineNumber}.`),
        );
      });
    }
    function processNormalOrSubTableChange(): void {
      assignValue(subTableValueConvertor(values), getFieldPath(targetField, currentPath));
    }
    const condition = ifElse(
      () => !!subTableFieldKey, processMainTableChange, processNormalOrSubTableChange,
    );
    condition();
  });
}

export default function StatisticalAssociationEffect(
  schema: ISchema, formActions: ISchemaFormActions,
): void {
  const allLinkStatistics = findAllLinkStatistics(schema);
  allLinkStatistics.forEach(({ rawFormula, targetField }) => {
    executeFormula({ rawFormula, targetField, formActions });
  });
}
