import React, { HTMLInputTypeAttribute } from 'react';

import { NumberString, Props } from '..';

export interface InputProps extends Props {
  placeholder?: string;
  defaultValue?: string;
  disabled?: boolean;
  readOnly?: boolean;
  maxLength?: number;
  minLength?: number;
  max?: NumberString;
  min?: NumberString;
  autoComplete?: string;
  pattern?: string;
  type?: HTMLInputTypeAttribute;
  autoCapitalize?: string;
  autoCorrect?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onEnterPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  enterKeyHint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send';
  onChange?: (val: string) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  renderBefore?: React.ReactNode;
  renderAfter?: React.ReactNode;
  validate?: (val: string) => string | undefined;
}

export interface TextAreaProps extends Props {
  placeholder?: string;
  defaultValue?: string;
  disabled?: boolean;
  readOnly?: boolean;
  maxLength?: number;
  rows?: number;
  onChange?: (val: string) => void;
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  validate?: (val: string) => string | undefined;
}

export interface InputInstance {
  focus: () => void;
  blur: () => void;
  value: string;
  setValue: (val: string) => void;
  error: string | undefined;
  validate: () => string | undefined;
}
