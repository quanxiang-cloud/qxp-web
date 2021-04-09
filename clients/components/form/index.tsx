import React, {
  PropsWithChildren,
  useState,
  createContext,
  ChangeEvent,
  DetailedHTMLProps,
  InputHTMLAttributes,
  forwardRef,
  useEffect,
  FormHTMLAttributes,
  TextareaHTMLAttributes,
  ForwardedRef,
} from 'react';

import validations, { Validation } from './validations';

export type Props = PropsWithChildren<DetailedHTMLProps<
  FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>>
export type Value = string | number | readonly string[] | undefined;

type Field = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> &
 DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> & {
  validateMessage?: string;
  rules?: (string | ((value: Value) => string))[];
};
type Fields = Record<string, Field>;
type Errors = Record<string, string>;

interface Context {
  fields: Fields;
  errors: Errors;
  setField(event: ChangeEvent, field: Field): void;
  addField(filed: Field): void;
  validateField(id: string): void;
}

export const FormContext = createContext<Context>({
  fields: {},
  errors: {},
  setField() {},
  addField() {},
  validateField() {},
});

function Form(
  { children, ...restProps }: Props,
  ref?: ForwardedRef<{ validateFields: () => boolean; }>
) {
  const [formState, setFormState] = useState<{ fields: Fields, errors: Errors }>({
    fields: {},
    errors: {},
  });

  useEffect(() => {
    if (typeof ref === 'object' && ref) {
      ref.current = {
        validateFields,
      };
    }
  }, [validateFields]);

  function setField(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    field: Field
  ) {
    event.persist();
    if (!field.id) {
      throw new Error('missing field id');
    }
    const oldField = formState.fields[field.id];
    if (oldField) {
      setFormState((state) => ({
        ...state,
        fields: {
          [field.id as string]: {
            ...oldField,
            ...field,
            value: event.target.value,
          },
        },
      }));
    } else {
      addField(field);
    }
  }

  function addField(field: Field) {
    const { id } = field;
    if (id) {
      setFormState((state) => ({ ...state, fields: { ...state.fields, [id]: field } }));
      return;
    }
    throw new Error('missing id field');
  }

  function validateFields(): boolean {
    return Object.keys(formState.fields).every((id) => {
      return validateField(id);
    });
  }

  function validateField(id: string): boolean {
    let error = '';
    const field = formState.fields[id];
    if (!field) {
      throw new Error('field not found');
    }
    const { value, validateMessage, rules = [] } = field;
    if (!rules.length) {
      return !error;
    }
    rules.forEach((rule) => {
      let validator: Validation | ((value: Value) => string);
      if (typeof rule === 'string') {
        validator = validations[rule];
      } else {
        validator = rule;
      }
      function validate(value: Value): boolean {
        if (!value) {
          return false;
        }
        if (typeof validator === 'function') {
          error = validator(value);
          return !error;
        }
        return validator.rule.test(value.toString());
      }
      const isRuleSatisfied = !rules.includes('required') && !value ? true : validate(value);
      if (!isRuleSatisfied && typeof validator !== 'function') {
        error = validator.formatter(validateMessage);
      }
    });
    setFormState((state) => ({
      ...state,
      errors: {
        ...state.errors,
        [id]: error,
      },
    }));
    return !error;
  }

  return (
    <form {...restProps}>
      <FormContext.Provider value={{ ...formState, setField, addField, validateField }}>
        {children}
      </FormContext.Provider>
    </form>
  );
}

export default forwardRef(Form);
