import { cloneDeep, isArray, each } from 'lodash';
import { lensPath, over } from 'ramda';
import { ValidateDescription } from '@formily/antd';

import createNamespaceSchema from './create-namespace';

const editNamespaceSchema = cloneDeep(createNamespaceSchema);

export default over(
  lensPath(['properties', 'Fields', 'properties']),
  (schema: { title: ISchema, name: ISchema, desc: ISchema }) => {
    const { title, name, desc } = schema;
    const schemaToProcess = [title, name, desc];
    each(schemaToProcess, (schema: ISchema, index) => {
      schema.title = (schema.title as string).replace('分组', 'API');
      if (index === 0) {
        Object.assign(schema, {
          'x-component': 'Input',
          'x-component-props': {
            placeholder: '请输入，例如：查询数据',
          },
        });
      }
      const rules = schema['x-rules'];
      if (rules && isArray(rules)) {
        schema['x-rules'] = rules.map((_rule) => {
          const rule = _rule as ValidateDescription;
          if (rule.message) {
            rule.message = rule.message.replace('分组', 'API');
          }
          return rule;
        });
      }
    });
    return Object.assign(schema, {
      method: {
        type: 'string',
        title: '请求方法',
        default: 'POST',
        enum: [{
          required: true,
          message: '请选择请求方法',
        }],
        'x-component': 'Select',
        'x-index': 3,
        display: false,
      },
      // templateAPIPath: {
      //   type: 'string',
      //   'x-component': 'CopyPolySelect',
      //   'x-index': 4,
      // },
    });
  },
  editNamespaceSchema,
);
