import FormBuilder from './form-builder';
import registry from './registry';
import { useFormPreview, useLinkageSetting, useDataSetting } from './hooks';

import './index.scss';

// const actions: ISchemaFormActions = {
//   getSchema(): Schema;
//   getFormSchema(): Schema;
// };

export default FormBuilder;

export {
  FormBuilder,
  registry,
  useFormPreview,
  useLinkageSetting,
  useDataSetting,
};
