import React from 'react';
import { DeclarationPlain } from 'css-tree';

declare global {
  type ComponentStyleConfigSchema = {
    selector: string;
    desc?: string;
    pseudo?: ComponentStyleConfigSchema[];
    children?: ComponentStyleConfigSchema[];
  }

  type ComponentStyleStatus = {
    key: string;
    property?: string;
    value?: unknown;
    configSchema: ComponentStyleConfigSchema[];
  }

  type ComponentObjectType = {
    configSchema: ComponentStyleConfigSchema[];
    Component: React.FC;
    key: string;
  }

  type ActiveConfigurationComponent = {
    key: string;
    configSchema: ComponentStyleConfigSchema[];
  }

  type StyleFieldBaseProps = {
    value?: DeclarationPlain;
    property?: string;
    onChange: (v: DeclarationPlain) => void;
  }

  type StyleGuideCommonConfig = {
    primaryColor: string;
    titleIcon?: string;
    favicons?: string;
    componentCssUrl?: string,
  }
}

