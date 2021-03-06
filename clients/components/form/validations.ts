export interface Validation {
  rule: RegExp,
  formatter: (validateMessage?: string, field?: string) => string,
}

const validations: Record<string, Validation> = {
  required: {
    rule: /\S/,
    formatter(validateMessage?: string, field?: string) {
      return validateMessage || `${field} is required.`;
    },
  },
  numeric: {
    rule: /^\d+$/,
    formatter(validateMessage?: string, field?: string) {
      return validateMessage || `${field} should contain only numbers.`;
    },
  },
};

export default validations;
