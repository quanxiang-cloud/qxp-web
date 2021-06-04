import Input from './input';
import Textarea from './textarea';
import RadioGroup from './radio-group';
import CheckboxGroup from './checkbox-group';
import NumberPicker from './number-picker';
import DatePicker from './date-picker';
import Select from './select';
import MultipleSelect from './multiple-select';
import CascadeSelector from './cascade-selector';
import UserPicker from './user-picker';
import OrganizationPicker from './organization-select'

const availableElements = [
  Input,
  Textarea,
  RadioGroup,
  CheckboxGroup,
  NumberPicker,
  DatePicker,
  Select,
  MultipleSelect,
  CascadeSelector,
  UserPicker,
  OrganizationPicker
];

export type Elements = { [key: string]: FormBuilder.SourceElement<any> };

const elements = availableElements.reduce<Elements>((acc, element, index) => {
  acc[element.componentName.toLowerCase()] = {
    ...element,
    displayOrder: index,
  };

  return acc;
}, {});

export default elements;
