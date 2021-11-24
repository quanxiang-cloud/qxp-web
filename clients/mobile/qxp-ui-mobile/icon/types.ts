import { Props } from '@m/qxp-ui-mobile';

export interface IconProps extends Props {
    name: string,
    type?: string,
    size?: string | number,
    clickable?: boolean,
    disabled?: boolean
}
