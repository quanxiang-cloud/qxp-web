export interface Validation {
  rule: RegExp,
  formatter: (validateMessage?: string) => string,
}

const validations: Record<string, Validation> = {
  required: {
    rule: /\S/,
    formatter(validateMessage?: string) {
      return validateMessage || 'field is required.';
    },
  },
  numeric: {
    rule: /^\d+$/,
    formatter(validateMessage?: string) {
      return validateMessage || 'field should contain only numbers.';
    },
  },
};

export default validations;
