import FormBuilder from './form-builder';
import FormRenderer from './FormRenderer';
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
  FormRenderer,
  registry,
  useFormPreview,
  useLinkageSetting,
  useDataSetting,
};
