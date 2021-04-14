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
elements[Input.type] = { ...Input, displayOrder: 1 };
elements[Textarea.type] = { ...Textarea, displayOrder: 2 };
elements[RadioGroup.type] = { ...RadioGroup, displayOrder: 3 };
elements[CheckboxGroup.type] = { ...CheckboxGroup, displayOrder: 4 };
elements[NumberPicker.type] = { ...NumberPicker, displayOrder: 5 };
elements[DatePicker.type] = { ...DatePicker, displayOrder: 6 };
elements[Select.type] = { ...Select, displayOrder: 7 };
elements.MultipleSelect = { ...MultipleSelect, displayOrder: 8 };

export default elements;
