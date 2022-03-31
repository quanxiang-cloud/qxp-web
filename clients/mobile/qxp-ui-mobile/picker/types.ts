export type OptionLabel = React.ReactNode;

export type PickerOption<T> = {
  value: T;
  label: OptionLabel;
  disabled?: boolean;
}

interface BasePickerProps<T> {
  id?: string;
  name?: string;
  className?: string;
  disabled?: boolean;
  options: PickerOption<T>[];
  title: string;
  placeholder?: string | JSX.Element;
}

interface SinglePickerProps<T> extends BasePickerProps<T> {
  multiple?: false;
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
}

interface MultiplePickerProps<T = React.Key> extends BasePickerProps<T> {
  multiple: true;
  value?: T[];
  defaultValue?: T[];
  onChange?: (value: T[]) => void;
}

export type PickerProps<T> = SinglePickerProps<T> | MultiplePickerProps<T>;
