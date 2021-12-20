import { TabsContentProps } from '@m/qxp-ui-mobile/tabs/types';
import React, { MutableRefObject, ReactNode, useEffect, useRef } from 'react';
import { SwiperInstance } from '@m/qxp-ui-mobile/swiper';
import Swiper from '@m/qxp-ui-mobile/swiper';
import cs from 'classnames';

const TabsContent: React.FC<TabsContentProps> = (props) => {
  const swipeRef = useRef<SwiperInstance>();
  const innerEffect = useRef(false);
  const { animated, canSwipe, duration } = props;

  const renderChildren = (): ReactNode => {
    if (animated || canSwipe) {
      return (
        <Swiper
          ref={swipeRef as MutableRefObject<SwiperInstance>}
          loop={false}
          autoplay={false}
          touchable={canSwipe}
          className='tabs__track'
          duration={+duration}
          indicator={false}
          onChange={(idx) => {
            if (innerEffect.current) {
              innerEffect.current = false;
              return;
            }
            if (props.onChange) props.onChange(idx);
          }}
        >
          {React.Children.map(props.children ?? [], (child) => (
            <Swiper.Item
              style={{ cursor: !canSwipe ? 'auto' : undefined }}
              className='tabs__pane-wrapper'
            >
              {child}
            </Swiper.Item>
          ))}
        </Swiper>
      );
    }

    return props.children;
  };
  const swipeToCurrentTab = (index: number): void => {
    const swipe = swipeRef.current;
    if (!swipe) return;
    if (swipe.activeIndex !== index) {
      innerEffect.current = true;
      swipe.swipeTo(index);
    }
  };

  useEffect(() => {
    swipeToCurrentTab(props.currentIndex);
  }, [props.currentIndex]);

  return (
    <div className={cs('tabs__content', { 'tabs__content--animated': animated || canSwipe })}>
      {renderChildren()}
    </div>
  );
};

export default TabsContent;
