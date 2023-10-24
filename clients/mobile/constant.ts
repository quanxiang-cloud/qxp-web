export const pathPrefix = '/mobile';

export const messagesPath = `${pathPrefix}/messages`;
export const messageDetailPath = `${pathPrefix}/messages/:messageId`;

export const approvalsPath = `${pathPrefix}/approvals`;
export const approvalDetailPath = `${pathPrefix}/approvals/:processInstanceID/:taskID/:type/:taskType`;
export const approvalDetailPathApproval = `${pathPrefix}/approvals/:processInstanceID/:taskID/:type`;
export const approvalActionPath = `${pathPrefix}/approvals/:processInstanceID/:taskID/:type/actions`;
export const approvalStatusPath = `${pathPrefix}/approvals/:processInstanceID/:taskID/:type/status`;

export const appsPath = `${pathPrefix}/apps/:appID`;
export const appsPageDetailPath = `${pathPrefix}/apps/:appID/:pageID`;

export const accountPath = `${pathPrefix}/account`;
export const changePwdPath = `${pathPrefix}/account/security`;
export const forgetPwdPath = `${pathPrefix}/account/security/forget`;

export const userOrgPickerPath = `${pathPrefix}/user-org-picker`;
