import React from 'react';
import { StyleConfigInterface } from '@one-for-all/style-guide';
declare global {
  type ComponentStyleConfigSchema = {
    selector: string;
    desc?: string;
    pseudo?: ComponentStyleConfigSchema[];
    children?: ComponentStyleConfigSchema[];
  }

  type ComponentStyleConfigInterface = {
    key: string;
    title: string;
    commonStatus?: Record<string, any>[];
    property?: string;
    value?: unknown;
    configSchema: ComponentStyleConfigSchema[];
  }

  type ComponentPackagingObject = {
    name: string;
    schemas: ComponentStyleConfigInterface[];
    Component: React.FC;
    key: string;
  }

  type ActiveConfigurationComponent = {
    key: string;
    spec: StyleConfigInterface;
  }

  type StyleGuideCommonConfig = {
    primaryColor: string;
    titleIcon?: string;
    favicons?: string;
    componentCssUrl?: string,
  }
}

