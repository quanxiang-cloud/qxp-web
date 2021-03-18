import XLSX from 'xlsx';

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
    // 对刚才的结果进行降维处理（二维数组变成一维数组）
    .reduce((prev: any, next: any) => prev.concat(next))
    // 转换成 worksheet 需要的结构
    .reduce(
      (prev: any, next: any) => Object.assign({}, prev, { [next.position]: { v: next.content } }),
      {},
    );
  // 合并 headers 和 data
  const output = Object.assign({}, _headers, _data);
  // 获取所有单元格的位置
  const outputPos = Object.keys(output);
  // 计算出范围 ,["A1",..., "H2"]
  const ref = `${outputPos[0]}:${outputPos[outputPos.length - 1]}`;
  // 构建 workbook 对象
  const wb = {
    SheetNames: ['mySheet'],
    Sheets: {
      mySheet: Object.assign({}, output, {
        '!ref': ref,
        '!cols': [{ wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }],
      }),
    },
  };
  // 导出 Excel
  XLSX.writeFile(wb, fileName);
};
