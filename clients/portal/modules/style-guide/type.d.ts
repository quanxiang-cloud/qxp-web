import React from 'react';
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
    configSchema: ComponentStyleConfigSchema[];
  }

  type StyleGuideCommonConfig = {
    primaryColor: string;
    titleIcon?: string;
    favicons?: string;
    componentCssUrl?: string,
  }
}

