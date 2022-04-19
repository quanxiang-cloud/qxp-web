import { TokenTypes } from '../constants/constants-types';
import {
  TokenBoxshadowUnit,
  TokenBoxshadowValue,
  TokenTextDecorationValue,
  TokenTypograpyUnit,
  TokenTypograpyValue,
} from './values';

export type BaseToken<
  T extends TokenTypes,
  V = string,
  U = string,
> = {
  name: string;
  type: T;
  value: V;
  unit?: U;
  description?: string;
  parent?: string;
}

export type BorderRadiusToken = BaseToken<
  TokenTypes.BORDER_RADIUS,
  string
>;

export type BorderWidthToken = BaseToken<
  TokenTypes.BORDER_WIDTH,
  string
>;

export type BoxShadowToken = BaseToken<
  TokenTypes.BOX_SHADOW,
  TokenBoxshadowValue | TokenBoxshadowValue[],
  TokenBoxshadowUnit | TokenBoxshadowUnit[]
>;

export type ColorToken = BaseToken<
  TokenTypes.COLOR,
  string
>;

export type FontFamiliesToken = BaseToken<
  TokenTypes.FONT_FAMILIE,
  string
>;

export type FontSizesToken = BaseToken<
  TokenTypes.FONT_SIZE,
  string
>;

export type FontWeightsToken = BaseToken<
  TokenTypes.FONT_WEIGHT,
  string
>;

export type LineHeightsToken = BaseToken<
  TokenTypes.LINE_HEIGHT,
  string
>;

export type OpacityToken = BaseToken<
  TokenTypes.OPACITY,
  string
>;

export type SpacingToken = BaseToken<
  TokenTypes.SPACING,
  string
>;

export type TextDecorationToken = BaseToken<
  TokenTypes.TEXT_DECORATION,
  TokenTextDecorationValue
>;

export type TypographyToken = BaseToken<
  TokenTypes.TYPOGRAPHY,
  TokenTypograpyValue,
  TokenTypograpyUnit
>;

export type OtherToken = BaseToken<
  TokenTypes.OTHER,
  string
>;

export type Token =
  | ColorToken
  | BorderRadiusToken
  | TypographyToken
  | OpacityToken
  | BorderWidthToken
  | BoxShadowToken
  | FontFamiliesToken
  | FontWeightsToken
  | LineHeightsToken
  | FontSizesToken
  | TextDecorationToken
  | SpacingToken
  | OtherToken;

export type AnyTokenList = Token[];

export type TokenStore = {
  version: string;
  values: Record<string, AnyTokenList>;
};

export type TokenTypeSchema = {
  label: string;
  property: string;
  type: TokenTypes;
  explainer?: string;
  schema: {
    value?: Token['value'];
    options: {
      description?: string;
    };
    unit?: Token['unit'];
  };
};
