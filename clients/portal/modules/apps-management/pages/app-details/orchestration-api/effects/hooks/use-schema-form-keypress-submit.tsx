import { equals } from 'ramda';
import { useEffect, useCallback, useMemo, useRef } from 'react';
import { debounceTime } from 'rxjs/operators';
import { usePrevious } from 'react-use';
import { FormEffectHooks } from '@formily/react-schema-renderer';

import { getFieldActiveMap, getSchemaKeys, noFieldFocused } from '@orchestrationAPI/utils';

export type FieldActiveMap = Record<string, boolean>;

const { onFieldChange$ } = FormEffectHooks;

export default function useSchemaformKeypressSubmit(
  schema: ISchema | undefined,
  whiteList: string[],
  handleSubmit: () => void,
  enabled: boolean,
): (() => void) | undefined {
  const fieldActiveMapInitialValue = useMemo(() => getFieldActiveMap(getSchemaKeys(schema)), [schema]);
  const fieldActiveMap = useRef<FieldActiveMap>(fieldActiveMapInitialValue);

  const previsousSchema = usePrevious(schema);
  useEffect(() => {
    if (!enabled) {
      return;
    }
    const schemaChanged = previsousSchema && !equals(previsousSchema, schema);
    if (!schemaChanged) {
      return;
    }
    fieldActiveMap.current = getFieldActiveMap(getSchemaKeys(schema));
  }, [enabled, schema, previsousSchema]);

  const effects = useCallback(() => {
    const sub = onFieldChange$('*')
      .pipe(debounceTime(200))
      .subscribe((state) => {
        if (!state.name) {
          return;
        }
        fieldActiveMap.current[state.name] = !!state.active;
      });
    return () => sub.unsubscribe();
  }, []);

  const onKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.key !== 'Enter') {
      return;
    }
    noFieldFocused(fieldActiveMap.current, whiteList) && handleSubmit();
  }, [handleSubmit, fieldActiveMap.current, whiteList]);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    document.body.addEventListener('keypress', onKeyPress);
    return () => document.body.removeEventListener('keypress', onKeyPress);
  }, [enabled, onKeyPress]);

  return enabled ? effects : undefined;
}
