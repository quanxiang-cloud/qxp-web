import { Props } from '@m/qxp-ui-mobile';
import React from 'react';

export type HtmlTagType = keyof HTMLElementTagNameMap;

export interface BadgeProps extends Props {
    content?: React.ReactNode;
    dot?: boolean;
    max?: number | string;
    color?: string;
    offset?: [x: string | number, y: string | number];
    showZero?: boolean;
    tag?: HtmlTagType;
    onClick?: (e: React.MouseEvent) => void;
    onTouchStart?: (e: React.MouseEvent) => void;
}

export type BadgeSettingProps = Omit<
    BadgeProps,
    'children' | 'tag' | 'onClick' | 'style' | 'className'
    >;
