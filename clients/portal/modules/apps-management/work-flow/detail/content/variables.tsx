import React from 'react';

import TextHeader from '@c/text-header';
import Card from '@c/card';
import Table from '@c/table';
import Icon from '@c/icon';
import { copyToClipboard } from '@lib/utils';

export default function Variables() {
  function getHeader(name: string) {
    return (
      <span className="text-body-no-color text-gray-400">{name}</span>
    );
  }

  function getCell(model: any) {
    return (
      <div className="flex items-center">
        <span className="mr-8">{model.cell.value}</span>
        <Icon
          name="content_copy"
          className="cursor-pointer"
          onClick={() => copyToClipboard(model.cell.value, '标识已复制')}
        />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      <TextHeader
        className="h-56 items-center flex px-20 bg-gray-1000
        shadow-header text-gray-900 mb-20 pb-0"
        title="工作流变量"
        titleClassName="text-h5"
        descClassName="text-caption mt-1"
        desc="一段介绍工作流变量是什么的文本"
        action={(
          <div className="text-underline text-body2 cursor-pointer">如何使用变量</div>
        )}
      />
      <Card className="self-center rounded-12 overflow-hidden px-24 py-16 mb-100 w-full max-w-%90">
        <Table
          rowKey="id"
          columns={[{
            Header: () => getHeader('名称'),
            accessor: 'name',
          }, {
            Header: () => getHeader('标识'),
            accessor: 'value',
            Cell: (model: any) => getCell(model),
          }, {
            Header: () => getHeader('注释'),
            accessor: 'comment',
          }]}
          data={[{
            name: '发起人',
            value: '${bmp_originator1}',
            comment: '一句话说明',
            id: '1',
          }, {
            name: '发起人',
            value: '${bmp_originator1}',
            comment: '一句话说明',
            id: '2',
          }, {
            name: '发起人',
            value: '${bmp_originator1}',
            comment: '一句话说明',
            id: '3',
          }]}
        />
      </Card>
    </div>
  );
}
