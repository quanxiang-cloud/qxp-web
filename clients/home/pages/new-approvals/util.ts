/* eslint-disable max-len */
/* eslint-disable guard-for-in */
import { getAllProcessInfo, getMyApplyPipelineFillInList, getMyApplyPipelineList, getPipelineAllFillInList, getPipelineAllList, getPipelineAppInfo, getPipelineFormData, getPipelineFormSchemaInfo, getPipelineInfo, getPipelineMyReviewedFillInList, getPipelineMyReviewedList, getPipelineTodoFillInList, getPipelineUserInfo, getPipelineWaitReviewList } from './api';

const getAppName = (data: any)=>{
  return getPipelineAppInfo(data?.map((item: any)=>item?.appID))
    .then((res)=>{
      return res;
    })
    .catch((err)=>{
      return null;
    });
};

const getUserName = (data: any)=>{
  return getPipelineUserInfo(data?.map((item: any)=>item?.createdBy))
    .then((res)=>{
      return res;
    })
    .catch((err)=>{
      return null;
    });
};

const getPipelineInfoList = (data: any)=>{
  return Promise.all(data?.map((item: any)=>{
    return getPipelineInfo(item?.flowID)
      .then((res: any)=>{
        try {
          return { ...res, ID: item?.id };
        } catch (error) {
          return res;
        }
      })
      .catch((err)=>{
        return null;
      });
  }));
};

const getPipelineFormInfoList = (data: any, type: any)=>{
  return Promise.all(data?.map((item: any)=>{
    return getPipelineFormData(
      item?.appID,
      item?.formTableID,
      {
        query: {
          term: {
            _id: item?.formDataID,
          },
        },
        ref: {},
      },
    ).then((res: any)=>{
      // return res?.entity;
      return res;
    }).catch((err) => {
      return null;
    });

    // const apiList: any = {
    //   approval: getPipelineFormInfo,
    //   fillIn: getPipelineFillInFormInfo,
    // };
    // return apiList?.[type]({ id: item?.id })
    //   .then((res: any)=>{
    //     try {
    //       return { ...res, ID: item?.id };
    //     } catch (error) {
    //       return res;
    //     }
    //   })
    //   .catch((err)=>{
    //     return null;
    //   });
  }));
};

const getPipelineFormSchemaInfoList = (data: any)=>{
  return Promise.all(data?.map((item: any)=>{
    return getPipelineFormSchemaInfo(item?.appID, item?.formTableID)
      .then((res: any)=>{
        try {
          return { ...res, ID: item?.id };
        } catch (error) {
          return res;
        }
      })
      .catch((err)=>{
        return null;
      });
  }));
};

const getArrList = (data: any, type)=>{
  const arrList = [];
  // 获取应用名称
  arrList.push(()=>getAppName(data));
  // 获取userName
  arrList.push(()=>getUserName(data));
  // 获取列表流程执行信息
  arrList.push(()=>getPipelineInfoList(data));
  // 获取列表表单信息
  arrList.push(()=>getPipelineFormInfoList(data, type));
  // 获取列表的formSchema
  arrList.push(()=>getPipelineFormSchemaInfoList(data));
  return arrList;
};

