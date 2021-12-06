import React, { CSSProperties, ReactNode } from 'react';

export interface Props {
  className?: string;
  style?: CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
  children?: ReactNode;
}

export type RenderFunc = () => React.ReactNode;

export type NumberString = number | string;

export type VoidCallback = () => void;

export type TeleportType = HTMLElement | (() => HTMLElement) | null;
