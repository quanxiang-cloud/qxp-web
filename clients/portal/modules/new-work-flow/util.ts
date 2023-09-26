/* eslint-disable no-empty */
/* eslint-disable no-param-reassign */
/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable guard-for-in */
/* eslint-disable max-len */
/* eslint-disable no-case-declarations */
/* eslint-disable no-tabs */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-plusplus */
import { isArray, isString } from 'lodash';
import { createTrigger, deleteTrigger, getTriggerInfo } from './api';
import { uuid } from '@lib/utils';
import { buildGraphQLQuery } from '../access-control/departments-employees/utils';
import { searchUser } from '@c/form-builder/registry/user-picker/messy/api';
import httpClient from '@lib/http-client';
import { CURRENT_WORK_FLOW_VERSION } from './content/editor/utils/constants';

const ProcessBranch = 'process-branch';
const ProcessSource = 'process-source';
const ProcessTarget = 'process-target';

// 获取 tableID
const getTableID = (data: Array<any>)=>{
  return data?.filter((item: any)=>item?.type === 'formData')?.[0]?.data?.businessData?.form?.value;
};

//  get node
const getNode = (data: any, id: string) => {
  return data?.shapes?.filter((item: any)=>{
    return item?.id === id;
  })?.[0];
};

// 获取用户信息
const getUserInfo = async (item: any) => {
  const email = item.replace('email.', '');
  const params = {
    email: email || '',
    page: 1,
    size: 999,
  };
  const queryGraphQL = buildGraphQLQuery(params);
  const userGraphQL = '{users{id,phone,useStatus,email,name,useStatus,departments{id,name},leaders{id,name}},total}';
  return searchUser({ query: `{${queryGraphQL}${userGraphQL}}` }).then((res: any) => {
    const user = res?.users?.find((item: any)=>{
      return item?.useStatus === 1;
    }) || {};
    const dep = user?.departments?.[0] || {};
    return {
      type: 1,
      ownerID: user.id,
      ownerName: user.name,
      phone: user.phone,
      email: user.email,
      departmentName: dep.name,
      createdAt: -1,
      id: user.id,
      departmentID: dep.id,
    };
  });
};

