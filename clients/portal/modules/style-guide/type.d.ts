import React from 'react';
import { DeclarationPlain } from 'css-tree';

declare global {
  type ComponentConfigType = {
    selector: string;
    desc?: string;
    pseudo?: ComponentConfigType[];
    children?: ComponentConfigType[];
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

