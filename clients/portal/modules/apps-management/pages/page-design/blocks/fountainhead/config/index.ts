import { saveOfaUiConfig } from './ofa-ui';
import { savePackagesConfig } from './package-list';
import { saveSystemComponentsConfig } from './system-components';

export function saveConfig(): void {
  saveOfaUiConfig();
  savePackagesConfig();
  saveSystemComponentsConfig();
}
