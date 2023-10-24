import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';

type Props = {
  associativeRules: FormBuilder.DataAssignment[],
  rulesOptions: any,
}

function LinkText({ text }: { text: string | undefined }): JSX.Element {
  return (
    <span className="text-center flex-1">
      {!text ? <span style={{ color: 'red' }}>关联被删除</span> : text}
    </span>
  );
}

function AssociativeRuleList(props: Props): JSX.Element {
  const { associativeRules, rulesOptions } = props;

  const [dataList, setDataList] = useState<any>([]);

  useEffect(()=>{
    const _dataList = associativeRules.map(({ dataTarget, match, dataSource, dataSourceID }: any) => {
      const _arr = dataSourceID.split('.');
      const item = rulesOptions?.find(({ value }: any) => value === _arr?.[0]);
      const child = item?.children?.find(({ value }: any) => value === _arr?.[1]);
      const dataSourceText = [item?.label, child?.label]?.join('/');
      return {
        dataTarget, match, dataSource, dataSourceID, dataSourceText,
      };
    });
    setDataList(_dataList);
  }, [associativeRules, rulesOptions]);

  return (
    <div className="my-8 w-full">
      <div className="flex">
        <span className="text-center flex-1">关联表单字段</span>
        <span className="text-center mx-8 match-icon">{'=>'}</span>
        <span className="text-center flex-1">当前表单字段</span>
      </div>
      <div className="overflow-auto mt-8">
        {dataList.map(({ dataTarget, match, dataSource, dataSourceText }: any) => {
          return (
            <div
              className="my-4 flex"
              key={`${dataSource}_${match}_${dataTarget}`}
            >
              <LinkText text={dataSource || dataSourceText} />
              <span className="text-center mx-8 match-icon">{'=>'}</span>
              <LinkText text={dataTarget} />

              {/* <span className="text-center flex-1">{`${dataTarget}`}</span> */}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default observer(AssociativeRuleList);
