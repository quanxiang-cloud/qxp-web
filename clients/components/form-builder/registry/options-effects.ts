import { filter, tap, skip } from 'rxjs/operators';
import { FormEffectHooks, ISchemaFormActions } from '@formily/antd';

import { parseJSON } from '@lib/utils';
import { getOptionSetById } from '@portal/modules/option-set/api';

const { onFieldValueChange$, onFieldInputChange$ } = FormEffectHooks;

export function updateDefaultValueOnDatasetIdChanged(actions: ISchemaFormActions): void {
  const { setFieldState, setFieldValue } = actions;
  onFieldValueChange$('datasetId').pipe(
    filter(({ value }) => !!value),
    tap(({ value }) => {
      getOptionSetById(value).then(({ content = '' }) => {
        const labels = parseJSON<LabelValue[]>(content, []).map(({ label }) => label);
        setFieldState('defaultValue', (state) => {
          if (!labels.length) {
            state.value = undefined;
          }
          state.props.enum = labels;
        });
      });
    }),
    skip(1),
  ).subscribe(() => {
    setFieldValue('defaultValue', undefined);
  });
}

export function initDefaultValueOnOptionsFromDataset(actions: ISchemaFormActions): void {
  const { setFieldValue } = actions;
  onFieldInputChange$('defaultValueFrom').subscribe(({ value }) => {
    if (value === 'dataset') {
      setFieldValue('defaultValue', undefined);
    }
  });
}

export function updateLabelsOnSimpleEdit(actions: ISchemaFormActions): void {
  const { getFieldValue, setFieldValue } = actions;
  onFieldValueChange$('edit').pipe(
    filter(({ value }) => !!value),
  ).subscribe(({ value }) => {
    const availableOptions = getFieldValue('availableOptions');
    setFieldValue('availableOptions', value.map((op: any, index: number) => {
      if (index >= availableOptions.length) {
        return { label: op, isDefault: false };
      }

      return { label: op, isDefault: availableOptions[index].isDefault };
    }));
  });
}

export function updateLabelsOnMultipleEdit(actions: ISchemaFormActions): void {
  const { setFieldValue, getFieldValue } = actions;
  onFieldValueChange$('edit').pipe(
    filter(({ value }) => !!value),
  ).subscribe(({ value }) => {
    const availableOptions = getFieldValue('availableOptions');
    setFieldValue('availableOptions', value?.map((op: string, index: number) => {
      if (index >= availableOptions.length) {
        return { label: op, isDefault: false };
      }

      return { label: op, isDefault: availableOptions[index].isDefault };
    }));
  });
}
