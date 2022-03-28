import {
  genDesktopRootViewSchemaKey,
} from '@portal/modules/apps-management/pages/app-details/view-orchestration/helpers/utils';

const matchAppIDReg = /\/a\/([a-zA-Z0-9]+)/;

function getAppID(): string {
  const execArr = matchAppIDReg.exec(window.location.pathname);
  if (!execArr) {
    return '';
  }

  return execArr[1];
}

export const rootSchemaKey = genDesktopRootViewSchemaKey(getAppID());
