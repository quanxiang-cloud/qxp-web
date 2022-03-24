import { StyleConfigInterface } from '@one-for-all/style-guide';
declare global {
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

