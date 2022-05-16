import { StyleConfigInterface, ComponentSpec } from '@one-for-all/style-guide';
declare global {
  type ComponentSpecs = ComponentSpec[];
  type ActiveConfigurationComponent = {
    key: string;
    spec: StyleConfigInterface;
  }

  type StyleGuideCommonConfig = {
    primaryColor: string;
    titleIcon?: string;
    favicons?: string;
    commonCssUrl?: string;
    themeVariable?: Record<string, string>;
  };
}