const formatData = (data: any, res: any, pipelineType: any, type: any)=>{
  const appNameList = res?.[0]?.apps;
  const userNameList = res?.[1]?.users;
  const pipelineInfo = res?.[2]?.filter((item: any)=>!!item);
  const pipelineFormInfo = res?.[3]?.filter((item: any)=>!!item);
  const pipelineFormSchemaInfo = res?.[4]?.filter((item: any)=>!!item);

  const validFlowID = [...new Set(pipelineInfo?.map((item: any)=>item?.name))];
  const dataList = data?.map((item: any)=>{
    const { id, taskID, userID, createBy, examineType, nodeResult, createdAt, appID, formTableID, formDataID, flowID, nodeDefKey, nodeInfo, createdBy } = item;
    const appName = appNameList?.find((item: any)=>{
      return item?.id === appID;
    })?.appName;

    const creatorName = userNameList?.find((item: any)=>{
      return item?.id === createdBy;
    })?.name;

    const flowName = pipelineInfo?.find((item: any)=>{
      return item?.ID === id;
    })?.displayName;

    const keyFields = pipelineInfo?.find((item: any)=>{
      return item?.ID === id;
    })?.config?.keyFields?.split(',');

    const formData = pipelineFormInfo?.find((item: any)=>{
      return item?._id === formDataID;
    });

    const formSchema = pipelineFormSchemaInfo?.find((item: any)=>{
      return item?.ID === id;
    })?.schema;

    const getName = ()=>{
      if (pipelineType === 'fillIn') {
        if (type === 'Pending') {
          return '填写';
        } else {
          return flowName;
        }
      } else {
        if (type === 'Pending') {
          return '审批';
        } else {
          return flowName;
        }
      }
    };

    const getDescription = ()=>{
      if (type === 'Pending') {
        return 'REVIEW';
      } else {
        return '';
      }
    };

    const getStatus = ()=>{
      if (type === 'Pending') {
        return 'REVIEW';
      } else {
        const mapStatus: any = {
          agree: 'AGREE',
          reject: 'REFUSE',
          recall: 'CANCEL',
          fill: '',
        };
        return mapStatus?.[item?.result] || (item?.result !== 'fill' ? 'REVIEW' : '');
      }
    };

    const processInstanceId = taskID;
    const _pipelineInfo = pipelineInfo?.find((item: any)=>{
      return item?.ID === id;
    });
    const obj = {
      ...item,
      id,
      taskDefKey: nodeDefKey,
      procInstId: taskID,
      actInstId: '',
      name: getName(),
      description: getDescription(),
      owner: '',
      assignee: '',
      startTime: createdAt,
      endTime: '',
      duration: 0,
      dueDate: '',
      formData,
      creatorName,
      appName,
      keyFields,
      formSchema,
      processInstanceId,
      status: getStatus(),
      flowInstanceEntity: {
        formData,
        creatorName,
        appName,
        name: flowName,
        keyFields,
        formSchema,
        status: getStatus(),
        processInstanceId,
      },
      urgeNum: 0,
      handled: 'ACTIVE',
      pipelineInfo: _pipelineInfo,
    };
    return obj;
  });
  return { dataList, validFlowID };
};

export const formatApprovalTaskCard = async (query: any, type?: any)=>{
  const apiList: any = {
    Pending: getPipelineWaitReviewList,
    Finish: getPipelineMyReviewedList,
    myApply: getMyApplyPipelineList,
    all: getPipelineAllList,
  };
  let params;
  if (type === 'myApply') {
    params = getApplyParams(query);
  } else {
    params = query;
  }
  const { data, total } = await apiList[type](params) as any; // 获取审批列表
  const arrList = getArrList(data || [], 'approval');
  const res = await Promise.all(arrList?.map((item: any)=>item()));
  const { dataList, validFlowID } = formatData(data, res, 'approval', type); // 格式化 data
  return { dataList, total, validFlowID };
};

export const formatFillInTaskCard = async (query: any, type: any)=>{
  const apiList: any = {
    Pending: getPipelineTodoFillInList,
    Finish: getPipelineMyReviewedFillInList,
    myApply: getMyApplyPipelineFillInList,
    all: getPipelineAllFillInList,
  };
  let params;
  if (type === 'myApply') {
    params = getApplyParams(query);
  } else {
    params = query;
  }
  const { data, total } = await apiList[type](params) as any; // 获取填写列表
  const arrList = getArrList(data || [], 'fillIn');
  const res = await Promise.all(arrList?.map((item: any)=>item()));
  const { dataList, validFlowID } = formatData(data, res, 'fillIn', type); // 格式化 data
  return { dataList, total, validFlowID };
};