// 获取 pepeline nodes bpmn转换成pipeline
const bpmnToPipepline = (data: any, flowData: any, communal: any)=>{
  const nodesList = data?.shapes || [];
  const firstNode = nodesList?.filter((item: any)=>item?.type === 'formData')?.[0];
  const nodes = [firstNode];
  const nodeID: any = {};
  const pipelineNode: any = [];
  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index];
    if (nodeID[node?.id]) {
      continue;
    }
    nodeID[node?.id] = {};
    const pn: any = {
      name: node?.id,
      Metadata: {
        Annotations: {
          'web.pipelineNode/name': node?.data?.nodeData?.name,
          'web.pipelineNode/newWorkflow': 'true',
          'web.pipelineNode/branchTargetElementID': node?.data?.nodeData?.branchTargetElementID,
          'web.pipelineNode/parentID': JSON.stringify(node?.data?.nodeData?.parentID),
          'web.pipelineNode/childrenID': JSON.stringify(node?.data?.nodeData?.childrenID),
          'web.pipelineNode/branchID': node?.data?.nodeData?.branchID,
          'web.pipelineNode/parentBranchTargetElementID': node?.data?.nodeData?.parentBranchTargetElementID,
        },
      },
      spec: {
        type: undefined,
        params: [], // key value
        output: [],
        when: [],
      },
    };
    const commonParams = [
      {
        key: 'appID',
        value: '$(params.appID)',
      },
      {
        key: 'tableID',
        value: '$(params.tableID)',
      },
      {
        key: 'dataID',
        value: '$(params.dataID)',
      },
    ];
    switch (node?.type) {
    case 'end':
      if (nodes.length === 1) {
        break;
      }
      continue;
    case 'email':
      pn.spec.type = 'email';
      pn.spec.params = [
        ...commonParams,
      ];

      if (node?.data?.businessData?.['title']) {
        pn.spec.params.push({
          key: 'title',
          value: node?.data?.businessData?.['title'],
        });
      }

      if (node?.data?.businessData?.['content']) {
        pn.spec.params.push({
          key: 'content',
          value: node?.data?.businessData?.['content'],
        });
      }

      const approvePersons = node?.data?.businessData?.['approvePersons'];
      if (approvePersons?.['type']) {
        switch (approvePersons['type']) {
        case 'person':
          const users = approvePersons.users.map((user: any) => `email.${user.email}`);
          pn.spec.params.push({
            key: 'to',
            value: users.join(','),
          });
          pn.spec.params.push;
          break;
        case 'field':
          for (const field of approvePersons.fields) {
            pn.spec.params.push({
              key: 'to',
              value: `fields.${field}`,
            });
          }
          break;
        case 'superior':
          pn.spec.params.push({
            key: 'to',
            value: 'superior',
          });
          break;
        case 'processInitiator':
          pn.spec.params.push({
            key: 'to',
            value: 'processInitiator',
          });
          break;
        case 'processVariable':
          pn.spec.params.push({
            key: 'to',
            value: approvePersons?.variablePath,
          });
          break;
        }
      }

      break;
    case 'approve':
      pn.spec.type = 'approve';
      pn.spec.output = ['agree'];
      pn.spec.params = [
        ...commonParams,
        {
          key: 'flowID',
          value: flowData?.id,
        },
        {
          key: 'nodeDefKey',
          value: node?.id,
        },
        {
          key: 'flowCreatedBy',
          value: window?.USER?.id,
        },
      ];
      // TODO: 添加工作流变量
      const flowVars: any = window.PipelineFlowData?.variable || [];
      for (let k1 = 0; k1 < flowVars?.length; k1++) {
        if (flowVars?.[k1].name === 'SYS_AUDIT_BOOL') {
          pn.spec.params.push({
            key: 'SYS_AUDIT_BOOL',
            value: flowVars?.[k1].code,
          });
        }
        pn.spec.params.push({
          key: flowVars?.[k1].code,
          value: `$(communal.${flowVars?.[k1].code})`,
        });
      }
      const dealUsers = [];
      if (node?.data?.businessData?.basicConfig !== undefined && typeof node?.data?.businessData?.basicConfig === 'object') {
        pn.spec.params.push({
          key: 'taskType',
          value: node?.data?.businessData?.basicConfig?.multiplePersonWay,
        });

        if (node?.data?.businessData?.basicConfig?.approvePersons !== undefined && typeof node?.data?.businessData?.basicConfig?.approvePersons === 'object') {
          switch (node?.data?.businessData?.basicConfig?.approvePersons?.type) {
          case 'person':
            if (Array.isArray(node?.data?.businessData?.basicConfig?.approvePersons?.users)) {
              for (const k in node?.data?.businessData?.basicConfig?.approvePersons?.users) {
                const u = node?.data?.businessData?.basicConfig?.approvePersons?.users[k];
                if (u !== undefined && typeof u === 'object') {
                  dealUsers.push('person.' + u.id);
                }
              }
            }
            break;
          case 'field':
            if (Array.isArray(node?.data?.businessData?.basicConfig?.approvePersons?.fields)) {
              for (const k in node?.data?.businessData?.basicConfig?.approvePersons?.fields) {
                dealUsers.push('field.' + node?.data?.businessData?.basicConfig?.approvePersons?.fields[k]);
              }
            }
            break;
          case 'superior':
            dealUsers.push('leader');
            break;
          case 'processInitiator':
            dealUsers.push('formApplyUserID');
            break;
          }
        }
      }

      pn.spec.params.push({
        key: 'dealUsers',
        value: dealUsers.join(','),
      });
      pn.spec.params.push({
        key: 'nodeInfo',
        value: JSON.stringify(node),
      });
      break;
    case 'fillIn':
      pn.spec.type = 'fill';
      pn.spec.output = ['agree'];
      pn.spec.params = [
        ...commonParams,
        {
          key: 'flowID',
          value: flowData?.id,
        },
        {
          key: 'nodeDefKey',
          value: node?.id,
        },
        {
          key: 'flowCreatedBy',
          value: window?.USER?.id,
        },
      ];
      const fillUsers = [];
      if (node?.data?.businessData?.basicConfig?.fillInPersons !== undefined && typeof node?.data?.businessData?.basicConfig?.fillInPersons === 'object') {
        switch (node?.data?.businessData?.basicConfig?.fillInPersons?.type) {
        case 'person':
          if (Array.isArray(node?.data?.businessData?.basicConfig?.fillInPersons?.users)) {
            for (const k in node?.data?.businessData?.basicConfig?.fillInPersons?.users) {
              const u = node?.data?.businessData?.basicConfig?.fillInPersons?.users[k];
              if (u !== undefined && typeof u === 'object') {
                fillUsers.push('person.' + u.id);
              }
            }
          }
          break;
        case 'field':
          if (Array.isArray(node?.data?.businessData?.basicConfig?.fillInPersons?.fields)) {
            for (const k in node?.data?.businessData?.basicConfig?.fillInPersons?.fields) {
              fillUsers.push('field.' + node?.data?.businessData?.basicConfig?.fillInPersons?.fields[k]);
            }
          }
          break;
        case 'superior':
          fillUsers.push('leader');
          break;
        case 'processInitiator':
          fillUsers.push('formApplyUserID');
          break;
        }
      }
      pn.spec.params.push({
        key: 'dealUsers',
        value: fillUsers.join(','),
      });
      pn.spec.params.push({
        key: 'nodeInfo',
        value: JSON.stringify(node),
      });
      break;
    case 'processBranch':
      pn.spec.type = 'process-branch';
      pn.spec.params = [
        ...commonParams,
      ];
      // if (nodes?.[index - 1]?.type === 'processBranch') {
      //   // processBranchSource
      //   const sourceNode = nodesList?.find((item: any)=>item?.id === node?.data?.nodeData?.parentID?.[0]);
      //   const { branchTargetElementID, childrenID, parentID, branchID, parentBranchTargetElementID } = sourceNode?.data?.nodeData || {};
      //   const nodeInfo: any = {
      //     branchID,
      //     parentID,
      //     childrenID,
      //     branchTargetElementID,
      //     parentBranchTargetElementID,
      //     name: sourceNode?.id,
      //   };
      //   pn.Metadata.Annotations['web.pipelineNode/processBranchSource'] = JSON.stringify(nodeInfo);
      // }
      // if (nodes?.[index + 1]?.type === 'processBranch') {
      //   // processBranchTarget
      //   const targetNode = nodesList?.find((item: any)=>item?.id === node?.data?.nodeData?.branchTargetElementID);
      //   const { branchTargetElementID, childrenID, parentID, branchID, parentBranchTargetElementID } = targetNode?.data?.nodeData || {};
      //   const nodeInfo: any = {
      //     branchID,
      //     parentID,
      //     childrenID,
      //     branchTargetElementID,
      //     parentBranchTargetElementID,
      //     name: targetNode?.id,
      //   };
      //   pn.Metadata.Annotations['web.pipelineNode/processBranchTarget'] = JSON.stringify(nodeInfo);
      // }

      const rule = node?.data?.businessData?.rule;

      if (typeof rule === 'string') {
        const flowVars: any = window.PipelineFlowData?.variable || [];
        for (let k1 = 0; k1 < flowVars?.length; k1++) {
          pn.spec.params.push({
            key: flowVars?.[k1].code,
            value: `$(communal.${flowVars?.[k1].code})`,
          });
        }
      }

      if (node?.data?.businessData?.ignore) {
        pn.Metadata.Annotations['web.pipelineNode/isElseBranch'] = 'true';
        pn.spec.params.push({
          key: 'else',
          value: `$(task.${nodes[index - 1].id}.output.ok)`,
        });
        const nodeParentID = node?.data?.nodeData?.parentID?.[0];
        const sibNodes = nodesList?.filter((item: any)=>{
          return item?.data?.nodeData?.parentID?.[0] === nodeParentID && item?.id !== node?.id;
        });
        const rule = sibNodes?.map((item: any)=>{
          return `[${item?.id}] == false`;
        })?.join(' && ');
        pn.spec.params.push({
          key: 'rule',
          value: rule || '',
        });
      } else {
        pn.spec.params.push({
          key: 'rule',
          value: rule || '',
        });
      }

      // const formulaFields = node?.data?.businessData?.formulaFields;
      // const vByte = JSON.stringify(formulaFields || '');
      // pn.spec.params.push({
      //   key: 'formulaFields',
      //   value: vByte,
      // });

      pn.spec.params.push({
        key: 'ignore',
        value: String(!!node?.data?.businessData?.ignore),
      });

      // pn.spec.params.push({
      //   key: 'branchTargetElementID',
      //   value: node?.data?.nodeData?.branchTargetElementID,
      // });
      break;
    case 'tableDataCreate':
      pn.spec.type = 'form-create-data';
      pn.spec.params = [
        ...commonParams,
        {
          key: 'targetTableID',
          value: node?.data?.businessData?.['targetTableId'],
        },
      ];

      if (node?.data?.businessData?.createRule) {
        const rule = node?.data?.businessData?.createRule;
        const vByte = JSON.stringify(rule);
        pn.spec.params.push({
          key: 'createRule',
          value: vByte,
        });
      }
      if (node?.data?.businessData?.ref) {
        const ref = node?.data?.businessData?.ref;
        const vByte = JSON.stringify(ref);
        pn.spec.params.push({
          key: 'ref',
          value: vByte,
        });
      }
      if (node?.data?.businessData?.normalRequiredField) {
        const normalRequiredField = node?.data?.businessData?.normalRequiredField;
        const vByte = JSON.stringify(normalRequiredField);
        pn.spec.params.push({
          key: 'normalRequiredField',
          value: vByte,
        });
      }
      if (node?.data?.businessData?.subTableRequiredField) {
        const subTableRequiredField = node?.data?.businessData?.subTableRequiredField;
        const vByte = JSON.stringify(subTableRequiredField);
        pn.spec.params.push({
          key: 'subTableRequiredField',
          value: vByte,
        });
      }
      break;
    case 'tableDataUpdate':
      pn.spec.type = 'form-update-data';
      pn.spec.params = [
        ...commonParams,
        {
          key: 'targetTableID',
          value: node?.data?.businessData?.targetTableId,
        },
      ];

      if (node?.data?.businessData?.formType) {
        pn.spec.params.push({
          key: 'formType',
          value: node?.data?.businessData?.formType,
        });
      }

      if (node?.data?.businessData?.selectField) {
        pn.spec.params.push({
          key: 'selectField',
          value: node?.data?.businessData?.selectField,
        });
      }

      if (node?.data?.businessData?.selectFieldType) {
        pn.spec.params.push({
          key: 'selectFieldType',
          value: node?.data?.businessData?.selectFieldType,
        });
      }

      if (node?.data?.businessData?.selectFieldTableId) {
        pn.spec.params.push({
          key: 'selectFieldTableId',
          value: node?.data?.businessData?.selectFieldTableId,
        });
      }

      if (node?.data?.businessData?.updateRule) {
        const rule = node?.data?.businessData?.updateRule;
        const vByte = JSON.stringify(rule);
        pn.spec.params.push({
          key: 'updateRule',
          value: vByte,
        });
      }

      if (node?.data?.businessData?.filterRule) {
        const fileterRule = node?.data?.businessData?.filterRule;
        try {
          const frByte = JSON.stringify(fileterRule);
          pn.spec.params.push({
            key: 'filterRule',
            value: frByte,
          });
        } catch (err) {
          // Handle JSON serialization error
        }
      }

      if (node?.data?.businessData?.formQueryRef) {
        const formQueryRef = node?.data?.businessData?.formQueryRef;
        const vByte = JSON.stringify(formQueryRef);
        pn.spec.params.push({
          key: 'formQueryRef',
          value: vByte,
        });
      }

      break;
    case 'processVariableAssignment':
      pn.spec.type = 'process-variable-assignment';
      pn.spec.params = [
        ...commonParams,
      ];
      if (node?.data?.businessData?.assignmentRules) {
        const assignmentRules = node?.data?.businessData?.assignmentRules;
        try {
          const cb = JSON.stringify(assignmentRules);
          pn.spec.params.push({
            key: 'assignmentRules',
            value: cb,
          });
        } catch (err) {
          // Handle JSON serialization error
        }
      }
      break;
    case 'webhook':
      pn.spec.type = 'web-hook';
      pn.spec.params = [
        ...commonParams,
      ];
      pn.spec.params.push({
        key: 'type',
        value: node?.data?.businessData?.type,
      });
      if (node?.data?.businessData?.config) {
        const config = node?.data?.businessData?.config;
        try {
          const cb = JSON.stringify(config);
          pn.spec.params.push({
            key: 'config',
            value: cb,
          });
        } catch (err) {
          // Handle JSON serialization error
        }
      }
      break;
    }

    if (node?.data?.nodeData?.branchID) {
      if (nodesList?.find((item: any)=>item?.id === node?.data?.nodeData?.branchID)) {
        pn.spec.when = [
          {
            input: `$(task.${node?.data?.nodeData?.branchID}.output.ok)`,
            operator: 'eq',
            values: ['true'],
          },
        ];
      }
    }

    if (pn.spec.type) {
      pipelineNode.push(pn);
    }

    node?.data?.nodeData?.childrenID?.forEach((childID: any)=>{
      nodes.push(getNode(data, childID));
    });
  }
  // pipelineNode.forEach((node: any, index: any)=>{
  //   if (node?.spec?.type === 'process-branch') {
  //     if (pipelineNode?.[index - 1]?.spec?.type !== 'process-branch') {
  //       // processBranchSource
  //       const sourceNode = nodesList?.find((item: any)=>item?.id === JSON.parse(node?.Metadata?.Annotations?.['web.pipelineNode/parentID'] || null)?.[0]);
  //       const { branchTargetElementID, childrenID = [], parentID = [], branchID, parentBranchTargetElementID } = sourceNode?.data?.nodeData || {};
  //       const nodeInfo: any = {
  //         branchID,
  //         parentID,
  //         childrenID,
  //         branchTargetElementID,
  //         parentBranchTargetElementID,
  //         name: sourceNode?.id,
  //       };
  //       node.Metadata.Annotations['web.pipelineNode/processBranchSource'] = JSON.stringify(nodeInfo);
  //     }
  //     if (pipelineNode?.[index + 1]?.spec?.type !== 'process-branch' ) {
  //       // processBranchTarget
  //       const targetNode = nodesList?.find((item: any)=>item?.id === node?.Metadata?.Annotations?.['web.pipelineNode/branchTargetElementID']);
  //       const { branchTargetElementID, childrenID, parentID, branchID, parentBranchTargetElementID } = targetNode?.data?.nodeData || {};
  //       const nodeInfo: any = {
  //         branchID,
  //         parentID,
  //         childrenID,
  //         branchTargetElementID,
  //         parentBranchTargetElementID,
  //         name: targetNode?.id,
  //       };
  //       node.Metadata.Annotations['web.pipelineNode/processBranchTarget'] = JSON.stringify(nodeInfo);
  //     }
  //   }
  // });

  return pipelineNode;
};

