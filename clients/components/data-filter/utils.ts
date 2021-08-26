import moment, { unitOfTime, Moment } from 'moment';
import { get } from 'lodash';

import logger from '@lib/logger';

export const OPERATORS_STRING = [
  {
    label: '等于',
    value: 'eq',
  },
  {
    label: '模糊',
    value: 'like',
  },
];

export const OPERATORS_NUMBER = [
  {
    label: '等于',
    value: 'eq',
  },
  {
    label: '大于',
    value: 'gt',
  },
  {
    label: '小于',
    value: 'lt',
  },
  {
    label: '大于等于',
    value: 'gte',
  },
  {
    label: '小于等于',
    value: 'lte',
  },
  {
    label: '不等于',
    value: 'ne',
  },
];

export const OPERATORS_DATE = [
  {
    label: '范围',
    value: 'range',
  },
];

export const OPERATORS_BOOL = [
  {
    label: '等于',
    value: 'eq',
  },
  {
    label: '不等于',
    value: 'ne',
  },
];

export const OPERATORS_ARRAY_MULTIPLE = [
  {
    label: '同时包含',
    value: 'fullSubset',
  },
  {
    label: '包含任一一个',
    value: 'intersection',
  },
];

export const OPERATORS_LABEL_VALUE = [
  {
    label: '等于',
    value: 'eq',
  },
  {
    label: '不等于',
    value: 'ne',
  },
];

export const CONDITION = [
  {
    label: '所有',
    value: 'must',
  },
  {
    label: '任一',
    value: 'should',
  },
];

export const VALUE_FROM = [
  {
    label: '固定值',
    value: 'fixedValue',
  },
  {
    label: '表单值',
    value: 'form',
  },
];

export function getOperators(type: string, enums: any[] | undefined): LabelValue[] {
  switch (type) {
  case 'array':
    return OPERATORS_ARRAY_MULTIPLE;
  case 'number':
    return OPERATORS_NUMBER;
  case 'datetime':
    return OPERATORS_DATE;
  case 'boolean':
    return OPERATORS_BOOL;
  case 'label-value':
    return OPERATORS_LABEL_VALUE;
  default:
    if (enums && enums.length) {
      return OPERATORS_ARRAY_MULTIPLE;
    }

    return OPERATORS_STRING;
  }
}

export const FILTER_FIELD = [
  'DatePicker',
  'Input',
  'MultipleSelect',
  'NumberPicker',
  'RadioGroup',
  'Textarea',
  'Select',
  'CheckboxGroup',
  'UserPicker',
  'CascadeSelector',
  'OrganizationPicker',
  'Serial',
];

function getDateType(format: string): unitOfTime.StartOf {
  switch (format) {
  case 'YYYY':
    return 'year';
  case 'YYYY-MM':
    return 'month';
  case 'YYYY-MM-DD':
    return 'day';
  case 'YYYY-MM-DD HH:mm':
    return 'minute';
  case 'YYYY-MM-DD HH:mm:ss':
    return 'second';
  default:
    return 'day';
  }
}

type ComponentValue = number | string | Moment | LabelValue | Date;

export function getCondition(schema: ISchema, value: FormValue, key: string, op?: string): Condition {
  const _condition: Condition = { key };
  switch (schema['x-component']) {
  case 'DatePicker': {
    const [start, end] = value as Moment[];
    const format = schema?.['x-component-props']?.format || 'YYYY-MM-DD';
    _condition.value = [
      start.startOf(getDateType(format)).toISOString(),
      end.endOf(getDateType(format)).toISOString(),
    ];
    _condition.op = op || 'range';
    break;
  }
  case 'NumberPicker':
    _condition.value = Number(value);
    _condition.op = op || 'eq';
    break;
  case 'MultipleSelect':
  case 'RadioGroup':
  case 'CheckboxGroup':
  case 'UserPicker':
  case 'OrganizationPicker':
  case 'Select':
    _condition.value = value;
    _condition.op = op || 'intersection';
    break;
  case 'CascadeSelector':
    _condition.value = value;
    _condition.op = op || 'eq';
    break;
  default:
    if (Array.isArray(value)) {
      _condition.value = value;
      _condition.op = op || 'intersection';
    } else {
      _condition.value = value;
      _condition.op = op || 'like';
    }
    break;
  }

  return _condition;
}

type ValueFromProps = {
  schema: ISchema;
  key: string;
  valueFrom: ValueFrom;
  op: string;
  value: FormValue
}

export function setValueFormCondition({ valueFrom, key, op, value, schema }: ValueFromProps): Condition {
  if (valueFrom === 'form') {
    return {
      key,
      op,
      value: [value as string],
      valueFrom,
    };
  }

  return {
    ...getCondition(
      schema,
      value,
      key,
      op,
    ),
    valueFrom,
  };
}

export function getValue(
  field: SchemaFieldItem,
  initValue: FormValue | undefined,
  valueFrom: ValueFrom | undefined,
): FormValue {
  if (!initValue || (Array.isArray(initValue) && initValue.length === 0)) {
    return '';
  }

  if (valueFrom === 'form') {
    return initValue.toString();
  }

  switch (field['x-component']) {
  case 'DatePicker':
    return Array.isArray(initValue) ? initValue.map((value) => moment(value as string)) : moment(initValue);
  case 'MultipleSelect':
  case 'RadioGroup':
  case 'CheckboxGroup':
  case 'UserPicker':
  case 'Select':
    return initValue;
  default:
    return initValue;
  }
}

