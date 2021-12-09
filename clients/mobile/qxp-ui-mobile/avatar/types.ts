import { NumberString, Props } from '@m/qxp-ui-mobile';

export interface AvatarProps extends Props {
    name?: string;
    size?: NumberString;
}

export interface AvatarInfo {
    name: string;
    color: string;
}
