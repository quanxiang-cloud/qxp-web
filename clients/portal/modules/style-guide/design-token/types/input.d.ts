import { TokenTypes } from '../constants/constants-types';
import {
  Token,
  AnyTokenList,
  ColorToken,
  BorderRadiusToken,
  TypographyToken,
  OpacityToken,
  BorderWidthToken,
  BoxShadowToken,
  FontFamiliyToken,
  FontWeightsToken,
  LineHeightsToken,
  FontSizesToken,
  TextDecorationToken,
  SpacingToken,
  OtherToken,
} from './token';

type ShallowTokenMap = Record<string, Token>;
type DeepTokenMap = Record<string, Record<string, Token>>;

export type SetTokenInput = {
  values:
    | Record<string, AnyTokenList>
    | Record<string, Partial<Record<TokenTypes, ShallowTokenMap | DeepTokenMap>>>;
  usedTokenSet?: string[];
};

type BaseTokenInput<T extends TokenTypes, V = string, U = string> = {
  parent: string;
  name: string;
  value?: V;
  unit?: U;
  options?: {
    type: T;
    description?: string;
  };
  oldName?: string;
};

export type UpdateTokenInput =
  | BaseTokenInput<TokenTypes.COLOR, ColorToken['value']>
  | BaseTokenInput<
      TokenTypes.BORDER_RADIUS,
      BorderRadiusToken['value']
    >
  | BaseTokenInput<TokenTypes.TYPOGRAPHY, TypographyToken['value'], TypographyToken['unit']>
  | BaseTokenInput<TokenTypes.OPACITY, OpacityToken['value']>
  | BaseTokenInput<TokenTypes.BORDER_WIDTH, BorderWidthToken['value']>
  | BaseTokenInput<TokenTypes.BOX_SHADOW, BoxShadowToken['value'], TypographyToken['unit']>
  | BaseTokenInput<
      TokenTypes.FONT_FAMILY,
      FontFamiliyToken['value']
    >
  | BaseTokenInput<TokenTypes.FONT_WEIGHT, FontWeightsToken['value']>
  | BaseTokenInput<TokenTypes.LINE_HEIGHT, LineHeightsToken['value']>
  | BaseTokenInput<TokenTypes.FONT_SIZE, FontSizesToken['value']>
  | BaseTokenInput<
      TokenTypes.TEXT_DECORATION,
      TextDecorationToken['value']
    >
  | BaseTokenInput<TokenTypes.SPACING, SpacingToken['value']>
  | BaseTokenInput<TokenTypes.OTHER, OtherToken['value']>;

export type DeleteTokenInput = {
  parent: string;
  path: string
};
