import { Props } from '@m/qxp-ui-mobile';

export interface AvatarProps extends Props {
    name?: string,
    size?: string | number,
}

export interface AvatarInfo {
    name: string,
    color: string,
}
