import { useEffect, useRef, useCallback } from 'react';
import { debounceTime } from 'rxjs/operators';
import type { Subscription } from 'rxjs';
import {
  FormEffectHooks,
} from '@formily/react-schema-renderer';
import { useKeyPress, useMap } from 'react-use';
import { keys, values, path, omit } from 'ramda';

import { not } from '@lib/utils';

type FieldActiveMap = Record<string, boolean>;

const { onFieldChange$ } = FormEffectHooks;

export default function useSchemaformKeypressSubmit(
  schema: ISchema | undefined,
  whiteList: string[],
  handleSubmit: () => void,
  enabled: boolean,
): (() => void) | undefined {
  const [enterPressed] = useKeyPress('Enter');
  const formEffectRef = useRef<Subscription>();
  const [fieldActiveMap, fieldActiveMapActions] = useMap<FieldActiveMap>(
    getFieldActiveMap(getSchemaKeys(schema)),
  );

  useEffect(() => {
    enabled && enterPressed && noFieldFocused(fieldActiveMap) && handleSubmit();
  }, [enterPressed, fieldActiveMap]);

  useEffect(() => {
    fieldActiveMapActions.setAll(getFieldActiveMap(getSchemaKeys(schema)));
  }, [schema]);

  useEffect(() => formEffectRef.current?.unsubscribe(), []);

  function getSchemaKeys(schema?: ISchema): string[] {
    const properties = path(['properties', 'Fields', 'properties'], schema) || {};
    return keys(properties);
  }

  function getFieldActiveMap(schemaKeys: string[]): FieldActiveMap {
    return schemaKeys.reduce((map: FieldActiveMap, key) => {
      map[key] = false;
      return map;
    }, {});
  }

  function noFieldFocused(fieldActiveMap: FieldActiveMap): boolean {
    return values(omit(whiteList, fieldActiveMap)).every(not(Boolean));
  }

  const effects = useCallback(() => {
    formEffectRef.current = onFieldChange$('*')
      .pipe(
        debounceTime(100),
      )
      .subscribe((state) => {
        fieldActiveMapActions.set(state.name || '', !!state.active);
      });
  }, []);

  return effects;
}
