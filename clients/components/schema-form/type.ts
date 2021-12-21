import {
  RegisterOptions, UseFormSetError, UseFormClearErrors, FieldValues,
} from 'react-hook-form';

declare module 'react' {
  function forwardRef<T, P = Record<string, unknown>>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

export interface Field {
  name: string;
  title?: string;
  watch?: boolean;
  native?: {
    type: string;
    options?: RegisterOptions;
  },
  component?: (...args: any[]) => JSX.Element | null;
  validate?: (watchValues: Record<string, any>, errorMethods: ErrorMethods) => void,
  hide?: (watchValues: Record<string, any>) => boolean,
  id?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  className?: string;
  defaultValue?: any;
}

export interface SchemaFormSchema {
  fields: Field[];
}

export type OnSubmit<T> = (value: T) => void;

export type ErrorMethods = {
  errors: Record<string, any>;
  setError: UseFormSetError<FieldValues>;
  clearErrors: UseFormClearErrors<FieldValues>;
}
