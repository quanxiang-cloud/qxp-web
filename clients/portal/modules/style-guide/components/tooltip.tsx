import React from 'react';

import ToolTip from '@c/tooltip';

function ToolTipPreview(): JSX.Element {
  return (
    <ToolTip
      position="top"
      label="Preview"
    >
      <div className='inline-block'>Preview</div>
    </ToolTip>
  );
}

const config_schema = [
  {
    selector: '.qxp-tooltip-container',
    children: [
      {
        selector: '.qxp-ui-tooltip',
        desc: '可编辑属性有阴影、边框、圆角等',
        children: [
          {
            selector: '.qxp-ui-tooltip-label',
            desc: '字体样式',
          },
        ],
      },
    ],
  },
];

export default {
  key: 'tooltip',
  config_schema,
  Component: ToolTipPreview,
};
