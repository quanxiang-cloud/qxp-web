import { useEffect, useRef } from 'react';
import { last, pick } from 'lodash';
import { findVariables, parse, resolve } from 'qxp-formula';
import { debounceTime } from 'rxjs/operators';

import { useFormEffects, FormEffectHooks } from '@formily/react-schema-renderer';

import logger from '@lib/logger';
import { findAllFormula } from '@c/form-builder/linkages/calculation-formula';

import { getFieldPath } from '@c/form-builder/linkages/default-value';

export function useForeignFormula(
  isFromForeign: boolean, columns: string[], subTableFieldName?: string, schema?: ISchema,
): void {
  const schemaRef = useRef<ISchema>();

  useEffect(() => {
    schemaRef.current = schema;
  }, [schema]);

  useFormEffects((_, actions) => {
    if (!isFromForeign) {
      return;
    }
    FormEffectHooks.onFieldChange$('*').pipe(debounceTime(200)).subscribe((state) => {
      if (!schemaRef.current) {
        return;
      }
      const prepareSchema = {
        type: 'object',
        properties: {
          [`${subTableFieldName}`]: {
            type: 'array',
            'x-component': 'SubTable',
            items: {
              type: 'object',
              properties: pick(schemaRef.current.properties, ...columns) as Record<string, ISchema> || {},
            },
          },
        },
      };
      const linkages = findAllFormula(prepareSchema);
      linkages.forEach(({ rawFormula, targetField }) => {
        const ast = parse(rawFormula);
        let dependentFields = [...findVariables(ast)];
        if (!dependentFields.length) {
          logger.warn('skip execution for formula: [%{rawFormula}], due to no dependentFields found.');
          return;
        }
        dependentFields = dependentFields.map((dependentField) => {
          const prefix = targetField.split('.').slice(0, -1).join('.');
          return getFieldPath(`${prefix}.${dependentField}`, state.path || '');
        });
        let missingValueField = false;
        const values = dependentFields.reduce<{ [key: string]: any }>((acc, fieldName) => {
          const value = actions.getFieldValue(fieldName);
          if (value === undefined) {
            missingValueField = true;
          }
          const lastLevelFieldName = last(fieldName.split('.'));
          if (lastLevelFieldName) {
            acc[lastLevelFieldName] = value;
          }
          return acc;
        }, {});
        if (missingValueField) {
          return;
        }
        logger.debug('execute calculation formula on form field', 'todo');
        try {
          const value = resolve(ast, values);
          actions.setFieldState(
            getFieldPath(targetField, state.path || ''),
            (state) => state.value = value,
          );
        } catch (err) {
          logger.error('failed to calculate value from formula', err);
        }
      });
    });
  });
}
