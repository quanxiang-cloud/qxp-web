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