// 将新生成的pipeline nodes 转换成 bpmn的 nodes
const pipelineNodesToBpmnNodes = async (pipelineNode: any, params: any)=>{
  // 新工作流新数据
  // const isNewWorkflowData = pipelineNode?.[0]?.Metadata?.Annotations?.['web.pipelineNode/newWorkflow'] === 'true';
  // let newPepelineNodes: any = [];
  // if (isNewWorkflowData) {
  //   newPepelineNodes = getNewWorkflowNodes(pipelineNode); // 根据新工作流生成nodes
  //   // getNewWorkflowNodes(pipelineNode);
  // } else {
  //   newPepelineNodes = getNewPipelineNodes(pipelineNode); // 兼容老工作留的数据
  // }
  const newPepelineNodes = getNewPipelineNodes(pipelineNode); // 兼容老工作留的数据

  const bpmnNodes: any = [];

  for (const item of newPepelineNodes) {
    const result = await generageBpmnNode(item, params);
    bpmnNodes.push(result);
  }
  return bpmnNodes;
};

// TODO: 根据新工作流生成nodes
const getNewWorkflowNodes = (pipelineNode: any)=>{
  const allNodeList: any = [];
  // 根据pipelineNode添加分流 合流 节点 和 nodeData
  pipelineNode?.forEach((item: any)=>{
    const { Annotations } = item?.Metadata || {};
    const processBranchSource = JSON.parse(Annotations?.['web.pipelineNode/processBranchSource'] || null);
    const processBranchTarget = JSON.parse(Annotations?.['web.pipelineNode/processBranchTarget'] || null);
    const childrenID = JSON.parse(Annotations?.['web.pipelineNode/childrenID'] || []);
    const parentID = JSON.parse(Annotations?.['web.pipelineNode/parentID'] || []);
    const branchID = Annotations?.['web.pipelineNode/branchID'];
    const branchTargetElementID = Annotations?.['web.pipelineNode/branchTargetElementID'];
    const parentBranchTargetElementID = Annotations?.['web.pipelineNode/parentBranchTargetElementID'];
    if (processBranchSource) {
      allNodeList.push({
        name: processBranchSource?.name,
        spec: {
          type: ProcessSource,
        },
        branchID: processBranchSource?.branchID,
        parentID: processBranchSource?.parentID,
        childrenID: processBranchSource?.childrenID,
        branchTargetElementID: processBranchSource?.branchTargetElementID,
        parentBranchTargetElementID: processBranchSource?.parentBranchTargetElementID,
      });
    }
    allNodeList.push({
      ...item,
      branchID,
      parentID,
      childrenID,
      branchTargetElementID,
      parentBranchTargetElementID,
    });
    if (processBranchTarget) {
      allNodeList.push({
        name: processBranchTarget?.name,
        spec: {
          type: ProcessTarget,
        },
        branchID: processBranchTarget?.branchID,
        parentID: processBranchTarget?.parentID,
        childrenID: processBranchTarget?.childrenID,
        branchTargetElementID: processBranchTarget?.branchTargetElementID,
        parentBranchTargetElementID: processBranchTarget?.parentBranchTargetElementID,
      });
    }
  });

  const formDataNode = {
    name: allNodeList?.[0]?.parentID?.[0],
    spec: {
      type: 'form-data',
      params: [],
      output: [],
      when: [],
    },
    parentID: [],
    childrenID: [allNodeList?.[0]?.name],
  };
  const endNode = {
    name: allNodeList?.[allNodeList?.length - 1]?.childrenID?.[0],
    spec: {
      type: 'end',
      params: [],
      output: [],
      when: [],
    },
    parentID: [allNodeList?.[allNodeList?.length - 1]?.name],
    childrenID: [],
  };
  return [formDataNode, ...allNodeList, endNode];
};

