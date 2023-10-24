// todo refactor

// /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/im  (except - and _)
// eslint-disable-next-line
export const SpecialSymbolsReg = /[`~!@#$%^&*()\+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\+={}|《》？：“”【】、；‘'，。、]/im;

export const PhoneReg = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;

export const excelHeader: any[] = [
  {
    Header: '姓名',
    id: 'name',
    accessor: 'name',
  },
  {
    Header: '手机号码',
    id: 'phone',
    accessor: 'phone',
  },
  {
    Header: '邮箱',
    id: 'email',
    accessor: 'email',
  },
  {
    Header: '部门',
    id: 'department',
    accessor: 'department',
  },
  {
    Header: '岗位',
    id: 'position',
    accessor: 'position',
  },
  {
    Header: '直属上级',
    id: 'leader',
    accessor: 'leader',
  },
  {
    Header: '工号',
    id: 'jobNumber',
    accessor: 'jobNumber',
  },
  // {
  //   Header: '员工姓名',
  //   id: 'userName',
  //   accessor: 'userName',
  // },
  // {
  //   Header: '所属部门',
  //   id: 'depName',
  //   accessor: 'depName',
  // },
  // {
  //   Header: '手机号码',
  //   id: 'phone',
  //   accessor: 'phone',
  // },
  // {
  //   Header: '邮箱',
  //   id: 'email',
  //   accessor: 'email',
  // },
  // {
  //   Header: '上级领导',
  //   id: 'leaderName',
  //   accessor: 'leaderName',
  // },
];

export const exportEmployees = (data: Employee[]): void => {
  const headers = excelHeader;
  const fileName = '人员列表.xlsx';
  const _headers = headers
    .map((item, i: number) =>
      Object.assign(
        {},
        {
          key: item.id,
          title: item.Header,
          position: String.fromCharCode(65 + i) + 1,
        },
      ),
    )
    ?.reduce(
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
            content: item[key.id],
            position: String.fromCharCode(65 + j) + (i + 2),
          },
        ),
      ),
    )
    ?.reduce((prev: any, next: any) => prev.concat(next))
    ?.reduce(
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
  headers: any[],
  data: Employee[],
  fileName: string,
): void {
  const _headers = headers
    .map((item, i) =>
      Object.assign(
        {},
        {
          key: item.id,
          title: item.Header,
          position: String.fromCharCode(65 + i) + 1,
        },
      ),
    )
    ?.reduce(
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
            content: item[key.id],
            position: String.fromCharCode(65 + j) + (i + 2),
          },
        ),
      ),
    )
    ?.reduce((prev: any, next: any) => prev.concat(next))
    ?.reduce(
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

export const getImgColor = (text: string, colors = imgBgColors): {name: string, color: string} => {
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

export function buildGraphQLQuery(params: any): number | string {
  if (typeof params === 'number') {
    return params;
  }

  if (typeof params !== 'object' || Array.isArray(params)) {
    return JSON.stringify(params);
  }

  const props = Object.entries(params).map(([key, value]) => `${key}:${buildGraphQLQuery(value)}`).join(',');

  return `query(${props})`;
}

