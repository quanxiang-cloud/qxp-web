// todo refactor

// /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/im  (except - and _)
// eslint-disable-next-line
export const SpecialSymbolsReg = /[`~!@#$%^&*()\+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\+={}|《》？：“”【】、；‘'，。、]/im;

export const PhoneReg = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;

export const excelHeader: EmployeeTableColumn[] = [
  {
    title: '员工姓名',
    dataIndex: 'userName',
    key: 'userName',
  },
  {
    title: '所属部门',
    dataIndex: 'depName',
    key: 'depName',
  },
  {
    title: '手机号码',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: '职位',
    dataIndex: 'position',
    key: 'position',
  },
  {
    title: '上级领导',
    dataIndex: 'leaderName',
    key: 'leaderName',
  },
];

export const exportEmployees = (data: Employee[]) => {
  const headers = excelHeader;
  const fileName = '人员列表.xlsx';
  const _headers = headers
    .map((item, i: number) =>
      Object.assign(
        {},
        {
          key: item.key,
          title: item.title,
          position: String.fromCharCode(65 + i) + 1,
        },
      ),
    )
    .reduce(
      (prev: any, next: any) =>
        Object.assign({}, prev, {
          [next.position]: { key: next.key, v: next.title },
        }),
      {},
    );

  const _data = data
    .map((item: any, i: any) =>
      headers.map((key: any, j: any) =>
        Object.assign(
          {},
          {
            content: item[key.key],
            position: String.fromCharCode(65 + j) + (i + 2),
          },
        ),
      ),
    )
    .reduce((prev: any, next: any) => prev.concat(next))
    .reduce(
      (prev: any, next: any) => Object.assign({}, prev, { [next.position]: { v: next.content } }),
      {},
    );
  const output = Object.assign({}, _headers, _data);
  const outputPos = Object.keys(output);
  const ref = `${outputPos[0]}:${outputPos[outputPos.length - 1]}`;
  const wb = {
    SheetNames: ['mySheet'],
    Sheets: {
      mySheet: Object.assign({}, output, {
        '!ref': ref,
        '!cols': [{ wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }],
      }),
    },
  };
  import('xlsx').then(({ default: XLSX }) => {
    XLSX.writeFile(wb, fileName);
  });
};

export function exportEmployeesFail(
  headers: EmployeeTableColumn[],
  data: Employee[],
  fileName: string,
) {
  const _headers = headers
    .map((item, i) =>
      Object.assign(
        {},
        {
          key: item.key,
          title: item.title,
          position: String.fromCharCode(65 + i) + 1,
        },
      ),
    )
    .reduce(
      (prev: any, next: any) =>
        Object.assign({}, prev, {
          [next.position]: { key: next.key, v: next.title },
        }),
      {},
    );

  const _data = data
    .map((item: any, i: any) =>
      headers.map((key: any, j: any) =>
        Object.assign(
          {},
          {
            content: item[key.key],
            position: String.fromCharCode(65 + j) + (i + 2),
          },
        ),
      ),
    )
    .reduce((prev: any, next: any) => prev.concat(next))
    .reduce(
      (prev: any, next: any) =>
        Object.assign({}, prev, { [next.position]: { v: next.content } }),
      {},
    );
  const output = Object.assign({}, _headers, _data);
  const outputPos = Object.keys(output);
  const ref = `${outputPos[0]}:${outputPos[outputPos.length - 1]}`;
  const wb = {
    SheetNames: ['mySheet'],
    Sheets: {
      mySheet: Object.assign({}, output, {
        '!ref': ref,
        '!cols': [{ wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }],
      }),
    },
  };
  import('xlsx').then(({ default: XLSX }) => {
    XLSX.writeFile(wb, fileName);
  });
}

const imgBgColors: string[] = ['#6366F1', '#F59E0B', '#10B981', '#F97316',
  '#A855F7', '#14B8A6', '#EF4444', '#06B6D4'];

export const getImgColor = (text: string, colors = imgBgColors) => {
  const reg = /^[a-zA-Z]*$/;
  let _text = text;
  if (reg.test(text)) {
    _text = text.toUpperCase();
  }
  const num: number = _text.charCodeAt(0) % 8;
  return {
    name: _text,
    color: colors[num],
  };
};