// 生成pipeline node
const generatePipelineNode = (type: string)=>{
  const nodeID = type + uuid();
  const typeMap: any = {
    formData: 'form-data',
    end: 'end',
  };
  const nodeData = {
    name: nodeID,
    spec: {
      type: typeMap?.[type] || type,
      params: [],
      output: [],
      when: [],
    },
  };
  return nodeData;
};

// 生成有起始节点和分流节点的 pipeline
const getNewPipelineNodes = (pipelineNode: any)=>{
  const formData = generatePipelineNode('formData');
  const end = generatePipelineNode('end');
  // 主干====================
  // 提取主干节点
  // const mainNodesList = [[formData], ...getMainNodes(pipelineNode), [end]];
  const _pipelineNode = isArray(pipelineNode) ? pipelineNode : [];
  const mainNodesList = [...getMainNodes([formData, ..._pipelineNode, end])];
  //  给主干 添加 分流 合流 节点
  let newMainNodesList = addMainBranchNodes(mainNodesList);
  // 分支====================
  //  提取分支节点
  const branchNodesObj = getBranchNodes(_pipelineNode);
  // 将分支节点切分
  let newBranchNodesObj: any = formatBranchNodes(branchNodesObj);
  // 给分支节点添加 分流 合流 节点
  newBranchNodesObj = addProcessBranchNodes(newBranchNodesObj, newMainNodesList);

  //  给 主干 添加 parentId  childrenID
  newMainNodesList = addMainNodesIDs(newMainNodesList, newBranchNodesObj);
  //  给 分支 添加 parentId  childrenID
  const allNodeList = addProcessBranchNodesIDS(newMainNodesList, newBranchNodesObj);

  return allNodeList;
};

// 提取主干节点
const getMainNodes = (pipelineNode: any)=>{
  const mainNodesList: any = [];
  for (let i = 0; i < pipelineNode?.length; i++) {
    if (!pipelineNode[i]?.spec?.when?.length) {
      mainNodesList.push([]);
    }
    const curType = pipelineNode[i]?.spec?.type;
    const preType = pipelineNode[i - 1]?.spec?.type;
    if (curType === ProcessBranch && preType === ProcessBranch && !pipelineNode[i]?.spec?.when?.length) {
      const curBranchTargetElementID = pipelineNode[i]?.Metadata.Annotations?.['web.pipelineNode/branchTargetElementID'];
      const preBranchTargetElementID = pipelineNode[i - 1]?.Metadata.Annotations?.['web.pipelineNode/branchTargetElementID'];
      if (curBranchTargetElementID && preBranchTargetElementID &&
        curBranchTargetElementID !== preBranchTargetElementID
      ) {
        //
      } else {
        (mainNodesList.pop());
      }
    }
    if (!pipelineNode[i]?.spec?.when?.length) {
      mainNodesList?.[mainNodesList.length - 1]?.push(pipelineNode?.[i]);
    }
  }
  return mainNodesList;
};

// 给主干节点添加分流 合流节点
const addMainBranchNodes = (mainNodesList: any)=>{
  const newMainNodesList: any = [];
  mainNodesList.forEach((item: any, index: any)=>{
    if (item.length > 1) {
      const branchSourceElementID = `processBranchSource${uuid()}`;
      const branchTargetElementID = `processBranchTarget${uuid()}`;
      newMainNodesList.push([{
        name: branchSourceElementID,
        spec: {
          type: ProcessSource,
        },
        childrenID: item.map((node: any)=>node.name),
        branchTargetElementID,
      }]);
      newMainNodesList.push(item.map((item: any)=>({ ...item, branchTargetElementID })));
      newMainNodesList.push([{
        name: branchTargetElementID,
        spec: {
          type: ProcessTarget,
        },
        branchSourceElementID,
      }]);
    } else {
      newMainNodesList.push(item);
    }
  });
  return newMainNodesList;
};

