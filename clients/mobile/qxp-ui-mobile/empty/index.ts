import Empty from './empty';
import EmptyImage from './empty-image';

const EmptyNamespace = Object.assign(Empty, { Image: EmptyImage });

export default EmptyNamespace;
export { EmptyNamespace as Empty, EmptyImage };
export type { EmptyProps, EmptyImageProps } from './types';
