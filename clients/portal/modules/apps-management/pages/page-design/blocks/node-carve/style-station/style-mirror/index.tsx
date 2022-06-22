import React, { useEffect, useState, CSSProperties } from 'react';
import cs from 'classnames';
import { get } from 'lodash';

import CollapsePanel from './components/collapse-panel';
import ClassStation from '../class-station';
import { useConfigContext } from '../../context';
import { updateNodeProperty } from '../../utils';
import LayoutConfig from './layout-config';
import DisplayConfig from './display-config';

import store from './store';
import { observer } from 'mobx-react';
import TypographyConfig from './typography-config';
import BorderConfig from './border-config';
import BackgroundConfig from './background-config';
import ShadowConfig from './shadow-config';
import { BACKGROUND_KEYS, BORDER_KEYS, BOX_SHADOW_KEY, DISPLAY_KEYS, TYPOGRAPHY_KEYS } from './constant';

import { getClearObjectValueFromKeys } from '../utils';
import { toJS } from 'mobx';

export type Props = {
  style?: React.CSSProperties;
  className?: string;
}

const TITLE_CLASS_NAME = 'sticky top-0 left-0 bg-white z-10 cursor-pointer hover:bg-blue-200 duration-300 text-14 font-semibold border-t-1 border-blue-200';
const CONTENT_CLASS_NAME = 'flex flex-col px-12 py-8 gap-4';

function StyleMirror({ style, className }: Props): JSX.Element {
  const { sizes, margin, padding, setCssProperties, updateCssProperties } = store;
  const [componentClassName, setComponentClassName] = useState<string>('');
  const { artery, rawActiveNode, onArteryChange } = useConfigContext() ?? {};

  function handleClassNameChange(newClassName: string): void {
    setComponentClassName(newClassName);
    if (rawActiveNode && artery) {
      const newArtery = updateNodeProperty(
        rawActiveNode,
        `props.${store.styleType === 'itemStyle' ? 'itemClassName' : 'className'}`,
        { type: 'constant_property', value: newClassName },
        artery,
      );
      onArteryChange?.(newArtery);
    }
  }

  function handleStyleChange(style: React.CSSProperties): void {
    updateCssProperties(style);
    if (rawActiveNode && artery) {
      const newArtery = updateNodeProperty(
        rawActiveNode,
        `props.${store.styleType}`,
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
      const defaultClassName = get(rawActiveNode, `props.${store.styleType === 'itemStyle' ? 'itemClassName' : 'className'}.value`, '');
      const defaultStyles = get(rawActiveNode, `props.${store.styleType}.value`, {});
      setComponentClassName(defaultClassName);
      setCssProperties(defaultStyles);
    }
  }, [rawActiveNode?.id, store.styleType]);

  return (
    <div
      style={style}
      className={cs('w-full mb-32', className)}
    >
      <CollapsePanel
        defaultCollapse={false}
        titleClassName={TITLE_CLASS_NAME}
        contentClassName={CONTENT_CLASS_NAME}
        title={'ClassName 设置'}
      >
        <ClassStation
          defaultClassName={componentClassName}
          onChange={handleClassNameChange}
        />
      </CollapsePanel>
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