// 提取分支节点 (可能是主干下分流的分支， 也有可能是分流下分支的分支)
const getBranchNodes = (pipelineNode: any)=>{
  const branchNodesObj: any = {};
  for (let i = 0; i < pipelineNode.length; i++) {
    if (pipelineNode[i]?.spec?.when?.length) {
      const whenCondition = pipelineNode[i].spec.when[0];
      const parentID = whenCondition.input.match(/task\.(.*?)\.output/)[1];
      if (!branchNodesObj[parentID]) {
        branchNodesObj[parentID] = [];
      }
      branchNodesObj[parentID].push(pipelineNode[i]);
    }
  }
  return branchNodesObj;
};

// 将分支节点切分
const formatBranchNodes = (branchNodesObj: any)=>{
  const newBranchNodesObj: any = {};
  for (const key in branchNodesObj) {
    const pipelineNode = branchNodesObj[key];
    newBranchNodesObj[key] = [];
    for (let i = 0; i < pipelineNode.length; i++) {
      newBranchNodesObj[key].push([]);
      if (pipelineNode[i]?.spec?.type === ProcessBranch &&
          pipelineNode[i - 1]?.spec?.type === ProcessBranch
      ) {
        // const curBranchTargetElementID = pipelineNode[i]?.spec?.params?.find(({ key }: any)=>key === 'branchTargetElementID')?.value;
        // const preBranchTargetElementID = pipelineNode[i - 1]?.spec?.params?.find(({ key }: any)=>key === 'branchTargetElementID')?.value;
        const curBranchTargetElementID = pipelineNode[i]?.Metadata.Annotations?.['web.pipelineNode/branchTargetElementID'];
        const preBranchTargetElementID = pipelineNode[i - 1]?.Metadata.Annotations?.['web.pipelineNode/branchTargetElementID'];
        if (curBranchTargetElementID && preBranchTargetElementID && curBranchTargetElementID !== preBranchTargetElementID) {
        //
        } else {
          newBranchNodesObj[key].pop();
        }
      }
      newBranchNodesObj[key][newBranchNodesObj[key].length - 1].push(pipelineNode[i]);
    }
  }

  return newBranchNodesObj;
};

// 给分支节点添加 分流 合流 节点 (分流下分支的分支)
const addProcessBranchNodes = (newBranchNodesObj: any, mainNodesList: any)=>{
  for (const key in newBranchNodesObj) {
    const pipelineNode = newBranchNodesObj[key];
    pipelineNode.forEach((item: any, index: any)=>{
      if (item.length > 1) {
        const branchSourceElementID = `processBranchSource${uuid()}`;
        const branchTargetElementID = `processBranchTarget${uuid()}`;
        item.forEach((node: any)=> {
          node.parentID = [branchSourceElementID];
          node.branchTargetElementID = branchTargetElementID;
        });
        item.unshift({
          name: branchSourceElementID,
          spec: {
            type: ProcessSource,
          },
          parentID: [key],
          childrenID: item.map((node: any)=>node.name),
          branchTargetElementID,
        });
        item.push({
          name: branchTargetElementID,
          spec: {
            type: ProcessTarget,
          },
          branchSourceElementID,
        });
      }
    });
  }
  return newBranchNodesObj;
};

//  给 主干节点 添加 parentId  childrenID
const addMainNodesIDs = (newMainNodesList: any, newBranchNodesObj: any)=>{
  return newMainNodesList.map((item: any, index: any)=>{
    if (index === newMainNodesList.length - 1) {// 最后一个node
      item.forEach((node: any)=>{
        node.parentID = [newMainNodesList[index - 1]?.[0].name];
        node.childrenID = [];
      });
    } else if (index === 0) {// 第一个node
      item.forEach((node: any)=>{
        node.parentID = [];
        node.childrenID = [newMainNodesList[index + 1]?.[0].name];
      });
    } else {
      if (item[0].spec.type !== ProcessTarget && item[0].spec.type !== ProcessSource && item[0].spec.type !== ProcessBranch) {// 非分流，合流 分支node
        item.forEach((node: any)=>{
          node.parentID = [newMainNodesList[index - 1]?.[0]?.name];
          node.childrenID = [newMainNodesList?.[index + 1]?.[0].name];
        });
      }
      if (item[0].spec.type === ProcessBranch) {// 分支node
        item.forEach((node: any)=>{
          node.parentID = [newMainNodesList[index - 1]?.[0]?.name];
          node.childrenID = [newBranchNodesObj[node?.name]?.[0]?.[0]?.name]; // 分支的child
        });
      }
      if (item[0].spec.type === ProcessSource) {// 分流node
        item[0].parentID = [newMainNodesList[index - 1]?.[0].name];
      }
      if (item[0].spec.type === ProcessTarget) {// 合流node
        item[0].childrenID = [newMainNodesList[index + 1]?.[0]?.name];
        // 最后 找出合流的parentID
        item[0].parentID = [];
      }
    }
    return item;
  });
};