// 格式化pipeline 动态
export const getAllPipelineProcess = async (approvalProcess: any, fillInProcess: any)=>{
  let flowID: any;
  if (approvalProcess?.length || fillInProcess?.length) {
    flowID = approvalProcess?.[0]?.flowID || fillInProcess?.[0]?.flowID;
  }

  let createdBy: any;
  const approvalUserIds = approvalProcess?.map((item: any)=>{
    createdBy = createdBy || item?.createdBy;
    return item?.userID || item?.createdBy;
  }) || [];
  const fillUserIds = fillInProcess?.map((item: any)=>{
    createdBy = createdBy || item?.createdBy;
    return item?.userID || item?.createdBy;
  }) || [];
  const userIds = [...approvalUserIds, ...fillUserIds];
  userIds?.push(createdBy);

  const getFlowName = ()=>{
    return flowID ? getPipelineInfo(flowID) : '';
  };
  const getUserInfo = ()=>{
    return getPipelineUserInfo(userIds);
  };

  const arr: any = [getFlowName, getUserInfo];

  return Promise.all(arr.map((item: any)=> item())).then((res: any)=>{
    const flowInfo = res?.[0];
    const userInfo = res?.[1]?.users;
    const flowName = flowInfo?.displayName;
    const mapTaskType: any = {
      or: 'OR_APPROVAL',
      and: 'AND_APPROVAL',
    };
    const mapStatus: any = {
      agree: 'AGREE',
      reject: 'REFUSE',
      recall: 'CANCEL',
      fill: 'FILL',
    };

    const getFormatData = (items: any, type: any, operationRecordsObj: any, flowInfo: any, flowFinish?: any)=>{
      const item = items?.[0];
      const nodeDefKey = items?.[0]?.nodeDefKey;
      const nodeDefKeyNodes = items?.filter((item: any)=>item?.nodeDefKey === nodeDefKey);
      // const item = nodeDefKeyNodes?.find((node: any)=>node?.userID === window?.USER?.id);
      const nodeInfo = JSON.parse(operationRecordsObj?.[item?.nodeDefKey]?.[0]?.nodeInfo || null);
      const curentNode = flowInfo?.spec?.nodes?.find((node: any)=>node?.name === item?.nodeDefKey);
      const curentNodeName = curentNode?.Metadata?.Annotations?.['web.pipelineNode/name'];
      const operationRecords = operationRecordsObj?.[item?.nodeDefKey]?.map((item: any)=>{
        const opCreatorId = userInfo?.find((user: any)=>user?.id === item?.userID)?.id;
        const opCreatorName = userInfo?.find((user: any)=>user?.id === item?.userID)?.name;
        return {
          handleType: item?.result ? mapStatus?.[item?.result] : 'UNTREATED',
          modifyTime: item?.updatedAt,
          remark: item?.remark,
          creatorId: opCreatorId,
          creatorName: opCreatorName,
          creatorAvatar: '',
          createTime: '',
          handleDesc: '',
          status: '',
        };
      });
      const isNodesResultFinish = !nodeDefKeyNodes?.find((node: any)=>node?.nodeResult !== 'Finish');
      const _result = items?.find((itm: any)=>itm?.result)?.result;
      flowFinish && (flowFinish.isNodesResultFinish = isNodesResultFinish);
      const _modifyTime = items?.find((itm: any)=>itm?.updatedAt)?.updatedAt;
      const taskName = curentNodeName || nodeInfo?.data?.nodeData?.name;
      const _taskType = type === 'approval' ? mapTaskType?.[item?.examineType] : 'FILL';
      let _status = isNodesResultFinish ? mapStatus?.[_result] : 'REVIEW';
      if (_taskType === 'AND_APPROVAL') {
        const hasRefuse = operationRecords?.find((item: any)=>item?.handleType === 'REFUSE');
        hasRefuse && (_status = 'REFUSE');
      }
      return {
        ...item,
        flowName,
        creatorName: userInfo?.find((user: any)=>user?.id === item?.createdBy)?.name,
        // taskName: type === 'approval' ? '审批' : '填写',
        taskName: taskName || (type === 'approval' ? '审批' : '填写'),
        taskType: _taskType,
        operationRecords,
        // status: mapStatus?.[_result] || 'REVIEW',
        status: _status,
        modifyTime: _modifyTime,
        nodeResult: isNodesResultFinish ? 'Finish' : 'Pending',
      };
    };
    const operationRecordsObj: any = {};
    approvalProcess?.forEach((item: any)=>{
      if (operationRecordsObj[item?.nodeDefKey]) {
        operationRecordsObj[item?.nodeDefKey].push(item);
      } else {
        operationRecordsObj[item?.nodeDefKey] = [item];
      }
    });
    const _approvalProcessList = [];
    for (const key in operationRecordsObj) {
      _approvalProcessList.push(operationRecordsObj?.[key]);
    }
    const flowFinish = {
      isNodesResultFinish: false,
    };
    const _approvalProcess = _approvalProcessList?.map(((item: any, index: any)=>{
      return getFormatData(item, 'approval', operationRecordsObj, flowInfo, index === 0 && flowFinish);
    })) || [];

    const fillOperationRecordsObj: any = {};
    fillInProcess?.forEach((item: any)=>{
      if (fillOperationRecordsObj[item?.nodeDefKey]) {
        fillOperationRecordsObj[item?.nodeDefKey].push(item);
      } else {
        fillOperationRecordsObj[item?.nodeDefKey] = [item];
      }
    });
    const _fillInProcessList = [];
    for (const key in fillOperationRecordsObj) {
      _fillInProcessList.push(fillOperationRecordsObj?.[key]);
    }
    const _fillInProcess = _fillInProcessList?.map(((item: any, index: any)=>{
      return getFormatData(item, 'fillIn', fillOperationRecordsObj, flowInfo, index === 0 && flowFinish);
    })) || [];

    const allProcess = [..._approvalProcess, ..._fillInProcess].sort((a, b)=>b?.createdAt - a?.createdAt);

    const getIsFinish = (items: any)=>{
      const nodeDefKey = items?.[0]?.nodeDefKey;
      const nodeDefKeyNodes = items?.filter((item: any)=>item?.nodeDefKey === nodeDefKey);
      const isFinsih = !nodeDefKeyNodes?.find((node: any)=>node?.nodeResult !== 'Finish');
      return isFinsih;
    };

    const item = allProcess?.[0] || {};
    const startNode = {
      id: '',
      flowName: flowName,
      createTime: item?.createdAt,
      creatorName: item?.creatorName,
      taskType: 'START',
      status: 'SUBMIT',
      operationRecords: [{
        id: '',
        creatorId: item?.createdBy,
        creatorName: item?.creatorName,
        handleUserID: item?.createdBy,
        status: 'COMPLETE',
        handleType: '发起流程',
      }],
      taskName: '',
      remark: '',
      modifyTime: '',
      reason: '',
    };
    const endNode = {
      id: '',
      flowName: '',
      createTime: item?.updatedAt,
      creatorName: item?.creatorName,
      modifyTime: item?.updatedAt,
      taskType: 'END',
      status: 'END',
      operationRecords: null,
      taskName: '结束',
      remark: '',
      reason: '',
    };
    const isFinsih = allProcess?.[0]?.nodeResult === 'Finish';
    // const isFinsih = flowFinish?.isNodesResultFinish;
    // const isFinsih = getIsFinish(allProcess);

    allProcess.push(startNode);
    isFinsih && allProcess.unshift(endNode);
    return allProcess;
  }).catch((err: any)=>{
    console.log('err', err);
  });
};

