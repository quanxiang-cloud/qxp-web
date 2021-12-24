import React, { CSSProperties, forwardRef, ReactNode, useEffect, useImperativeHandle } from 'react';
import { useSetState } from 'react-use';

import Popup from '../popup';
import Icon from '../icon';
import { NumberString } from '..';
import { addUnit, getZIndexStyle } from '../utils/format/unit';

import { DropdownMenuInstance, DropdownMenuOption, DropdownMenuProps } from './types';

const DropdownMenu = forwardRef<DropdownMenuInstance, DropdownMenuProps>(
  (props: DropdownMenuProps, ref): JSX.Element => {
    const {
      direction = 'down',
      overlay = true,
      duration = 200,
      closeOnClickOverlay = true,
      overlayStyle,
      popupStyle,
      zIndex = 10,
      offset,
    } = props;

    const [state, setState] = useSetState({
      showPopup: false,
      showWrapper: false,
      transition: true,
      value: props.value ?? props.options?.[0]?.value ?? '',
    });

    useEffect(() => {
      if (state.value !== props.value) {
        setState({ value: props.value });
      }
    }, [props.value]);

    useEffect(() => {
      if (state.showPopup !== props.showPopup) {
        setState({ showPopup: props.showPopup });
      }
    }, [props.showPopup]);

    const toggle = (show = !state.showPopup, options: { immediate?: boolean } = {}): void => {
      if (show === state.showPopup) {
        return;
      }
      const newState = {} as typeof state;
      newState.transition = !options.immediate;
      newState.showPopup = show;

      if (show) {
        newState.showWrapper = true;
        props.onOpen?.();
      } else {
        onClose();
      }
      setState(newState);
    };

    useImperativeHandle(ref, () => ({ toggle, state }));

    const onClosed = (): void => {
      setState({ showWrapper: false });
      props.onClosed?.();
    };

    const onClickWrapper = (event: React.MouseEvent): void => {
    // prevent being identified as clicking outside and closed when using teleport
      if (props.teleport) {
        event.stopPropagation();
      }
    };

    const onClose = (): void => {
      setState({ showPopup: false });
      props.onClose?.();
    };

    const renderOption = (option: DropdownMenuOption, value: NumberString): ReactNode => {
      const active = option.value === value;

      const onClick = (): void => {
        setState({ value: option.value });
        if (option.value !== state.value) {
          props.onChange?.(option.label, option.value);
        }
        onClose();
      };

      return (
        <div
          key={option.value}
          className="body1 flex justify-center dropdown-menu__option"
          onClick={onClick}
        >
          <div className='flex-1 truncate'
            style={{ color: active ? 'var(--blue-600)' : '' }}
          >
            {option.label}
          </div>
          {active &&
          (<Icon name="done"
            size=".18rem"
            className='ml-8'
            style={{ color: 'var(--green-600)' }}
          />)
          }
        </div>
      );
    };

    const style: CSSProperties = getZIndexStyle(zIndex, props.style);
    style.display = state.showWrapper ? 'block' : 'none';
    if (offset) {
      if (direction === 'down') {
        style.top = addUnit(offset);
      } else {
        style.bottom = addUnit(offset);
      }
    }

    return (
      <div
        style={style}
        className={`dropdown-menu dropdown-menu--${direction}`}
        onClick={onClickWrapper}
      >
        <Popup
          overlay={overlay}
          teleport={null}
          visible={state.showPopup}
          style={{ position: 'absolute', ...(popupStyle || {}) }}
          closeOnClickOverlay={closeOnClickOverlay}
          className='dropdown-menu--content'
          position={direction === 'down' ? 'top' : 'bottom'}
          duration={state.transition ? +duration : 0}
          overlayStyle={{ position: 'absolute', ...(overlayStyle || {}) }}
          onClose={onClose}
          onClosed={onClosed}
        >
          {props.options?.map((opt) => renderOption(opt, state.value))}
          {props.children}
        </Popup>
      </div>
    );
  });

export default DropdownMenu;