// 给 分支 添加 parentId childrenID branchID branchTargetElementID parentBranchTargetElementID 并返回所有节点
const addProcessBranchNodesIDS = (newMainNodesList: any, newBranchNodesObj: any)=>{
  let newNodesArr: any = [];
  for (const key in newBranchNodesObj) {
    const branchPipeline = newBranchNodesObj[key];
    branchPipeline.forEach((item: any, index: any)=>{
      item.forEach((node: any, idx: any)=>{
        node.branchID = key;
        if (node.spec.type === ProcessTarget) {
          // do nothing
        } else if (index === 0 && idx === 0) {
          node.parentID = [key];
        } else {
          if (idx > 0) {
            node.parentID = [item[idx - 1].name];
          } else {
            if (index > 0) {
              const nodes = branchPipeline[index - 1];
              node.parentID = [nodes?.[nodes.length - 1].name];
            }
          }
        }

        if (idx < item.length - 1) {
          const nodes = item[idx + 1];
          if (node.spec.type !== ProcessSource) {
            node.childrenID = [nodes[nodes?.length - 1]?.name];
          }
        } else if (idx === item.length - 1) {
          if (index === branchPipeline.length - 1) {
            let branchPipelineParentNode: any;
            newMainNodesList.find((item: any)=>{
              return item.find((node: any)=>{
                if (node.name === key) {
                  branchPipelineParentNode = node;
                }
                return node.name === key;
              });
            });
            if (!branchPipelineParentNode && newBranchNodesObj[key]) {
              for (const k in newBranchNodesObj) {
                newBranchNodesObj?.[k]?.forEach((item: any)=>{
                  item.find((node: any)=>{
                    if (node?.name === key) {
                      branchPipelineParentNode = node;
                    }
                    return node?.name === key;
                  });
                });
              }
            }
            node.childrenID = [branchPipelineParentNode?.branchTargetElementID];
          } else {
            node.childrenID = [branchPipeline[index + 1]?.[0]?.name];
          }
        }

        if (item.length > 1) {
          item.forEach((node: any, index: any)=>{
            if (node.spec.type === ProcessBranch) {
              node.parentID = [item[0].name];
              const nodes = newBranchNodesObj[node.name];
              if (nodes) {
                node.childrenID = [nodes?.[0]?.[0].name];
              }
            }
          });
        }
        newNodesArr.push(node);
      });

      newNodesArr.forEach(((node: any)=>{
        if (!node?.childrenID?.filter((val: any)=>!!val).length) {
          newNodesArr.forEach((item: any)=>{
            if (item.name === node?.parentID?.[0]) {
              node.childrenID = [item.branchTargetElementID];
            }
          });
        }
      }));
    });
  }

  // 给合流添加parentID
  const branchTargetObj: any = {};
  newNodesArr.forEach((node: any)=>{
    if (node.spec.type === ProcessTarget) {
      branchTargetObj[node.name] = [];
      newNodesArr.forEach((_node: any)=>{
        if (_node.childrenID[0] === node.name) {
          branchTargetObj[node.name].push(_node.name);
        }
      });
      node.parentID = branchTargetObj[node.name];
    }
  });

  newNodesArr = [];
  for (const key in newBranchNodesObj) {
    const branchPipeline = newBranchNodesObj[key];
    newNodesArr = [...newNodesArr, ...branchPipeline];
  }

  const allNodesList = [...newMainNodesList.flat(), ...newNodesArr.flat()];

  allNodesList.forEach(((node)=>{
    if (!node?.childrenID?.filter((val: any)=>!!val).length) {
      allNodesList.forEach((item)=>{
        if (item.name === node?.parentID?.[0]) {
          node.childrenID = [item.branchTargetElementID];
        }
      });
    }
  }));

  for (const key in newBranchNodesObj) {
    const parentNode = allNodesList.find((item)=>item.name === key);
    const branchPipeline = newBranchNodesObj[key];
    branchPipeline.forEach((item: any)=>{
      item.forEach((node: any)=>{
        if (item.length > 1) {
          node.parentBranchTargetElementID = parentNode?.branchTargetElementID;
        } else {
          node.branchTargetElementID = parentNode?.branchTargetElementID;
        }
      });
    });
  }
  // 给主干下合流添加parentID
  const mainBranchTargetObj: any = {};
  newMainNodesList?.forEach((item: any)=>{
    item.forEach((node: any)=>{
      if (node?.spec?.type === 'process-target') {
        mainBranchTargetObj[node.name] = [];
        allNodesList.forEach((_node: any)=>{
          if (_node.childrenID[0] === node.name) {
            mainBranchTargetObj[node.name].push(_node.name);
          }
        });
      }
    });
  });
  allNodesList.forEach(((node)=>{
    if (mainBranchTargetObj?.[node.name]) {
      node.parentID = mainBranchTargetObj[node.name];
    }
  }));
  return allNodesList;
};