export const getApplyParams = (query: any)=>{
  const StartTime = query.beginDate ? (new Date(`${query.beginDate} 00:00:00`).getTime() ) : null;
  const EndTime = query.beginDate ? ((new Date(`${query.endDate} 00:00:00`).getTime() ) + ((24 * 60 * 60 * 1000) - 1)) : null;

  let NodeResult; let TaskResult;
  if (query.status === 'REVIEW' || query.status === 'Pending') {
    NodeResult = 'Pending';
  } else if (query.status === 'REFUSE' || query.status === 'AGREE' || query.status === 'CANCEL' || query.status === 'Finish' ) {
    NodeResult = 'Finish';
    if (query.status === 'REFUSE') {
      TaskResult = 'reject';
    }
    if (query.status === 'AGREE') {
      TaskResult = 'agree';
    }

    if (query.status === 'CANCEL') {
      TaskResult = 'recall';
    }
  }
  const res = {
    page: query.page,
    limit: query.size || 10,
    startTime: StartTime,
    endTime: EndTime,
    nodeResult: NodeResult,
    taskResult: TaskResult,
  };
  return res;
};

export const updateFinish = async (dataList: any, validFlowID: any) => {
  const _dataList = dataList?.filter((item: any)=>validFlowID?.includes(item?.flowID));
  const updatePromises = _dataList.map(async (item: any) => {
    const { procInstId } = item || {};
    const processInfo = await getAllProcessInfo(procInstId);
    const pipelineProcess = await getAllPipelineProcess(processInfo?.[0]?.Data, processInfo?.[1]?.data);
    const isFinish = pipelineProcess?.[0]?.status === 'END';
    item.isFinish = isFinish;
  });
  await Promise.all(updatePromises);
};
