import { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { Position, ArrowHeadType } from 'react-flow-renderer';

export interface NodeProps {
  id: string;
  data: Record<string, unknown>;
  type: string;
  selected: boolean;
  sourcePosition: string;
  targetPosition: string;
}

export interface EdgeProps {
  id: string;
  source: string;
  target: string;
  selected: boolean;
  animated: boolean;
  label: string;
  labelStyle: CSSProperties;
  labelShowBg: boolean;
  labelBgStyle: CSSProperties;
  labelBgPadding: number;
  labelBgBorderRadius: number;
  data: Record<string, unknown>;
  style: CSSProperties;
  arrowHeadType: ArrowHeadType;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: Position;
  targetPosition: Position;
  markerEndId: string;
}
export interface EdgeTextProps extends HTMLAttributes<SVGElement> {
  x: number;
  y: number;
  width?: number | string;
  height?: number | string;
  label?: string | ReactNode;
  labelStyle?: CSSProperties;
  labelShowBg?: boolean;
  labelBgStyle?: CSSProperties;
  labelBgPadding?: [number, number];
  labelBgBorderRadius?: number;
  rectClassName?: string;
  textClassName?: string;
}

export interface Rect extends Dimensions, XYPosition {}

export interface Dimensions {
  width: number;
  height: number;
}

export interface XYPosition {
  x: number;
  y: number;
}
