type Column = {
  title: string;
  key: string;
};

export const excelHeader: Column[] = [
  {
    title: '姓名',
    key: 'userName',
  },
  {
    title: '手机号',
    key: 'phone',
  },
  {
    title: '邮箱',
    key: 'email',
  },
  {
    title: '部门',
    key: 'depName',
  },
];

export const exportDepExcel = (headers: Column[], data: any[], fileName: string) => {
  const _headers = headers
    .map((item: Column, i: number) =>
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
        '!cols': [{ wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }],
      }),
    },
  };
  import('xlsx').then(({ default: XLSX }) => {
    XLSX.writeFile(wb, fileName);
  });
};

const imgBgColors: string[] = ['#6366F1', '#F59E0B', '#10B981', '#F97316',
  '#A855F7', '#14B8A6', '#EF4444', '#06B6D4'];

export const getImgColor = (text: string, colors = imgBgColors) => {
  let _text = text;
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
