import { BoxShadowTypes } from '../constants/constants-types';

export type TokenTextDecorationValue =
  | 'none'
  | 'underline'
  | 'line-through'
  | 'strikethrough';

export type TokenBoxshadowValue = {
  color: string;
  x: string;
  y: string;
  blur: string;
  spread: string;
  type: BoxShadowTypes;
};

export type TokenTypograpyValue = {
  fontFamily: string;
  fontWeight: string;
  fontSize: string;
  lineHeight: string;
  textDecoration: TokenTextDecorationValue;
};

export type TokenBoxshadowUnit = {
  x: string;
  y: string;
  blur: string;
  spread: string;
};

export type TokenTypograpyUnit = {
  fontSize: string;
  lineHeight: string;
};
