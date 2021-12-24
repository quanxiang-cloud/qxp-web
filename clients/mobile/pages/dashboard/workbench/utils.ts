import { parseJSON } from '@lib/utils';

export function parseAppIcon(appIcon: string): AppIconInfo {
  return parseJSON<AppIconInfo>(appIcon, { bgColor: 'amber', iconName: '' });
}
