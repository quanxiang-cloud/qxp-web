import { createFormActions, FormEffectHooks } from '@formily/antd';
import moment from 'moment';
import { PrefixType } from './convertor';

type PreviewProps = {
  prefix: PrefixType,
  initialPosition: number,
  initialValue: number,
  suffix: string,
}

const { onFieldValueChange$ } = FormEffectHooks;

const addZeroFromValue = (position: number, value:number): string => {
  return (Array(position).join('0') + value?.toString()).slice(-position);
};

const getPreview = ({ prefix, initialPosition, initialValue, suffix }: PreviewProps): string => {
  return prefix.frontward + (prefix.backward === '' ? '' : moment().format(prefix.backward)) +
    addZeroFromValue(initialPosition, initialValue) + suffix;
};

export default function effects(): void {
  const { setFieldState, getFieldValue } = createFormActions();

  onFieldValueChange$('*(prefix, initialPosition, initialValue, suffix)').subscribe(() => {
    setFieldState('numberPreview', (state) => {
      const prefix = getFieldValue('prefix');
      const suffix = getFieldValue('suffix');
      const initialPosition = getFieldValue('initialPosition');
      const initialValue = getFieldValue('initialValue');
      state.value = getPreview({ prefix, initialPosition, initialValue, suffix });
    });
  });
}
