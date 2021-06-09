import { noop } from 'lodash';
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
  isValidElement,
} from 'react';

import validations, { Validation } from './validations';

export type Props = PropsWithChildren<DetailedHTMLProps<
  FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>> & {
    layout?: 'vertical' | 'horizontal';
  }
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
  setField: noop,
  addField: noop,
  validateField: noop,
});

export interface FormRef {
  validateFields: () => Promise<boolean>;
  isAllValid: () => Promise<boolean>;
}

function Form(
  { children, layout = 'vertical', ...restProps }: Props,
  ref?: ForwardedRef<FormRef>,
) {
  const [formState, setFormState] = useState<{ fields: Fields, errors: Errors }>({
    fields: {},
    errors: {},
  });

  useEffect(() => {
    if (typeof ref === 'object' && ref) {
      ref.current = {
        validateFields,
        isAllValid,
      };
    }
  }, [validateFields, isAllValid]);

  function setField(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    field: Field,
  ) {
    event && event.persist();
    if (!field.id) {
      return;
    }
    const oldField = formState.fields[field.id];
    if (oldField) {
      setFormState((state) => ({
        ...state,
        fields: {
          ...state.fields,
          [field.id as string]: {
            ...oldField,
            ...field,
            value: event?.target.value,
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
      setFormState((state) => {
        const oldField = state.fields[id] || {};
        return { ...state, fields: { ...state.fields, [id]: { ...oldField, ...field } } };
      });
      return;
    }
  }

  function validateFields(ignoreErrorMessage?: boolean): Promise<boolean> {
    return new Promise((resolve) => {
      setFormState((state) => {
        const isAllValid = Object.keys(state.fields)
          .map((id) => {
            return validateField(id, ignoreErrorMessage, state);
          })
          .every((result) => result);
        resolve(isAllValid);
        return state;
      });
    });
  }

  function isAllValid(): Promise<boolean> {
    return validateFields(true);
  }

  function validateField(id: string, ignoreErrorMessage?: boolean, state?: {
    fields: Fields;
    errors: Errors;
  }): boolean {
    let error = '';
    const field = state ? state.fields[id] : formState.fields[id];
    if (!field) {
      return false;
    }
    const { value, validateMessage, rules = [] } = field;
    if (!rules.length) {
      return !error;
    }
    for (let index = 0; index < rules.length; index += 1) {
      const rule = rules[index];
      let validator: Validation | ((value: Value) => string);
      if (typeof rule === 'string') {
        validator = validations[rule];
      } else {
        validator = rule;
      }

      let isRuleSatisfied = false;
      if (typeof validator === 'function') {
        error = validator(value);
        isRuleSatisfied = !error;
      } else if (typeof value === 'undefined') {
        isRuleSatisfied = false;
      } else {
        isRuleSatisfied = validator.rule.test(value.toString());
      }
      if (!isRuleSatisfied && typeof validator !== 'function') {
        error = validator.formatter(validateMessage, field.name);
      }
      if (error) {
        break;
      }
    }
    !ignoreErrorMessage && setFormState((state) => ({
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
        {
          React.Children.map(children, (child) => {
            if (isValidElement(child)) {
              return React.cloneElement(child, { layout });
            }
            return child;
          })
        }
      </FormContext.Provider>
    </form>
  );
}

export default forwardRef(Form);
