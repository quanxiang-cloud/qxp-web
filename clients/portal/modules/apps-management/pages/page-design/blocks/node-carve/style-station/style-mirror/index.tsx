import React, { useEffect, CSSProperties } from 'react';
import cs from 'classnames';
import { toJS } from 'mobx';
import { get } from 'lodash';

import LayoutConfig from './layout-config';
import DisplayConfig from './display-config';
import { useConfigContext } from '../../context';
import { updateNodeProperty } from '../../utils';
import CollapsePanel from './components/collapse-panel';

import store from './store';
import { observer } from 'mobx-react';
import ClassConfig from './class-config';
import BorderConfig from './border-config';
import ShadowConfig from './shadow-config';
import TypographyConfig from './typography-config';
import BackgroundConfig from './background-config';
import { getClearObjectValueFromKeys } from '../utils';
import {
  DISPLAY_KEYS,
  BORDER_KEYS,
  BOX_SHADOW_KEY,
  BACKGROUND_KEYS,
  TYPOGRAPHY_KEYS,
  TITLE_CLASS_NAME,
  CONTENT_CLASS_NAME,
} from './constant';

export type Props = {
  style?: React.CSSProperties;
  className?: string;
}

function StyleMirror({ style, className }: Props): JSX.Element {
  const { sizes, margin, padding, setCssProperties, updateCssProperties, styleType } = store;
  const { artery, rawActiveNode, onArteryChange } = useConfigContext() ?? {};

  function handleStyleChange(style: React.CSSProperties): void {
    updateCssProperties(style);
    if (rawActiveNode && artery) {
      const newArtery = updateNodeProperty(
        rawActiveNode,
        `props.${styleType}`,
        { type: 'constant_property', value: toJS(store.cssProperties) },
        artery,
      );
      onArteryChange?.(newArtery);
    }
  }

  function handlePartialReset(keys: (keyof CSSProperties)[] ): void {
    handleStyleChange(getClearObjectValueFromKeys(keys));
  }

  useEffect(() => {
    if (rawActiveNode) {
      const defaultStyles = get(rawActiveNode, `props.${styleType}.value`, {});
      setCssProperties(defaultStyles);
    }
  }, [rawActiveNode?.id, store.styleType]);

  return (
    <div
      style={style}
      className={cs('w-full mb-32', className)}
    >
      <ClassConfig />
      <CollapsePanel
        defaultCollapse={false}
        titleClassName={TITLE_CLASS_NAME}
        contentClassName={CONTENT_CLASS_NAME}
        title={'布局'}
      >
        <LayoutConfig
          defaultValue={{ sizes, margin, padding }}
          onChange={handleStyleChange}
        />
      </CollapsePanel>
      <CollapsePanel
        defaultCollapse={false}
        titleClassName={TITLE_CLASS_NAME}
        contentClassName={CONTENT_CLASS_NAME}
        title={'显示'}
      >
        <DisplayConfig
          defaultValue={store.display}
          onChange={handleStyleChange}
          onReset={() => handlePartialReset(DISPLAY_KEYS) }
        />
      </CollapsePanel>
      <CollapsePanel
        defaultCollapse={false}
        titleClassName={TITLE_CLASS_NAME}
        contentClassName={CONTENT_CLASS_NAME}
        title={'字体'}
      >
        <TypographyConfig
          defaultValue={store.typography}
          onChange={handleStyleChange}
          onReset={() => handlePartialReset(TYPOGRAPHY_KEYS) }
        />
      </CollapsePanel>
      <CollapsePanel
        defaultCollapse={false}
        titleClassName={TITLE_CLASS_NAME}
        contentClassName={CONTENT_CLASS_NAME}
        title={'边框'}
      >
        <BorderConfig
          defaultValue={store.border}
          onChange={handleStyleChange}
          onReset={() => handlePartialReset(BORDER_KEYS) }
        />
      </CollapsePanel>
      <CollapsePanel
        defaultCollapse={false}
        titleClassName={TITLE_CLASS_NAME}
        contentClassName={CONTENT_CLASS_NAME}
        title={'背景'}
      >
        <BackgroundConfig
          defaultValue={store.background}
          onChange={handleStyleChange}
          onReset={() => handlePartialReset(BACKGROUND_KEYS) }
        />
      </CollapsePanel>
      <CollapsePanel
        defaultCollapse={false}
        titleClassName={TITLE_CLASS_NAME}
        contentClassName={CONTENT_CLASS_NAME}
        title={'阴影'}
      >
        <ShadowConfig
          defaultValue={store.boxShadow}
          onChange={handleStyleChange}
          onReset={() => handlePartialReset(BOX_SHADOW_KEY) }
        />
      </CollapsePanel>
    </div>
  );
}

export default observer(StyleMirror);
