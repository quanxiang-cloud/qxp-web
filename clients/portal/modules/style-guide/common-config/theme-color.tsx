import React from 'react';

import { ThemeVariable, BaseColorConfig } from '@one-for-all/style-guide';

import ColorPalette from './color-palette';
import store from '../store';

type Props = {
  themeConfig: ThemeVariable[];
  colorConfig: BaseColorConfig;
}

export default function ThemeColor({ themeConfig, colorConfig }: Props): JSX.Element {
  return (
    <>
      {
        themeConfig.map((config) => (
          <div className='flex items-center' key={config.key}>
            <span>{config.name}：</span>
            <ColorPalette
              value={store.commonConfig?.themeVariable?.[config.key] || ''}
              baseColorConfig={colorConfig}
              onChange={(value) => store.setCommonConfig({
                themeVariable: { ...store.commonConfig.themeVariable, [config.key]: value },
              })}
            />
          </div>
        ))
      }
    </>
  );
}
