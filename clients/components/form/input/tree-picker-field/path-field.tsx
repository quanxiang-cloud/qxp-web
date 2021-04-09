import React, { MouseEventHandler } from 'react';
import { Field, Control, Form } from '@QCFE/lego-ui';

interface Props {
  name: string;
  path: string;
  value: string;
  required?: boolean;
  help?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  appendix?: JSX.Element | null;
}

export default function PathField({ name, path, required, help, value, appendix, onClick }: Props) {
  const schemas = [];
  if (required) {
    schemas.push({
      help: help,
      status: 'error',
      rule: { required: true },
    });
  }

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick && onClick(e);
      }}
      className="w-full cursor-pointer"
      title={path}
    >
      <Field className="flex flex-col">
        <Control className="w-full self-stretch relative">
          <div title={path}>
            <Form.TextAreaField
              name={`${name}Value`}
              className="text-area-input flex flex-col"
              value={path}
              schemas={schemas}
            />
          </div>
          <Form.TextField name={name} value={value} className="hidden h-0" />
          {appendix && (<>{appendix}</>)}
        </Control>
      </Field>
    </div>
  );
}