// 根据 type 生成对应的 bpmn node
const generageBpmnNode = async (node: any, params: any)=>{
  const mapType: any = {
    'end': 'end',
    'email': 'email',
    'approve': 'approve',
    'fill': 'fillIn',
    'web-hook': 'webhook',
    'form-data': 'formData',
    'form-update-data': 'tableDataUpdate',
    'form-create-data': 'tableDataCreate',
    'process-branch': 'processBranch',
    'process-source': 'processBranchSource',
    'process-target': 'processBranchTarget',
    'process-variable-assignment': 'processVariableAssignment',

  };
  const type = node?.spec?.type;
  const nodeName = node?.Metadata?.Annotations?.['web.pipelineNode/name'] || '';
  const nodeParams = node?.spec?.params;
  const bpmnNode = {
    id: node.name,
    type: mapType?.[type],
    data: {
      type: mapType?.[type],
      nodeData: {
        name: nodeName,
        parentID: node?.parentID?.filter((id: any)=>id),
        childrenID: node?.childrenID?.filter((id: any)=>id),
        branchTargetElementID: node?.branchTargetElementID, // 分流下的节点有该属性 指向对应的合流节点
        branchID: node?.branchID, // 分支下的节点有该属性 表示在哪个分支上
        parentBranchTargetElementID: node?.parentBranchTargetElementID, // 分流下的分支还有分流的分流节点有该属性 表示分流所在的分流分支上对应的合流节点
      },
      businessData: {
      },
    },
  };
  let businessDataObj: any = {};
  const formTableID = params?.find((item: any)=>item.name === 'tableID')?.default;
  nodeParams?.forEach(({ key, value }: any)=>{
    businessDataObj[key] = value;
  });
  const formNodeData = params?.find((item: any)=>item.name === 'formData');
  try {
    switch (type) {
    case 'form-data': // TODO: 从触发器接口中获取数据？？？
      let data: any;
      try {
        data = JSON.parse(formNodeData?.description);
      } catch (error) {
        // TODO
      }
      if (data) {
        bpmnNode.data.nodeData.name = data?.nodeData?.name;
        bpmnNode.data.businessData = data?.businessData;
      } else {
        const formNodeData = params?.find((item: any)=>item.name === 'tableID');
        const appID = params?.find((item: any)=>item.name === 'appID')?.default;
        const { list }: any = await httpClient(`/api/v1/form/${appID}/m/table/search`);
        const tableID = formNodeData?.default;
        bpmnNode.data.nodeData.name = '工作表触发';
        bpmnNode.data.businessData = {
          form: {
            name: list?.find((item: any)=>item?.tableID === tableID)?.title || '',
            value: formNodeData?.default,
          },
          triggerWay: window?.PipelineWorkflow?.troggerWayList || [],
          whenAlterFields: window?.PipelineWorkflow?.whenAlterFields || [],
          triggerCondition: { op: '', expr: [] },
          events: {},
        };
      }
      break;
    case 'end':
      bpmnNode.data.nodeData.name = '结束';
      break;
    case 'process-source':
      bpmnNode.data.nodeData.name = '分流';
      bpmnNode.data.businessData = {
        processBranchEndStrategy: '',
      };
      break;
    case 'process-target':
      bpmnNode.data.nodeData.name = '合流';
      break;
    case 'process-branch':
      const isElseBranch = node?.Metadata?.Annotations?.['web.pipelineNode/isElseBranch'];
      // const ignore = nodeParams.find((item: any)=>item.key === 'ignore')?.value === 'true' ? true : false;
      let ignore = isElseBranch ? true : false;
      let rule = isElseBranch ? '' : nodeParams.find((item: any)=>item.key === 'rule')?.value;
      let formulaFields = isElseBranch ? '' : nodeParams.find((item: any)=>item.key === 'formulaFields')?.value;
      if (rule?.indexOf('[processBranch') > -1) {
        ignore = true;
        rule = '';
        formulaFields = '';
      }
      bpmnNode.data.businessData = {
        ignore,
        rule,
        formulaFields,
      };
      break;
    case 'web-hook':
      const { config, type: webhookType } = businessDataObj as any;
      bpmnNode.data.businessData = {
        type: webhookType || 'request',
        config: JSON.parse(config || null),
      };
      break;
    case 'email':
      businessDataObj = {};
      nodeParams?.forEach(({ key, value }: any)=>{
        if (key === 'to') {
          if (!businessDataObj[key]) {
            businessDataObj[key] = value;
          } else {
            if (isString(businessDataObj[key])) {
              businessDataObj[key] = [businessDataObj[key], value];
            } else {
              businessDataObj[key] = [...businessDataObj[key], value];
            }
          }
        } else {
          businessDataObj[key] = value;
        }
      });

      let type: any = 'person';
      const users: any = [];
      let variablePath: any;
      let fields: any = [];
      const toVal = businessDataObj.to;
      if (isArray(toVal)) {
        type = 'field';
        fields = toVal.map((item: any)=>item?.replace('fields.', ''));
      } else {
        if (businessDataObj?.to?.indexOf('email.') === 0) {
          type = 'person';
          const emails = businessDataObj?.to?.split(',');
          for (const item of emails) {
            const result = await getUserInfo(item);
            users.push(result);
          }
        }
        if (businessDataObj?.to?.indexOf('$') === 0) {
          type = 'processVariable';
          variablePath = businessDataObj?.to;
        }
        if (businessDataObj?.to?.indexOf('fields.') === 0) {
          type = 'field';
          variablePath = businessDataObj?.to;
        }
        businessDataObj.to === 'processInitiator' && (type = 'processInitiator');
        businessDataObj.to === 'superior' && (type = 'superior');
      }
      bpmnNode.data.businessData = {
        approvePersons: {
          type,
          users,
          fields,
          variablePath,
          departments: [],
        },
        content: businessDataObj?.content,
        mes_attachment: undefined,
        templateId: 'quanliang',
        title: businessDataObj?.title,
      };
      break;
    case 'process-variable-assignment':
      const assignmentRules = businessDataObj?.assignmentRules;
      bpmnNode.data.businessData = {
        assignmentRules: JSON.parse(assignmentRules),
      };
      break;
    case 'form-create-data':
      const { targetTableID: createTargetTableID, createRule, ref, normalRequiredField, subTableRequiredField } = businessDataObj || {};
      bpmnNode.data.businessData = {
        targetTableId: createTargetTableID,
        createRule: createRule ? JSON.parse(createRule) : {},
        ref: ref ? JSON.parse(ref) : {},
        normalRequiredField: normalRequiredField ? JSON.parse(normalRequiredField) : [],
        subTableRequiredField: subTableRequiredField ? JSON.parse(subTableRequiredField) : [],
        silent: formTableID === createTargetTableID ? false : true,
      };
      break;
    case 'form-update-data':
      const { targetTableID: updateTargetTableID, updateRule, filterRule, formType, selectField } = businessDataObj || {};
      bpmnNode.data.businessData = {
        targetTableId: updateTargetTableID,
        updateRule: updateRule ? JSON.parse(updateRule) : [],
        filterRule: filterRule ? JSON.parse(filterRule) : {},
        silent: formTableID === updateTargetTableID ? false : true,
        formType: formType,
        formQueryRef: [],
        selectField: selectField,
        selectFieldType: '',
        selectFieldTableId: '',
      };
      break;
    case 'approve':
      const { nodeInfo: approveNodeInfo } = businessDataObj;
      const _approveNodeInfo = JSON.parse(approveNodeInfo);
      bpmnNode.data.businessData = _approveNodeInfo?.data?.businessData;
      break;
    case 'fill':
      const { nodeInfo: fillInNodeInfo } = businessDataObj;
      const _fillInNodeInfo = JSON.parse(fillInNodeInfo);
      bpmnNode.data.businessData = _fillInNodeInfo?.data?.businessData;
      break;
    }
  } catch (error) {
  }

  return bpmnNode;
};

// 触发器 查询 保存 删除
export const handleTrigger = (appID: any, tableID: any, pipelineName: any)=>{
  if (!pipelineName) {
    return;
  }
  const triggerType = ['CREATE', 'UPDATE'];
  const mapType: any = {
    CREATE: 'whenAdd',
    UPDATE: 'whenAlter',
  };
  const { name, troggerWayList } = window.PipelineWorkflow || {};
  triggerType?.forEach((item: any)=>{
    name && getTriggerInfo(`${name}_${item}`)
      .then((res: any)=>{
        if (!res && troggerWayList?.includes(mapType?.[item])) {
          createTrigger({
            'name': `${name}_${item}`,
            'pipelineName': name,
            'data': {
              'app_id': appID,
              'table_id': tableID,
              'type': item,
              filters: item === 'UPDATE' ? window?.PipelineWorkflow?.whenAlterFields : [],
            },
          });
        } else if (item === 'UPDATE' && res && res.filters !== window?.PipelineWorkflow?.whenAlterFields) {
          deleteTrigger(`${name}_${item}`).then((res)=>{
            createTrigger({
              'name': `${name}_${item}`,
              'pipelineName': name,
              'data': {
                'app_id': appID,
                'table_id': tableID,
                'type': item,
                filters: item === 'UPDATE' ? window?.PipelineWorkflow?.whenAlterFields : [],
              },
            });
          });
        } else if (res && !troggerWayList?.includes(mapType?.[item])) {
          deleteTrigger(`${name}_${item}`);
        }
      });
  });
};

