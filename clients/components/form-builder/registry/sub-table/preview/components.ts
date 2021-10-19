import { Input, NumberPicker } from '@formily/antd-components';

import OrganizationPicker from '@c/form-builder/registry/organization-select/organization-select-wrap';
import FileUpload from '@c/form-builder/registry/file-upload/uploader';
import ImageUpload from '@c/form-builder/registry/image-upload/uploader';
import UserPicker from '@c/form-builder/registry/user-picker/user-picker-wrap';
import CascadeSelector from '@c/form-builder/registry/cascade-selector/cascade-selector-wrap';
import AssociatedData from '@c/form-builder/registry/associated-data/associated-data';
import RadioGroup from '@c/form-builder/registry/radio-group/radioGroup';
import CheckBoxGroup from '@c/form-builder/registry/checkbox-group/checkboxGroup';
import DatePicker from '@c/form-builder/registry/date-picker/date-picker';
import Select from '@c/form-builder/registry/select/custom-select';
import MultipleSelect from '@c/form-builder/registry/multiple-select/multiple-select';
import Serial from '@c/form-builder/registry/serial-number/serial';

export const components = {
  input: Input,
  radiogroup: RadioGroup,
  checkboxgroup: CheckBoxGroup,
  textarea: Input.TextArea,
  datepicker: DatePicker,
  numberpicker: NumberPicker,
  select: Select,
  multipleselect: MultipleSelect,
  userpicker: UserPicker,
  organizationpicker: OrganizationPicker,
  fileupload: FileUpload,
  imageupload: ImageUpload,
  cascadeselector: CascadeSelector,
  associateddata: AssociatedData,
  serial: Serial,
};
