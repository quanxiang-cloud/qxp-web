import React, {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDrag } from '@use-gesture/react';
import cs from 'classnames';
import { useSpring, animated } from '@react-spring/web';

import { getRect } from '../utils/hooks/use-rect';
import { bound } from '../utils';
import useRefState from '../utils/hooks/use-ref-state';

import { PageIndicatorProps, SwiperInstance, SwiperProps } from './types';

function modulus(value: number, division: number): number {
  const remainder = value % division;
  return remainder < 0 ? remainder + division : remainder;
}

const PageIndicator = memo<PageIndicatorProps>(({ vertical, ...props }: PageIndicatorProps) => {
  const dots: React.ReactElement[] = [];
  for (let i = 0; i < props.total; i += 1) {
    dots.push(
      <div
        key={i}
        className={cs('indicator__dot', { 'indicator__dot--active': props.current === i })}
      />,
    );
  }

  return (
    <div className={cs(props.className, { 'indicator--vertical': vertical })} style={props.style}>
      {dots}
    </div>
  );
});

const Swiper = forwardRef<SwiperInstance, SwiperProps>((props: SwiperProps, ref) => {
  const {
    vertical,
    duration,
    initialSwipe = 0,
    touchable = true,
    loop: outerLoop = true,
    autoplay,
    slideSize = 100,
    trackOffset = 0,
    stuckAtBoundary = false,
    indicator,
    indicatorProps,
  } = props;

  const lock = useRef<boolean>(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  const [current, setCurrent] = useState(initialSwipe);
  const [dragging, setDragging, draggingRef] = useRefState(false);

  const axis = useMemo(() => (vertical ? 'y' : 'x'), [vertical]);

  const slideRatio = slideSize / 100;
  const offsetRatio = trackOffset / 100;

  const computedStyle = useMemo(() => {
    return {
      ['--swipe-slide-size']: `${slideSize}%`,
      ['--swipe-track-offset']: `${trackOffset}%`,
      ...props.style,
    };
  }, [props.style, slideSize, trackOffset]);

  const axisDistance = useMemo(() => {
    if (!vertical) return 100;
    const rect = getRect(root as HTMLDivElement);
    return rect.height;
  }, [vertical, root]);

  const { validChildren, count } = useMemo(() => {
    let innerCount = 0;
    const innerValidChildren = React.Children.map(props.children, (child) => {
      if (!React.isValidElement(child)) return null;
      innerCount += 1;
      return child;
    });
    return {
      validChildren: innerValidChildren,
      count: innerCount,
    };
  }, [props.children]);

  const loop = useMemo(() => {
    if (count <= 1) return false;
    return outerLoop;
  }, [count, outerLoop]);

  const getSlidePixels = (): number => {
    const track = trackRef.current;
    if (!track) return 0;
    const trackPixels = vertical ? track.offsetHeight : track.offsetWidth;
    return (trackPixels * slideSize) / 100;
  };

  const boundIndex = (cur: number): number => {
    let min = 0;
    let max = count - 1;
    if (stuckAtBoundary) {
      min += (1 - slideRatio - offsetRatio) / slideRatio;
      max -= (1 - slideRatio - offsetRatio) / slideRatio;
    }
    return bound(cur, min, max);
  };

  const [{ position }, api] = useSpring(
    () => ({
      position: boundIndex(current) * 100,
      config: {
        tension: 200,
        friction: 30,
        duration,
        easing: (t) => {
          let num = t * 2;
          if (num <= 1) {
            return (t * t) / 2;
          }
          num -= 1;
          return ((num * (2 - num)) + 1) / 2;
        },
      },
      onRest: () => {
        if (draggingRef.current) return;
        const rawX = position.get();
        const totalWidth = 100 * count;
        const standardPosition = modulus(rawX, totalWidth);
        if (standardPosition === rawX) return;
        api.start({
          position: standardPosition,
          immediate: true,
        });
      },
    }),
    [count],
  );

  const bind = useDrag(
    (state) => {
      if (lock.current) return;
      const slidePixels = getSlidePixels();
      if (!slidePixels) return;
      const paramIndex = vertical ? 1 : 0;
      const offset = state.offset[paramIndex];
      const direction = state.direction[paramIndex];
      const velocity = state.velocity[paramIndex];
      setDragging(true);
      if (!state.last) {
        api.start({
          position: (offset * 100) / slidePixels,
          immediate: true,
        });
      } else {
        const index = Math.round(
          (offset + (Math.min(velocity * 2000, slidePixels) * direction)) / slidePixels,
        );
        swipeTo(index);
        window.setTimeout(() => {
          setDragging(false);
        });
      }
    },
    {
      transform: ([x, y]) => [-x, -y],
      from: () => {
        const slidePixels = getSlidePixels();
        return [(position.get() / 100) * slidePixels, (position.get() / 100) * slidePixels];
      },
      bounds: () => {
        if (loop) return {};
        const slidePixels = getSlidePixels();
        const lowerBound = boundIndex(0) * slidePixels;
        const upperBound = boundIndex(count - 1) * slidePixels;
        return vertical ?
          {
            top: lowerBound,
            bottom: upperBound,
          } :
          {
            left: lowerBound,
            right: upperBound,
          };
      },
      rubberband: true,
      axis,
      preventScroll: !vertical,
      pointer: {
        touch: true,
      },
    },
  );

  const renderIndicator = (): React.ReactNode => {
    if (indicator === undefined || indicator === true) {
      return (
        <div className={cs('swiper__indicator', { 'swiper__indicator--vertical': vertical })}>
          <PageIndicator
            {...indicatorProps}
            vertical={vertical}
            total={count}
            current={current}
          />
        </div>
      );
    }
    if (typeof indicator === 'function') {
      return indicator(count, current);
    }
    return null;
  };

  const onClickCapture = (e: React.MouseEvent): void => {
    if (draggingRef.current) {
      e.stopPropagation();
    }
  };

  function swipeTo(index: number, immediate = false): void {
    if (loop) {
      const i = modulus(index, count);
      setCurrent(i);
      props.onChange?.(i);
      api.start({
        position: index * 100,
        immediate,
      });
    } else {
      const i = bound(index, 0, count - 1);
      setCurrent(i);
      props.onChange?.(i);
      api.start({
        position: boundIndex(i) * 100,
        immediate,
      });
    }
  }

  const swipeNext = (): void => {
    swipeTo(Math.round(position.get() / 100) + 1);
  };

  const swipePrev = (): void => {
    swipeTo(Math.round(position.get() / 100) - 1);
  };

  useImperativeHandle(ref, () => ({
    activeIndex: current,
    swipeTo,
    swipeNext,
    swipePrev,
    lock: () => {
      lock.current = true;
    },
    unlock: () => {
      lock.current = false;
    },
  }));

  useEffect(() => {
    if (!autoplay || dragging) return () => void 0;
    const autoplayInterval = typeof autoplay === 'boolean' ? 5000 : autoplay;
    const interval = window.setInterval(() => {
      swipeNext();
    }, autoplayInterval);
    return () => {
      window.clearInterval(interval);
    };
  }, [autoplay, dragging, axisDistance]);

  return (
    <div ref={setRoot} className={cs(props.className, 'swiper', { 'swiper--vertical': vertical })}
      style={computedStyle}>
      <div
        ref={trackRef}
        className={cs('swiper__track', { 'swiper__track--allow-touch-move': touchable })}
        onClickCapture={onClickCapture}
        {...(touchable ? bind() : {})}
      >
        <div
          className={cs('swiper__track-inner', { 'swiper--vertical': vertical })}
        >
          {React.Children.map(validChildren, (child, index) => {
            return (
              <animated.div
                className='swiper__slide'
                style={{
                  [axis]: position.to((pos) => {
                    let finalPosition = -pos + (index * 100);
                    const totalWidth = count * 100;
                    const flagWidth = totalWidth / 2;
                    finalPosition = modulus(finalPosition + flagWidth, totalWidth) - flagWidth;
                    return `${finalPosition}%`;
                  }),
                  left: `-${index * 100}%`,
                }}
              >
                {child}
              </animated.div>
            );
          })}
        </div>
      </div>
      {renderIndicator()}
    </div>
  );
});

export default Swiper;
