import React from 'react';
import { DeclarationPlain } from 'css-tree';

declare global {
  type ComponentConfigType = {
    title: string,
    type: string,
    classnames: string,
    property?: string,
  }

  type ComponentObjectType = {
    config_schema: ComponentConfigType[];
    Component: React.FC;
    key: string;
  }

  type StyleFieldBaseProps = {
    value?: DeclarationPlain;
    property?: string;
    onChange: (v: DeclarationPlain) => void;
  }
}

