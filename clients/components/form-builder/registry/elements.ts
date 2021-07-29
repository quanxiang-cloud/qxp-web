import Input from './input';
import Textarea from './textarea';
import RadioGroup from './radio-group';
import CheckboxGroup from './checkbox-group';
import NumberPicker from './number-picker';
import DatePicker from './date-picker';
import Select from './select';
import MultipleSelect from './multiple-select';
import CascadeSelector from './cascade-selector';
import SubTable from './sub-table';
import AssociatedRecords from './associated-records';
import UserPicker from './user-picker';
import OrganizationPicker from './organization-select';
import FileUpload from './file-upload';
import ImageUpload from './image-upload';
import AggregationRecords from './aggregation-records';

const availableElements = [
  Input,
  Textarea,
  RadioGroup,
  CheckboxGroup,
  NumberPicker,
  DatePicker,
  Select,
  MultipleSelect,
  SubTable,
  AssociatedRecords,
  UserPicker,
  OrganizationPicker,
  FileUpload,
  ImageUpload,
  CascadeSelector,
  AggregationRecords,
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
