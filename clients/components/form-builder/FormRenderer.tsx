import React from 'react';
import { ISchemaFormActions, SchemaForm } from '@formily/antd';
import omit from 'lodash/omit';
// import converter from './converter';

type FromRendererProps = {
  formSchema: Record<string, unknown>;
  actions?: ISchemaFormActions;
  initialValues?: Record<string, unknown>;
  className?: string;
  registry?: any;
  setDefault?: boolean;
}

/**
 * render from
 * @param formSchema { schema: [], formAttrs: {}, linkages: {}, formContext: {} }
 * @param actions
 * @param initialValues
 * @param className
 * @param setDefault
 * @param registry
 * @returns {*}
 * @constructor
 */
function FormRenderer(
  { formSchema, actions, initialValues, className, registry }: FromRendererProps,
) {
  const { formAttrs, formContext } = formSchema;
  const schema = {
    type: 'object',
    // properties: converter(formSchema, setDefault, formAttrs as any),
  };

  return (
    <SchemaForm
      schema={schema}
      actions={actions}
      expressionScope={formContext as { [key: string]: any; } | undefined}
      initialValues={initialValues}
      className={className}
      components={registry.components}
      {...omit(formAttrs as any, ['helpInLabel'])}
    />
  );
}

export default FormRenderer;
