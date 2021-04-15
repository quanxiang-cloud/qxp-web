import Input from './input';
import Textarea from './textarea';
import RadioGroup from './radio-group';
import CheckboxGroup from './checkbox-group';
import NumberPicker from './number-picker';
import DatePicker from './date-picker';
import Select from './select';
import MultipleSelect from './multiple-select';

export type Elements = { [key: string]: SourceElement<any> };

const elements: Elements = {};
// basic form fields
elements[Input.componentName] = { ...Input, displayOrder: 1 };
elements[Textarea.componentName] = { ...Textarea, displayOrder: 2 };
elements[RadioGroup.componentName] = { ...RadioGroup, displayOrder: 3 };
elements[CheckboxGroup.componentName] = { ...CheckboxGroup, displayOrder: 4 };
elements[NumberPicker.componentName] = { ...NumberPicker, displayOrder: 5 };
elements[DatePicker.componentName] = { ...DatePicker, displayOrder: 6 };
elements[Select.componentName] = { ...Select, displayOrder: 7 };
elements.MultipleSelect = { ...MultipleSelect, displayOrder: 8 };

export default elements;
