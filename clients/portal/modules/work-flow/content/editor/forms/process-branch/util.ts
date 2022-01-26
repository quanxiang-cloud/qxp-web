import { SYSTEM_FIELDS } from '@c/form-builder/constants';
import type { CustomRule } from '@c/formula-editor';

export function variableToRule({ name, code, fieldType }: ProcessVariable): CustomRule {
  return {
    name,
    key: '$' + code,
    type: fieldType?.toLowerCase(),
  };
}

export function tableSchemaFilter(schema: SchemaFieldItem): boolean {
  return !SYSTEM_FIELDS.includes(schema.fieldName);
}

export function tableSchemaToRule(schema: SchemaFieldItem): CustomRule {
  return {
    name: schema.title as string,
    key: '$' + schema.id,
    type: schema.type ?? '',
  };
}