export type ESParameter = {
  bool: {
    [key in FilterTag]?: Rule[]
  }
}

type Rule = {
  [key: string]: any;
}

const OP_ES_LIST = [
  {
    op: 'eq',
    esExpression: '^{"term":{"([_a-zA-Z0-9.]+)":(.*?)}}$',
    valuePath: 'term&${key}',
  },
  {
    op: 'range',
    esExpression: '{"range":{"([_a-zA-Z0-9.]+)":{"(gt|lt|gte|lte)":(.*?),"(gt|lt|gte|lte)":(.*?)}}}',
    valuePath: 'range&${key}',
  },
  {
    op: 'gt|lt|gte|lte',
    esExpression: '{"range":{"([_a-zA-Z0-9.]+)":{"(gt|lt|gte|lte)":([".-a-zA-Z0-9]+)}}}',
    opIndex: 2,
    valuePath: 'range&${key}&${op}',
  },
  {
    op: 'intersection',
    esExpression: '{"terms":{"([_a-zA-Z0-9.]+)":(.*?)}}',
    valuePath: 'terms&${key}',
  },
  {
    op: 'ne',
    esExpression: '{"bool":{"must_not":\\[{"term":{"([_a-zA-Z0-9.]+)":(.*?)}}\\]}}',
    valuePath: 'bool&must_not[0]&term&${key}',
  },
  {
    op: 'like',
    esExpression: '{"match":{"([_a-zA-Z0-9.]+)":(.*?)}}',
    valuePath: 'match&${key}',
  },
  {
    op: 'fullSubset',
    esExpression: '^{"bool":{"must":(\\[{"term":{"[_a-zA-Z0-9.]+":.*?}}\\])+}}$',
    valuePath: 'bool&must',
  },
];

// TODO 暂时兼容方法
export function toEs(filterConfig: FilterConfig): ESParameter {
  const rule: Rule[] = [];
  filterConfig.condition.forEach(({ key = '', value, op }) => {
    let _value = value;
    let _key = key;
    if (typeof value === 'object' && op !== 'range') {
      if (Array.isArray(_value) && typeof _value[0] === 'object') {
        _value = _value.map((_value) => (_value as LabelValue).value);
        _key = `${key}.value`;
      } else if (!Array.isArray(_value)) {
        _value = (_value as LabelValue).value;
        _key = `${key}.value`;
      }
    }

    switch (op) {
    case 'range': {
      const [start, end] = _value as ComponentValue[];
      rule.push({
        range: {
          [_key]: {
            gte: start,
            lt: end,
          },
        },
      });
      break;
    }
    case 'eq':
      rule.push({
        term: {
          [_key]: _value,
        },
      });
      break;
    case 'gt':
    case 'lt':
    case 'gte':
    case 'lte':
      if (typeof _value !== 'number' && typeof _value !== 'string') {
        logger.error('Data type error');
        return;
      }
      rule.push({
        range: {
          [_key]: { [op]: _value },
        },
      });
      break;
    case 'fullSubset':
      rule.push({
        bool: {
          must: (_value as any[]).map((valueItem) => {
            return {
              term: {
                [_key]: valueItem,
              },
            };
          }),
        },
      });
      break;
    case 'intersection':
      rule.push({
        terms: {
          [_key]: _value,
        },
      });
      break;
    case 'ne':
      rule.push({
        bool: {
          must_not: [
            {
              term: {
                [_key]: _value,
              },
            },
          ],
        },
      });
      break;
    case 'like':
      rule.push({
        match: {
          [_key]: _value,
        },
      });
      break;
    default:
      return {
        match: {
          [_key]: _value,
        },
      };
    }
  });

  return {
    bool: {
      [filterConfig.tag]: rule,
    },
  };
}

export function toFilterConfig(esObj: ESParameter): FilterConfig {
  let tag: FilterTag = 'must';
  const condition: Condition[] = [];
  const tags = Object.keys(esObj.bool) as FilterTag[];
  if (tags.length) {
    tag = tags[0];
    esObj.bool[tag]?.map((rule: Rule) => {
      OP_ES_LIST.forEach(({ esExpression, op, opIndex, valuePath }) => {
        const match = JSON.stringify(rule).match(new RegExp(esExpression));
        if (match) {
          let key = '';
          const operator = opIndex && match[opIndex] ? match[opIndex] : op;
          let value;
          if (op === 'fullSubset') {
            const esValues: Rule[] = get(rule, valuePath.split('&'));
            value = esValues.map(({ term }) => {
              key = Object.keys(term).shift() || '';
              return term[key];
            });
          } else {
            key = match[1];
            value = get(rule, valuePath.replace('${key}', key).replace('${op}', operator).split('&'));
          }

          if (key.includes('.value')) {
            key = key.split('.value').shift() || '';
            value = Array.isArray(value) ? value.map((_value) => ({
              value: _value,
              label: '',
            })) : {
              label: '',
              value,
            };
          }

          condition.push(
            {
              key,
              value: operator === 'range' ? [value.gte, value.lt] : value,
              op: operator,
            },
          );
        }
      });
    }) || [];
  }

  return {
    tag,
    condition,
  };
}
