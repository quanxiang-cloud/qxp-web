import Swiper from './swiper';
import SwiperItem from './swiper-item';
import './swiper.scss';

export default Object.assign(Swiper, { Item: SwiperItem });
export type { SwiperInstance, SwiperProps } from './types';

