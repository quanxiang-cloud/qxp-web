import { BUTTON_SUBSTANCE_METHOD } from './constant';

type getOperateButtonPerParam = {
    appID: string,
    tableID: string,
    authority: Record<string, boolean>

}

export function getOperateButtonPer(operate: string, appMes: getOperateButtonPerParam): boolean {
  const { appID, tableID, authority } = appMes;
  const operatePath = getAPIPath(appID, tableID, operate, 'POST');
  return authority[operatePath] || false;
}

export function getButtonAPIList(appID: string, tableID: string): {accessPath: string, method: string}[] {
  const buttonAPiList = [
    { accessPath: `/api/v1/form/${appID}/home/form/${tableID}/get`, method: 'POST' },
    { accessPath: `/api/v1/form/${appID}/home/form/${tableID}/search`, method: 'POST' },
    { accessPath: `/api/v1/form/${appID}/home/form/${tableID}/update`, method: 'POST' },
    { accessPath: `/api/v1/form/${appID}/home/form/${tableID}/delete`, method: 'POST' },
    { accessPath: `/api/v1/form/${appID}/home/form/${tableID}/create`, method: 'POST' },
  ];
  return buttonAPiList;
}

export function getAPIPath(appID: string, tableID: string, operate: string, method: string ): string {
  return `/api/v1/form/${appID}/home/form/${tableID}/${BUTTON_SUBSTANCE_METHOD[operate]}-${method}`;
}
