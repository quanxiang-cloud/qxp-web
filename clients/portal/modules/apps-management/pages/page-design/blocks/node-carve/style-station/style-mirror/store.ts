import { CSSProperties } from 'react';
import { observable, action, computed } from 'mobx';
import { SizeValue } from './layout-config/size-config';
import { SIZE_KEYS, MARGIN_KEYS, PADDING_KEYS, DISPLAY_KEYS, TYPOGRAPHY_KEYS, BORDER_KEYS, BACKGROUND_KEYS, BOX_SHADOW_KEY } from './constant';
import type { MarginValue } from './layout-config/margin-config';
import type { PaddingValue } from './layout-config/padding-config';
import type { DisplayValue } from './display-config';
import type { TypographyValue } from './typography-config';
import type { BorderValue } from './border-config';
import type { BackgroundValue } from './background-config';
import { ShadowValue } from './shadow-config';

class StyleMirrorStore {
  @observable cssProperties: CSSProperties = {};
  @observable styleType = 'style';

  @computed get sizes(): SizeValue {
    return this.getPartialCssObjFromAll(SIZE_KEYS, this.cssProperties);
  }

  @computed get margin(): MarginValue {
    return this.getPartialCssObjFromAll(MARGIN_KEYS, this.cssProperties);
  }

  @computed get padding(): PaddingValue {
    return this.getPartialCssObjFromAll(PADDING_KEYS, this.cssProperties);
  }

  @computed get display(): DisplayValue {
    return this.getPartialCssObjFromAll(DISPLAY_KEYS, this.cssProperties);
  }

  @computed get typography(): TypographyValue {
    return this.getPartialCssObjFromAll(TYPOGRAPHY_KEYS, this.cssProperties);
  }

  @computed get border(): BorderValue {
    return this.getPartialCssObjFromAll(BORDER_KEYS, this.cssProperties);
  }

  @computed get background(): BackgroundValue {
    return this.getPartialCssObjFromAll(BACKGROUND_KEYS, this.cssProperties);
  }

  @computed get boxShadow(): ShadowValue {
    return this.getPartialCssObjFromAll(BOX_SHADOW_KEY, this.cssProperties);
  }

  @action
  setCssProperties = (value: CSSProperties): void => {
    this.cssProperties = value;
  };

  @action
  setStyleType = (type: string): void => {
    this.styleType = type;
  };

  @action
  updateCssProperties = (value: CSSProperties): void => {
    const newCssProperties = { ...this.cssProperties, ...value };
    const filterKeyValueArray = Object.entries(newCssProperties).filter(([, value]) => {
      if (value === 0) {
        return true;
      }
      return value;
    });
    const filteredCssValue = Object.fromEntries(filterKeyValueArray);
    this.cssProperties = filteredCssValue;
  };

  getPartialCssObjFromAll = (
    keys: string[],
    allCssProperties: CSSProperties,
  ): CSSProperties => {
    const sizeValueArray = keys.map((key) => [key, allCssProperties[key as keyof CSSProperties]])
      .filter(([, value]) => value);
    return Object.fromEntries(sizeValueArray);
  };
}

export default new StyleMirrorStore();
