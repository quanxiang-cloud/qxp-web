export type Options = {
  label: string;
  value: string;
}[];

export function getFormDataOptions(): Promise<Options> {
  return new Promise((r) => {
    setTimeout(() => {
      r(
        [{
          label: '出差申请单',
          value: '1',
        }, {
          label: '差旅报销',
          value: '2',
        }, {
          label: '请假单',
          value: '3',
        }, {
          label: '离职申请表',
          value: '4',
        }, {
          label: '测试表单',
          value: '5',
        }, {
          label: '公有云工单示例',
          value: '6',
        }]
      );
    }, 100);
  });
}

export function getFormFieldOptions(): Promise<Options> {
  return new Promise((r) => {
    setTimeout(() => {
      r(
        [{
          label: '修改时间',
          value: '1',
        }, {
          label: '创建时间',
          value: '2',
        }, {
          label: '创建人',
          value: '3',
        }, {
          label: '申请时间',
          value: '4',
        }]
      );
    }, 100);
  });
}

export interface FieldList {
  custom: {label: string; name: string, children?: string[]; parent?: string}[];
  system: {label: string; name: string}[];
}
export function getFieldsList(): Promise<FieldList> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        custom: [{
          label: '姓名',
          name: 'username',
        }, {
          label: '年龄',
          name: 'age',
        }, {
          label: '明细',
          name: 'detail',
          children: ['4', '5', '6'],
        }, {
          label: '金额',
          name: 'amount',
          parent: 'detail',
        }, {
          label: '规格',
          name: 'specification',
          parent: 'detail',
        }, {
          label: '数量',
          name: 'number',
          parent: 'detail',
        }, {
          label: '附件',
          name: 'annex',
        }],
        system: [{
          label: '提交时间',
          name: 'submit_time',
        }, {
          label: '发起人',
          name: 'sponsor',
        }],
      });
    }, 100);
  });
}

export interface OperationItem {
  enabled: boolean;
  changeable: boolean;
  name: string;
  defaultText?: string;
  text?: string;
}
export function getOperationList(): Promise<{
  default: OperationItem[];
  custom: OperationItem[];
}> {
  return new Promise((r) => {
    return r({
      default: [{
        enabled: true,
        changeable: false,
        name: '操作',
        defaultText: 'pass',
        text: '通过',
      }, {
        enabled: true,
        changeable: false,
        name: '驳回',
        defaultText: 'reject',
        text: '不同意',
      }],
      custom: [{
        enabled: false,
        changeable: true,
        name: '转交',
      }, {
        enabled: true,
        changeable: true,
        name: '邀请阅示',
        defaultText: 'notification',
        text: '通知',
      }, {
        enabled: false,
        changeable: true,
        name: '回退',
      }, {
        enabled: false,
        changeable: true,
        name: '打回',
      }, {
        enabled: false,
        changeable: true,
        name: '抄送',
      }, {
        enabled: false,
        changeable: true,
        name: '加签',
      }],
    });
  });
}
