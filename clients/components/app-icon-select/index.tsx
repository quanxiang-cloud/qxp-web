import React, { useRef, useState } from 'react';
import cs from 'classnames';
import { Control } from '@QCFE/lego-ui';

import Icon from '@c/icon';
import Popper from '@c/popper';

type Props = {
  onChange: (value: string) => void
  value: string;
  placeholder?: string;
  options?: string[]
}

export const APP_ICON_LIST = [
  'assignment_ind',
  'card_travel',
  'fact_check',
  'rule',
  'rule_folder',
  'book',
  'bookmarks',
  'date_range',
  'schedule',
  'table_view',
  'addchart',
  'donut_small',
  'chrome_reader_mode',
  'account_balance_wallet',
  'layers',
  'dashboard',
  'dns',
  'assessment',
  'confirmation_number',
  'monetization_on',
  'request_page',
  'loyalty',
  'room',
  'favorite_border',
  'devices_other',
  'apps',
  'post_add',
  'home_work',
  'airplay',
  'payments',
  'campaign',
  'extension',
  'important_devices',
  'lightbulb',
  'leaderboard',
  'thumb_up',
  'school',
  'emoji_emotions',
  'folder_shared',
  'support_agent',
  'groups',
  'engineering',
  'domain',
  'public',
  'explore',
  'location_searching',
  'notifications_none',
  'settings',
  'construction',
  'military_tech',
  'pest_control',
  'masks',
  'wifi_tethering',
  'speed',
  'hourglass_top',
  'flight_takeoff',
  'meeting_room',
  'business_center',
  'free_breakfast',
  'assignment',
  'text_snippet',
  'star_half',
  'storefront',
  'print',
  'support',
  'verified_user',
  'verified',
  'trending_up',
  'palette',
  'all_inclusive',
];

const modifiers = [
  {
    name: 'offset',
    options: {
      offset: [0, 4],
    },
  },
];

function IconSelect({
  onChange,
  value,
  options,
  placeholder = '请选择',
}: Props, ref?: React.LegacyRef<Control>): JSX.Element {
  const [isVisible, setIsVisible] = useState(false);
  const [iconName, setIconName] = useState(value);
  const popperRef = useRef<any>();
  const reference = useRef<any>();

  const optionsVisibilityChange = (visible: boolean): void => {
    setIsVisible(visible);
  };

  const optionClick = (_value: string): void => {
    popperRef.current?.close();
    onChange(_value);
    setIconName(_value);
  };

  const renderOptions = (): JSX.Element => {
    const width = reference.current ? reference.current.clientWidth : 200;

    return (
      <div className='app-icon-select-option-box' style={{ width: width + 'px' }}>
        {(options ? options : APP_ICON_LIST).map((icon) => (
          <div
            key={icon}
            onClick={() => optionClick(icon)}
            className={cs('app-icon-select-option',
              { 'app-icon-select-active': icon === iconName },
            )}
          >
            <Icon className='app-icon-color-inherit' name={icon} size={24} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <Control ref={ref}>
      <div ref={reference} className='app-bg-icon-select'>
        <div>{iconName ? <Icon name={iconName} size={24} /> : placeholder}</div>
        <Icon size={20} name={isVisible ? 'expand_less' : 'expand_more'} />
      </div>
      <Popper
        ref={popperRef}
        reference={reference}
        placement="bottom-start"
        modifiers={modifiers}
        onVisibilityChange={optionsVisibilityChange}
      >
        {renderOptions()}
      </Popper>
    </Control>
  );
}

export default React.forwardRef(IconSelect);
