import React from 'react';

interface Props {
  fieldName: string;
  title: string;
  onAddField: (value: { key: string, name: string }) => void;
}

export default function fieldItem({ fieldName, title, onAddField }: Props): JSX.Element {
  return (
    <span
      key={fieldName}
      onClick={() => onAddField({ key: fieldName, name: title })}
      className="inline-block mb-8 p-2 bg-gray-100 mr-4 border border-gray-300 cursor-pointer"
    >
      {title}
    </span>

  );
}