export const saveTrigger = (flowData: any, res: any)=>{
  const { name } = res;
  if (!name) {
    return;
  }
  const { appId: appID } = flowData;
  const bpmn = JSON.parse(flowData?.bpmnText || '');
  const formData = bpmn?.shapes?.filter((item: any)=>item?.type === 'formData')?.[0]?.data;
  const tableID = formData?.businessData?.form?.value;
  const troggerWayList = formData?.businessData?.triggerWay || [];
  const triggerType = ['CREATE', 'UPDATE'];
  const mapType: any = {
    CREATE: 'whenAdd',
    UPDATE: 'whenAlter',
  };
  triggerType?.forEach((item: any)=>{
    getTriggerInfo(`${name}_${item}`)
      .then((res: any)=>{
        if (!res && troggerWayList?.includes(mapType?.[item])) {
          createTrigger({
            'name': `${name}_${item}`,
            'pipelineName': name,
            'data': {
              'app_id': appID,
              'table_id': tableID,
              'type': item,
              filters: item === 'UPDATE' ? window?.PipelineWorkflow?.whenAlterFields : [],
            },
          });
        } else if (item === 'UPDATE' && res && res.filters !== window?.PipelineWorkflow?.whenAlterFields) {
          deleteTrigger(`${name}_${item}`).then((res)=>{
            createTrigger({
              'name': `${name}_${item}`,
              'pipelineName': name,
              'data': {
                'app_id': appID,
                'table_id': tableID,
                'type': item,
                filters: item === 'UPDATE' ? window?.PipelineWorkflow?.whenAlterFields : [],
              },
            });
          });
        } else if (res && !troggerWayList?.includes(mapType?.[item])) {
          deleteTrigger(`${name}_${item}`);
        }
      });
  });
};
// 获取 新工作流params
export const getPipelineWorkFlowParams = (flowData: any)=>{
  const { appId: appID, id: flowId, name: display_name, pipelineName,
    canCancel, canCancelNodes, canCancelType, canMsg, canUrge, canViewStatusMsg, cron, instanceName, keyFields, triggerMode, status } = flowData;
  if (!flowId) {
    window.PipelineFlowData = {};
  }
  const bpmn = JSON.parse(flowData?.bpmnText || '');
  const tableID = getTableID(bpmn?.shapes);
  const formData = bpmn?.shapes?.filter((item: any)=>item?.type === 'formData')?.[0]?.data;
  const params = [
    {
      name: 'appID',
      default: appID,
      description: 'lowcodeapplicationid',
    },
    {
      name: 'tableID',
      default: tableID,
      description: 'lowcodetableid',
    },
    {
      name: 'dataID',
      description: 'lowcodeformdataid',
    },
  ];
  const variable: any = window.PipelineFlowData?.variable || [];
  if (!variable?.length) {
    const _id = uuid();
    const item = {
      id: _id,
      code: `flowVar_${_id}`,
      name: 'SYS_AUDIT_BOOL',
      type: 'SYSTEM',
      fieldType: 'boolean',
      defaultValue: 'True',
      desc: '系统初始化变量，不可修改',
    };

    variable?.push(item);
  }
  const communal: any = [];
  variable?.forEach((item: any)=>{
    communal.push( {
      name: item?.code,
      default: item?.defaultValue,
      description: item?.desc,
    });
  });
  const nodes: any = bpmnToPipepline(bpmn, flowData, communal);
  const spec = {
    params: params,
    nodes,
    communal,
  };

  const config: any = {
    canMsg,
    canUrge,
    canCancel,
    canCancelType,
    canCancelNodes,
    canViewStatusMsg,
    keyFields,
    instanceName,
  };
  const res = {
    display_name,
    appID,
    name: pipelineName,
    spec,
    config,
    variable,
  };
  if (!window?.PipelineWorkflow?.troggerWayList ) {
    window.PipelineWorkflow = window.PipelineWorkflow || {};
  }
  window.PipelineWorkflow.troggerWayList = formData?.businessData?.triggerWay || [];
  window.PipelineWorkflow.whenAlterFields = formData?.businessData?.whenAlterFields || [];

  window.PipelineFlowData = res;
  // 查询 保存 删除 trigger
  // handleTrigger(appID, tableID, pipelineName);
  return res;
};

// pipeline 转换成 bpmn
export const pipelineTobpmnFlow = async (pipelineObj: any)=>{
  window.PipelineFlowData = pipelineObj || {};
  window.PipelineWorkflow = window.PipelineWorkflow || {};
  window.PipelineWorkflow.name = pipelineObj?.name;
  window.PipelineFlowData.display_name = window.PipelineFlowData.displayName;
  const troggerWayList = [];
  const createRes = await httpClient.get(`/api/v1/trigger/form/${pipelineObj?.name}_CREATE`);
  const updateRes: any = await httpClient.get(`/api/v1/trigger/form/${pipelineObj?.name}_UPDATE`);
  createRes && troggerWayList.push('whenAdd');
  updateRes && troggerWayList.push('whenAlter');
  window.PipelineWorkflow.troggerWayList = troggerWayList;
  window.PipelineWorkflow.whenAlterFields = updateRes?.filters || [];

  const triggerrArr = [createRes, updateRes]?.filter((item: any)=>!!item);
  const hasOnTrigger = !!triggerrArr?.find((item: any)=> item?.status === 'on');
  const _status = hasOnTrigger ? 'ENABLE' : 'DISABLE';
  const {
    nodes: pipelineNode,
    params,
  } = pipelineObj?.spec || {};

  const { config } = pipelineObj || {};

  // 查询 保存 删除 trigger
  const shapes = await pipelineNodesToBpmnNodes(pipelineNode, params);
  const bpmn = {
    version: CURRENT_WORK_FLOW_VERSION,
    shapes,
  };
  const tableID = params?.find((item: any)=>item.name === 'tableID')?.default;
  const appID = params?.find((item: any)=>item.name === 'appID')?.default;
  const { canCancel, canCancelNodes, canCancelType, canMsg, canUrge, canViewStatusMsg, cron, instanceName, keyFields, triggerMode, status } = config;
  const data = {
    'id': pipelineObj?.name,
    'appId': appID,
    'name': pipelineObj?.displayName,
    'formId': tableID,
    'bpmnText': JSON.stringify(bpmn || ''),
    'cron': cron,
    'processKey': pipelineObj?.processKey,
    'status': _status || 'DISABLE',
    'processID': '',
    'triggerMode': triggerMode || 'FORM_DATA',
    'canCancel': canCancel,
    'canCancelType': canCancelType,
    'canCancelNodes': canCancelNodes,
    'canUrge': canUrge,
    'canViewStatusMsg': canViewStatusMsg,
    'canMsg': canMsg,
    'instanceName': instanceName,
    'keyFields': keyFields,
  };

  // 查询 保存 删除 trigger
  // handleTrigger(appID, tableID, pipelineObj?.name);

  return data;
};

// trigger 获取触发器
export const getTriggersData = (flowData: any)=>{
  const bpmn = JSON.parse(flowData?.bpmnText || '');
  const formData = bpmn?.shapes?.filter((item: any)=>item?.type === 'formData')?.[0]?.data;
  const { triggerWay } = formData?.businessData || {};
  const pipelineName = window?.PipelineWorkflow?.name;
  const mapType: any = {
    whenAdd: 'CREATE',
    whenAlter: 'UPDATE',
  };
  const triggerList = triggerWay?.map((item: string)=>{
    const type = mapType?.[item];
    return {
      'name': `${pipelineName}_${type}`,
      'pipelineName': pipelineName,
      'data': {
        'app_id': flowData?.appId,
        'table_id': formData?.businessData?.form?.value,
        'type': type,
        filters: formData?.businessData?.whenAlterFields || [],
      },
    };
  });
  return pipelineName ? triggerList : null;
};

