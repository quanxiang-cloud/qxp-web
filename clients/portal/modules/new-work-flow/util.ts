/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-nested-ternary */
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
import { isArray, isString, cloneDeep, isNumber } from 'lodash';
import { createTrigger, deleteTrigger, getTriggerInfo } from './api';
import { uuid } from '@lib/utils';
import { buildGraphQLQuery } from '../access-control/departments-employees/utils';
import { searchUser } from '@c/form-builder/registry/user-picker/messy/api';
import httpClient from '@lib/http-client';
import { CURRENT_WORK_FLOW_VERSION } from './content/editor/utils/constants';
import { toEs } from './content/editor/forms/query-table-data/data-filter/utils';
import { getElementParents } from './content/editor/forms/webhook/utils';
import { getFieldSchema } from './content/editor/forms/api';
import schemaToFields, { schemaToMap } from '@lib/schema-convert';
import { transformSchema } from './content/editor/forms/utils';

const ProcessBranch = 'process-branch';
const ProcessSource = 'process-source';
const ProcessTarget = 'process-target';

// 获取 tableID
const getTableID = (data: Array<any>)=>{
  return data?.filter((item: any)=>item?.type === 'formData')?.[0]?.data?.businessData?.form?.value;
};

//  get node
export const getNode = (data: any, id: string) => {
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

export const preconditions = (targets: any, sources: any)=>{
  if (targets?.length === 0) {
    return true;
  }
  let counter = 0;
  targets?.forEach((item: any)=>{
    if (sources[item]) {
      counter++;
    }
  });
  return counter === targets?.length;
};
// 获取 pepeline nodes bpmn转换成pipeline
const bpmnToPipepline = (data: any, flowData: any, communal: any)=>{
  const nodesList = data?.shapes || [];
  const firstNode = nodesList?.filter((item: any)=>item?.type === 'formData')?.[0];
  let nodes = [firstNode];
  const nodeID: any = {};
  const pipelineNode: any = [];

  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index];
    if (nodeID[node?.id]) {
      continue;
    }

    if (!preconditions(node?.data?.nodeData?.parentID, nodeID)) {
      nodes = [...nodes, node];
      continue;
    }
    nodeID[node?.id] = {};
    const pn: any = {
      name: node?.id,
      Metadata: {
        Annotations: {
          'web.pipelineNode/name': node?.data?.nodeData?.name,
        },
      },
      spec: {
        type: undefined,
        params: [], // key value
        output: [],
        when: [],
      },
    };

    if (node?.data?.nodeData?.branchTargetElementID) {
      pn.Metadata.Annotations['web.pipelineNode/branchTargetElementID'] = node?.data?.nodeData?.branchTargetElementID;
    }
    if (node?.data?.nodeData?.branchID) {
      pn.Metadata.Annotations['web.pipelineNode/branchID'] = node?.data?.nodeData?.branchID;
    }
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

    const addQueryData = (data: any)=>{
      const { valueOf, key } = data || {};
      if (isString(valueOf) && valueOf?.includes('.output.')) {
        pn.spec.params.push({
          'key': key,
          value: valueOf,
        });
      }
    };
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
          // for (const field of approvePersons.fields) {
          //   pn.spec.params.push({
          //     key: 'to',
          //     value: `fields.${field}`,
          //   });
          // }
          // pn.spec.params.push({
          //   key: 'to',
          //   value: approvePersons?.fields?.map((field: any)=>`fields.${field}`)?.join(',') || '',
          // });
          for (let i = 0; i < approvePersons?.fields?.length; i++) {
            const fields = approvePersons?.fields?.[i];
            if (typeof fields === 'string') {
              pn.spec.params.push({
                key: 'to',
                value: `fields.${fields}`,
              });
            }
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
      const variablePath = node?.data?.businessData?.basicConfig?.approvePersons?.variablePath || '';
      if (variablePath?.includes('$tableDataQuery')) {
        const arr = variablePath?.split('.');
        pn.spec.params.push({
          key: arr[1],
          value: `$(tasks.query.output.${arr[1]})`,
        });
      }
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
        case 'superior':
          fillUsers.push('leader');
          break;
        case 'processInitiator':
          fillUsers.push('formApplyUserID');
          break;
        }
      }
      if (node?.data?.businessData?.basicConfig?.approvePersons !== undefined && typeof node?.data?.businessData?.basicConfig?.approvePersons === 'object') {
        switch (node?.data?.businessData?.basicConfig?.approvePersons?.type) {
        case 'field':
          if (Array.isArray(node?.data?.businessData?.basicConfig?.approvePersons?.fields)) {
            for (const k in node?.data?.businessData?.basicConfig?.approvePersons?.fields) {
              fillUsers.push('field.' + node?.data?.businessData?.basicConfig?.approvePersons?.fields[k]);
            }
          }
          break;
        }
      }
      pn.spec.params.push({
        key: 'fieldPermission',
        value: JSON.stringify(node?.data?.businessData?.fieldPermission || {}),
      });
      pn.spec.params.push({
        key: 'dealUsers',
        value: fillUsers.join(','),
      });
      // pn.spec.params.push({
      //   key: 'nodeInfo',
      //   value: JSON.stringify(node),
      // });
      break;
    case 'processBranch':
      pn.spec.type = 'process-branch';
      pn.spec.params = [
        ...commonParams,
      ];
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
        const nodeParentID = node?.data?.nodeData?.parentID?.[0];
        const sibNodes = nodesList?.filter((item: any)=>{
          return item?.data?.nodeData?.parentID?.[0] === nodeParentID && item?.id !== node?.id;
        });
        const rule = sibNodes?.map((item: any)=>{
          pn.spec.params.push({
            key: item?.id,
            value: `$(task.${item?.id}.output.ok)`,
          });
          return `[${item?.id}]==false`;
        })?.join('&&');
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

      pn.spec.output = ['ok'];

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

        for (const key in rule) {
          addQueryData(rule[key]);
        }
        const _rule: any = JSON.parse(JSON.stringify(rule));
        for (const k in _rule) {
          const { valueOf, key } = _rule[k];
          if (isString(valueOf) && valueOf?.includes('.output.')) {
            const _valueOf = `$(local.${key})`;
            _rule[k].valueOf = _valueOf;
            _rule[k].valueFrom = valueOf?.replace('$', '')?.replace('(', '')?.replace(')', '');
          }
        }
        const vByte = JSON.stringify(_rule);
        pn.spec.params.push({
          key: 'createRule',
          value: vByte,
        });

        const { createNumber, createNumberKey } = node?.data?.businessData;
        if (createNumber && isNumber(createNumber)) {
          pn.spec.params.push({
            key: 'repeat',
            value: String(createNumber),
          });
        }
        if (createNumber && isString(createNumber) && createNumber?.includes('.output.') && createNumberKey) {
          pn.spec.params.push({
            key: 'repeat',
            // value: `$(local.${createNumberKey})`,
            // value: `${createNumberKey}`,
            value: `${createNumber}`,

          });
          // pn.spec.params.push({
          //   key: createNumberKey,
          //   value: createNumber,
          // });
          // pn.Metadata.Annotations['web.pipelineNode/createNumberKey'] = createNumberKey;
        }
      }
      // if (node?.data?.businessData?.ref) {
      //   const ref = node?.data?.businessData?.ref;
      //   const _ref: any = JSON.parse(JSON.stringify(ref));
      //   // for (const key in ref) {
      //   //   const rule = ref[key]?.createRules?.[0];
      //   //   for (const key in rule) {
      //   //     addQueryData(rule[key]);
      //   //   }
      //   // }
      //   // for (const key in _ref) {
      //   //   const rule = _ref[key]?.createRules?.[0];
      //   //   for (const k in rule) {
      //   //     const { valueOf, key } = rule[k];
      //   //     if (isString(valueOf) && valueOf?.includes('.output.')) {
      //   //       const _valueOf = `$(local.${key})`;
      //   //       rule[k].valueOf = _valueOf;
      //   //     }
      //   //   }
      //   // }
      //   const vByte = JSON.stringify(_ref);
      //   pn.spec.params.push({
      //     key: 'ref',
      //     value: vByte,
      //   });
      // }
      // if (node?.data?.businessData?.normalRequiredField) {
      //   const normalRequiredField = node?.data?.businessData?.normalRequiredField;
      //   const vByte = JSON.stringify(normalRequiredField);
      //   pn.spec.params.push({
      //     key: 'normalRequiredField',
      //     value: vByte,
      //   });
      // }
      // if (node?.data?.businessData?.subTableRequiredField) {
      //   const subTableRequiredField = node?.data?.businessData?.subTableRequiredField;
      //   const vByte = JSON.stringify(subTableRequiredField);
      //   pn.spec.params.push({
      //     key: 'subTableRequiredField',
      //     value: vByte,
      //   });
      // }
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
        pn.Metadata.Annotations['web.pipelineNode/updateFormType'] = node?.data?.businessData?.formType;
        // pn.spec.params.push({
        //   key: 'formType',
        //   value: node?.data?.businessData?.formType,
        // });
      }

      // if (node?.data?.businessData?.selectField) {
      //   pn.spec.params.push({
      //     key: 'selectField',
      //     value: node?.data?.businessData?.selectField,
      //   });
      // }

      // if (node?.data?.businessData?.selectFieldType) {
      //   pn.spec.params.push({
      //     key: 'selectFieldType',
      //     value: node?.data?.businessData?.selectFieldType,
      //   });
      // }

      // if (node?.data?.businessData?.selectFieldTableId) {
      //   pn.spec.params.push({
      //     key: 'selectFieldTableId',
      //     value: node?.data?.businessData?.selectFieldTableId,
      //   });
      // }

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

      // if (node?.data?.businessData?.formQueryRef) {
      //   const formQueryRef = node?.data?.businessData?.formQueryRef;
      //   const vByte = JSON.stringify(formQueryRef);
      //   pn.spec.params.push({
      //     key: 'formQueryRef',
      //     value: vByte,
      //   });
      // }

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
      pn.Metadata.Annotations['web.pipelineNode/webhookType'] = node?.data?.businessData?.type;
      // pn.spec.params.push({
      //   key: 'type',
      //   value: node?.data?.businessData?.type,
      // });
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
    case 'tableDataQuery':
      pn.spec.type = 'form-query-data';
      pn.spec.params = [
        {
          key: 'appID',
          value: '$(params.appID)',
        },
      ];
      if (node?.data?.businessData?.['targetTableId']) {
        pn.spec.params.push( {
          key: 'targetTableID',
          value: node?.data?.businessData?.['targetTableId'],
        });
      }
      const formType = node?.data?.businessData?.formType;
      pn.Metadata.Annotations['web.pipelineNode/formType'] = node?.data?.businessData?.formType;
      if (formType === 'work-form') {
        pn.spec.params.push({
          key: 'dataID',
          value: '$(params.dataID)',
        });
        // const localID = '{{ if eq (printf "%T" .Local.dataID) "string" }}"{{ .Local.dataID }}"{{ else }}{{ .Local.dataID }}{{ end }}';
        const localID = '{{.Local.dataID}}';

        pn.spec.params.push({
          key: 'query',
          value: `{"bool":{"must":[{"term":{"_id":${localID}}}]}}`,
        });
        pn.spec.params.push({
          key: 'size',
          value: '1',
        });
      } else {
        if (node?.data?.businessData?.query) {
          const rule = node?.data?.businessData?.query;
          const { size, sort, tag, conditions, sizeKey, sizeNodeID } = rule;
          if (sizeKey && isString(size) && size?.includes('.output.')) {
            pn.spec.params.push({
              key: sizeKey,
              value: size,
            });
          }
          pn.spec.params.push({
            key: 'sort',
            value: sort?.[0],
          });
          if (sizeKey && isString(size) && size?.includes('.output.')) {
            // const _sizeStr = `{{ if eq (printf "%T" .Local.${sizeKey}) "string" }}"{{ .Local.${sizeKey} }}"{{ else }}{{ .Local.${sizeKey} }}{{ end }}`;
            const _sizeStr = `{{.Local.${sizeKey}}}`;

            // pn.spec.params.push({
            //   key: 'size',
            //   value: (formType === 'work-form') ? '1' : _sizeStr,
            // });
            pn.spec.params.push({
              key: 'size',
              value: (formType === 'work-form') ? '1' : size,
            });
          } else {
            pn.spec.params.push({
              key: 'size',
              value: (formType === 'work-form') ? '1' : String(size),
            });
          }
          let _query = {};
          try {
            const _conditions = conditions?.map((item: any)=>{
              if (item?.value.includes('.output.')) {
                // const _valueStr = `{{ if eq (printf "%T" .Local.${item?.outputKey}) "string" }}"{{ .Local.${item?.outputKey} }}"{{ else }}{{ .Local.${item?.outputKey} }}{{ end }}`;
                const _valueStr = `{{.Local.${item?.outputKey}}}`;
                return item?.outputKey ? {
                  ...item,
                  value: _valueStr,
                } : null;
              } else {
                return item;
              }
            })?.filter((item: any)=>!!item);
            _query = toEs({ tag, condition: [..._conditions] });
          } catch (error) {
            _query = toEs({ tag, condition: [] });
          }
          const _queryStr: any = JSON.stringify(_query);

          // 使用正则表达式替换字符串
          const outputString = _queryStr.replace(/"{{(.+?)}}"/g, '{{$1}}');
          pn.spec.params.push({
            key: 'query',
            value: outputString,
          });
          try {
            conditions?.forEach((item: any)=>{
              const { value, outputKey } = item;
              if (item?.value?.includes('.output.') && outputKey && value) {
                pn.spec.params.push({
                  key: outputKey,
                  value: value,
                });
              }
            });
          } catch (error) {
          }
        }
      }

      if (node?.data?.businessData?.queryList) {
        const rule = node?.data?.businessData?.queryList;
        rule?.forEach((item: any)=>{
          pn.spec.params.push({
            key: `schema.${item?.value}`,
            value: `${item?.queryVal}`,
          });
        });
        pn.spec.output = rule?.map((item: any)=>`${item?.queryVal}`);
      }
      if (node?.data?.businessData?.ref) {
        let keyNum = 0;
        for (const key in node?.data?.businessData?.ref) {
          keyNum = keyNum + 1;
        }
        const ref = node?.data?.businessData?.ref;
        if (keyNum > 0) {
          pn.spec.params.push({
            key: 'ref',
            value: JSON.stringify(ref),
          });
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

    const tmpNodes: any = [];
    node?.data?.nodeData?.childrenID?.forEach((childID: any)=>{
      tmpNodes.push(getNode(data, childID));
    });
    nodes = [...nodes, ...tmpNodes];
  }
  const _pipelineNode: any = [];
  if (pipelineNode?.length) {
    pipelineNode?.forEach((item: any)=>{
      if (item?.spec?.type === 'process-branch') {
        const last = _pipelineNode[_pipelineNode?.length - 1];
        if (last?.length && last?.[0]?.spec?.type === 'process-branch') {
          _pipelineNode[_pipelineNode?.length - 1].push(item);
        } else {
          _pipelineNode.push([item]);
        }
      } else {
        _pipelineNode.push([item]);
      }
    });
  }

  const newPipelineNode = _pipelineNode?.map((item: any)=>{
    if (item?.[0]?.spec?.type === 'process-branch') {
      const elseNodes = item?.filter((child: any)=>(child?.Metadata?.Annotations?.['web.pipelineNode/isElseBranch'] === 'true'));
      const normalNodes = item?.filter((child: any)=>(child?.Metadata?.Annotations?.['web.pipelineNode/isElseBranch'] !== 'true'));
      return [
        ...normalNodes,
        ...elseNodes,
      ];
    } else {
      return item;
    }
  }) || [];
  const lastPipelineNodes: any = newPipelineNode?.flat();
  return lastPipelineNodes;
};

// 将新生成的pipeline nodes 转换成 bpmn的 nodes
const pipelineNodesToBpmnNodes = async (pipelineNode: any, params: any)=>{
  // 新工作流新数据

  // const newPepelineNodes = getNewPipelineNodes(pipelineNode); // 兼容老工作留的数据
  // const hasBranchID = !!pipelineNode?.find((item: any)=>!!item?.Metadata?.Annotations?.['web.pipelineNode/branchID']);
  const hasBranchID = !!pipelineNode?.find((item: any)=>!!item?.Metadata?.Annotations?.hasOwnProperty('web.pipelineNode/branchID'));
  const _pipelineNode = pipelineNode?.map((item: any)=>{
    if (hasBranchID) {
      if (item?.Metadata?.Annotations?.['web.pipelineNode/branchID']) {
        const branchID = item?.Metadata?.Annotations?.['web.pipelineNode/branchID'];
        const hasBranchID = pipelineNode?.find((item: any)=>item?.name === branchID);
        if (!hasBranchID) {
          item.Metadata.Annotations['web.pipelineNode/branchID'] = '';
        }
      }
    } else {
      if (item?.spec?.when?.length) {
        const whenCondition = item.spec.when?.[0];
        const branchID = whenCondition?.input?.match(/task\.(.*?)\.output/)[1];
        const hasBranchID = pipelineNode?.find((item: any)=>item?.name === branchID);
        if (!hasBranchID) {
          item.spec.when = item?.spec?.when?.filter((item: any, index: any)=>index !== 0);
        }
      }
    }

    return item;
  });
  const newPepelineNodes = getNewPipelineNodes(_pipelineNode); // 兼容老工作留的数据

  const bpmnNodes: any = [];

  for (const item of newPepelineNodes) {
    const result = await generageBpmnNode(item, params, newPepelineNodes);
    bpmnNodes.push(result);
  }
  return bpmnNodes;
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
  const _pipelineNode = isArray(pipelineNode) ? cloneDeep(pipelineNode) : [];
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
export const getMainNodes = (pipelineNode: any)=>{
  const mainNodesList: any = [];
  // const hasBranchID = !!pipelineNode?.find((item: any)=>!!item?.Metadata?.Annotations?.['web.pipelineNode/branchID']);
  const hasBranchID = !!pipelineNode?.find((item: any)=>!!item?.Metadata?.Annotations?.hasOwnProperty('web.pipelineNode/branchID'));
  if (hasBranchID) {
    for (let i = 0; i < pipelineNode?.length; i++) {
      if (!pipelineNode[i]?.Metadata?.Annotations?.['web.pipelineNode/branchID']) {
        mainNodesList.push([]);
      }
      const curType = pipelineNode[i]?.spec?.type;
      const preType = pipelineNode[i - 1]?.spec?.type;
      if (curType === ProcessBranch && preType === ProcessBranch && !pipelineNode[i]?.Metadata?.Annotations?.['web.pipelineNode/branchID']) {
        const curBranchTargetElementID = pipelineNode[i]?.Metadata?.Annotations?.['web.pipelineNode/branchTargetElementID'];
        const preBranchTargetElementID = pipelineNode[i - 1]?.Metadata?.Annotations?.['web.pipelineNode/branchTargetElementID'];
        if (curBranchTargetElementID && preBranchTargetElementID &&
          curBranchTargetElementID !== preBranchTargetElementID
        ) {
          //
        } else {
          (mainNodesList.pop());
        }
      }
      if (!pipelineNode[i]?.Metadata?.Annotations?.['web.pipelineNode/branchID']) {
        mainNodesList?.[mainNodesList.length - 1]?.push(pipelineNode?.[i]);
      }
    }
  } else {
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
  }
  return mainNodesList;
};

// 给主干节点添加分流 合流节点
const addMainBranchNodes = (mainNodeList: any)=>{
  const mainNodesList = cloneDeep(mainNodeList);
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
export const getBranchNodes = (pipelineNode: any)=>{
  const branchNodesObj: any = {};
  // const hasBranchID = !!pipelineNode?.find((item: any)=>!!item?.Metadata?.Annotations?.['web.pipelineNode/branchID']);
  const hasBranchID = !!pipelineNode?.find((item: any)=>!!item?.Metadata?.Annotations?.hasOwnProperty('web.pipelineNode/branchID'));
  if (hasBranchID) {
    for (let i = 0; i < pipelineNode.length; i++) {
      if (pipelineNode[i]?.Metadata?.Annotations?.['web.pipelineNode/branchID']) {
        const parentID = pipelineNode[i]?.Metadata?.Annotations?.['web.pipelineNode/branchID'];
        if (!branchNodesObj[parentID]) {
          branchNodesObj[parentID] = [];
        }
        branchNodesObj[parentID].push(pipelineNode[i]);
      }
    }
  } else {
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
        const curBranchTargetElementID = pipelineNode[i]?.Metadata?.Annotations?.['web.pipelineNode/branchTargetElementID'];
        const preBranchTargetElementID = pipelineNode[i - 1]?.Metadata?.Annotations?.['web.pipelineNode/branchTargetElementID'];
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
      if (item[0]?.spec?.type !== ProcessTarget && item[0].spec.type !== ProcessSource && item[0].spec.type !== ProcessBranch) {// 非分流，合流 分支node
        item.forEach((node: any)=>{
          node.parentID = [newMainNodesList[index - 1]?.[0]?.name];
          node.childrenID = [newMainNodesList?.[index + 1]?.[0].name];
        });
      }
      if (item[0]?.spec?.type === ProcessBranch) {// 分支node
        item.forEach((node: any)=>{
          node.parentID = [newMainNodesList[index - 1]?.[0]?.name];
          node.childrenID = [newBranchNodesObj[node?.name]?.[0]?.[0]?.name]; // 分支的child
        });
      }
      if (item[0]?.spec?.type === ProcessSource) {// 分流node
        item[0].parentID = [newMainNodesList[index - 1]?.[0].name];
      }
      if (item[0]?.spec?.type === ProcessTarget) {// 合流node
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
const generageBpmnNode = async (node: any, params: any, newPepelineNodes?: any)=>{
  const mapType: any = {
    'end': 'end',
    'email': 'email',
    'approve': 'approve',
    'fill': 'fillIn',
    'web-hook': 'webhook',
    'form-data': 'formData',
    'form-update-data': 'tableDataUpdate',
    'form-create-data': 'tableDataCreate',
    'form-query-data': 'tableDataQuery',
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
      const { config } = businessDataObj as any;
      const webhookType = node.Metadata.Annotations?.['web.pipelineNode/webhookType'];
      const formDataID = newPepelineNodes?.find((item: any)=>item?.spec?.type === 'form-data')?.name;
      const _config = JSON.parse(config || null);
      if (formDataID && _config) {
        if (webhookType === 'send') {
          _config?.inputs?.forEach((item: any)=>{
            const { type, data } = item || {};
            if (type === 'direct_expr' && data?.startsWith('$formData')) {
              const dataArr = data?.split('.');
              const fieldKey = dataArr?.[1];
              item.data = `$${formDataID}.${fieldKey}`;
            }
          });
        } else {
          _config?.inputs?.forEach((item: any)=>{
            const { data } = item || {};
            data?.forEach((child: any)=>{
              const { type, data } = child;
              if (type === 'direct_expr' && data?.startsWith('$formData')) {
                const dataArr = data?.split('.');
                const fieldKey = dataArr?.[1];
                child.data = `$${formDataID}.${fieldKey}`;
              }
            });
          });
        }
      }
      bpmnNode.data.businessData = {
        type: webhookType || 'request',
        // config: JSON.parse(config || null),
        config: _config || null,
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
          fields = toVal?.split(',')?.map((item: any)=>item?.replace('fields.', ''));
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
      const { targetTableID: createTargetTableID, createRule, ref,
        normalRequiredField, subTableRequiredField, queryNodeId, repeat } = businessDataObj || {};
      // const createNumberKey = node.Metadata.Annotations?.['web.pipelineNode/createNumberKey'];
      const getNewRule = (rule: any)=>{
        const _createRule = rule ? JSON.parse(rule) : {};
        for (const key in _createRule) {
          const { valueFrom, valueOf } = _createRule[key];
          if (valueFrom?.includes('.output.') && isString(valueOf) && valueOf?.includes('local.')) {
            const _valueKey = valueOf?.replace('$(local.', '')?.replace(')', '');
            const _value = businessDataObj?.[_valueKey];
            _createRule[key].valueOf = _value;
            _createRule[key].valueFrom = 'task.xx.output.xxx';
          }
        }
        return _createRule;
      };
      const _createRule = getNewRule(createRule);

      const getNewRef = (ref: any)=>{
        const newRef = JSON.parse(JSON.stringify(ref));
        const getNewRule = (rule: any)=>{
          const _createRule = rule ? rule : [];
          _createRule.forEach((item: any)=>{
            for ( const k in item) {
              const { valueFrom, valueOf, key } = item[k] || {};
              if (valueFrom === 'task.xx.output.xxx' && isString(valueOf) && valueOf?.includes('local.')) {
                const _value = businessDataObj?.[key];
                item[k].valueOf = _value;
              }
            }
          });
          return _createRule;
        };
        for (const key in newRef) {
          const _createRules = newRef?.[key]?.createRules;
          const _newRules = getNewRule(_createRules);
          newRef[key].createRules = _newRules;
        }
        return newRef;
      };

      const _ref = ref ? JSON.parse(ref) : {};

      let _createNumber; let _createNumberKey;
      // if (repeat?.includes('local.') ) {
      //   _createNumberKey = repeat?.replace('$(local.', '')?.replace(')', '');
      //   _createNumber = businessDataObj?.[_createNumberKey];
      // } else {
      //   _createNumber = Number(repeat);
      // }
      if (!Number(repeat) ) {
        _createNumberKey = repeat;
        // _createNumber = businessDataObj?.[_createNumberKey];
        _createNumber = repeat;
      } else {
        _createNumber = Number(repeat);
      }
      bpmnNode.data.businessData = {
        targetTableId: createTargetTableID,
        // createRule: createRule ? JSON.parse(createRule) : {},
        createRule: _createRule,
        // ref: ref ? JSON.parse(ref) : {},
        ref: ref ? getNewRef(_ref) : {},
        normalRequiredField: normalRequiredField ? JSON.parse(normalRequiredField) : [],
        subTableRequiredField: subTableRequiredField ? JSON.parse(subTableRequiredField) : [],
        silent: formTableID === createTargetTableID ? false : true,
        queryNodeId,
        createNumber: _createNumber,
        createNumberKey: _createNumberKey,
      };
      break;
    case 'form-update-data':
      const { targetTableID: updateTargetTableID, updateRule, filterRule, selectField } = businessDataObj || {};
      const formType = node.Metadata.Annotations?.['web.pipelineNode/updateFormType'];
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
    case 'form-query-data':
      const { targetTableID: targetTableId, query, sort, size, ref: queryDataRef } = businessDataObj || {};
      const _formType = node?.Metadata?.Annotations?.['web.pipelineNode/formType'];
      const queryList: any = [];
      for (const key in businessDataObj) {
        if (key.startsWith('schema.')) {
          queryList.push({
            id: 'tableDataQuery' + uuid(),
            value: key.replace('schema.', '')?.split(','),
            queryVal: businessDataObj[key]?.replace(`${node?.name}_`, ''),
            descrption: businessDataObj[key]?.description,
          });
        }
      }
      let _query = null;
      try {
        if (_formType === 'others' && query) {
          let tag = 'must';
          // const queryStr = query.replace(/{{\s*if\s+eq\s.*?{{\s*end\s*}}/g, function(match: any) {
          //   return '"' + match + '"';
          // });
          const queryStr = query.replace(/{{\.Local\.[^}]+}}/g, function(match: any) {
            return '"' + match + '"';
          });
          const queryObj = query ? JSON.parse(queryStr) : {};
          for (const key in queryObj) {
            if (key === 'bool') {
              const tempObj = queryObj[key];
              for (const k in tempObj) {
                tag = k;
              }
            }
          }
          const formatData = formatQuery(query ? queryObj : {}, businessDataObj);
          const _conditions = formatData?.conditions?.map((item: any)=>{
            if (isString(item?.value) && item.value?.includes('.Local.')) {
              let _valueKey = '';
              item.value?.replace(/{{\.Local\.[^}]+}}/g, function(match: any) {
                _valueKey = match;
                return match?.replace('{{', '')?.replace('}}', '')?.replace('.Local.', '');
              });
              const _outputKey = _valueKey?.replace('{{', '').replace('}}', '').replace('.Local.', '').trim();
              const _value = businessDataObj?.[_outputKey];
              const _outputNodeID = _value?.replace('$(task.', '')?.split('.')?.[0];
              return {
                ...item,
                value: _value,
                outputKey: _outputKey,
                outputNodeID: _outputNodeID,
              };
            } else {
              return item;
            }
          }) || [];
          _query = {
            tag: formatData?.tag || 'must',
            conditions: _conditions || [],
            size: size ? size : undefined,
            sort: sort ? [sort] : ['-created_at'],
            sizeKey: '',
          };
          // if (isString(size) && size?.includes('.Local.')) {
          //   let _sizeKey = '';
          //   size?.replace(/{{\.Local\.[^}]+}}/g, function(match: any) {
          //     _sizeKey = match;
          //     return match?.replace('{{', '')?.replace('}}', '')?.replace('.Local.', '');
          //   });
          //   _sizeKey = _sizeKey?.replace('{{', '').replace('}}', '').replace('.Local.', '').trim();
          //   const sizeValue = businessDataObj?.[_sizeKey];
          //   _query.size = sizeValue;
          //   _query.sizeKey = _sizeKey;
          // }
          if (isString(size) && size?.includes('.output.')) {
            let _sizeKey = '';
            _sizeKey = _sizeKey?.replace('{{', '').replace('}}', '').replace('.Local.', '').trim();
            _query.size = size;
            _query.sizeKey = '';
          }
        }
      } catch (error) {
        console.log('error', error);
      }
      bpmnNode.data.businessData = {
        targetTableId,
        queryList,
        query: _query,
        formType: _formType || 'others',
        ref: JSON.parse(queryDataRef || null),
      };

      break;
    case 'approve':
      const { nodeInfo: approveNodeInfo } = businessDataObj;
      const _approveNodeInfo = JSON.parse(approveNodeInfo);
      bpmnNode.data.businessData = _approveNodeInfo?.data?.businessData;
      break;
    case 'fill':
      const {
        // nodeInfo: fillInNodeInfo,
        fieldPermission,
        dealUsers,
      } = businessDataObj;
      const _fieldPermission = JSON.parse(fieldPermission);
      const dealUsersArr = dealUsers?.split(',');
      let _type: any = 'person';
      const _users: any = [];
      const _fields: any = [];
      if (dealUsers?.startsWith('person.')) {
        _type = 'person';
        dealUsersArr?.forEach((item: any)=>{
          _users.push({
            id: item?.replace('person.', ''),
          });
        });
      } else if (dealUsers?.startsWith('field.')) {
        _type = 'field';
        dealUsersArr?.forEach((item: any)=>{
          _fields.push(item?.replace('field.', ''));
        });
      } else if (dealUsers === 'leader') {
        _type = 'superior';
      } else if (dealUsers === 'formApplyUserID') {
        _type = 'processInitiator';
      }
      if (_type === 'field"') {
        bpmnNode.data.businessData = {
          basicConfig: {
            'autoRules': [],
            'timeRule': {
              'enabled': false,
              'deadLine': {
                'breakPoint': '',
                'day': 0,
                'hours': 0,
                'minutes': 0,
                'urge': {
                  'day': 0,
                  'hours': 0,
                  'minutes': 0,
                  'repeat': {
                    'day': 0,
                    'hours': 0,
                    'minutes': 0,
                  },
                },
              },
              'whenTimeout': {
                'type': '',
                'value': '',
              },
            },
            'multiplePersonWay': 'or',
            'whenNoPerson': 'transferAdmin',
            'approvePersons': {
              'type': 'field',
              'users': [],
              'fields': _fields,
            },
          },
          fieldPermission: _fieldPermission,
        };
      } else {
        bpmnNode.data.businessData = {
          basicConfig: {
            fillInPersons: {
              type: _type,
              users: _users,
              fields: _fields,
            },
          },
          fieldPermission: _fieldPermission,
        };
      }

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
      description: 'lowcode application id',
    },
    {
      name: 'tableID',
      default: tableID,
      description: 'lowcode table id',
    },
    {
      name: 'dataID',
      description: 'lowcode formdata id',
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

function reverseOperatorESParameter(esParameter: any): any | null {
  // Implement the reverse logic for each Elasticsearch parameter type.
  if (esParameter.term) {
    const key = Object.keys(esParameter.term)[0];
    return { key, op: 'eq', value: esParameter.term[key] };
  } else if (esParameter.range) {
    const key = Object.keys(esParameter.range)[0];
    const range = esParameter.range[key];
    const start = range.gte;
    const end = range.lt;
    return { key, op: 'range', value: [start, end] };
  } else if (esParameter.bool) {
    if (esParameter.bool.must) {
      const subconditions = esParameter.bool.must.map((mustItem: any) => reverseOperatorESParameter(mustItem));
      return { key: '', op: 'fullSubset', value: subconditions };
    } else if (esParameter.bool.must_not) {
      const mustNotItem = esParameter.bool.must_not[0];
      if (mustNotItem.term) {
        const key = Object.keys(mustNotItem.term)[0];
        return { key, op: 'ne', value: mustNotItem.term[key] };
      } else if (mustNotItem.terms) {
        const key = Object.keys(mustNotItem.terms)[0];
        return { key, op: 'exclude', value: mustNotItem.terms[key] };
      }
    }
  } else if (esParameter.terms) {
    const key = Object.keys(esParameter.terms)[0];
    return { key, op: 'intersection', value: esParameter.terms[key] };
  } else if (esParameter.match) {
    const key = Object.keys(esParameter.match)[0];
    return { key, op: 'like', value: esParameter.match[key] };
  }
  return null;
}

const formatQuery = (query: any, businessDataObj: any)=>{
  const tag = query?.bool ? Object.keys(query.bool)[0] : 'must';
  const conditions: any = [];
  const dataList = query?.bool?.[tag];
  dataList?.forEach((queryItem: any)=>{
    const condition = reverseOperatorESParameter(queryItem);
    if (condition) {
      const item = {
        ...condition,
        valueFrom: 'fixedValue',
      };
      conditions.push(item);
    }
  });
  return {
    tag,
    conditions,
  };
};

export const getNodesOutputOptions = ({
  elements,
  currentNodeElement,
  appID,
  setNodesOutputOptions,
}: any)=>{
  const options: any = [];
  if (elements?.length) {
    const currentElementParents = getElementParents(currentNodeElement);
    const allArr: any = [];
    elements?.forEach(async (item: any, index: number)=>{
      if (item.data?.type === 'tableDataQuery' && currentElementParents.includes(item.id)) {
        const tableID = item?.data?.businessData?.targetTableId;
        allArr.push(()=>{
          const nodeDataName = item?.data?.nodeData?.name;
          const queryList = item?.data?.businessData?.queryList || [];
          return getFieldSchema({ appID, tableID })
            .then((res: any)=>{
              const schemaFields = schemaToFields(res);
              const normalFields = schemaFields?.filter((fieldSchema) => {
                return fieldSchema.componentName !== 'subtable';
              }).map((fieldSchema) => {
                return {
                  label: fieldSchema.title,
                  value: fieldSchema.id,
                };
              });

              const tableSchemaMap = schemaToMap(res, (currentSchema: SchemaFieldItem) => {
                return currentSchema.componentName !== 'associatedrecords';
              });
              const schemaToTransform = { ...res, properties: tableSchemaMap };
              const subFields = transformSchema(schemaToTransform, { filterSubTable: true })?.properties;
              const subtableFields: any = [];
              for (const key in subFields) {
                // const curentSubTableFields = subFields?.[key]?.properties;
                // for (const k in curentSubTableFields) {
                //   subtableFields.push({
                //     label: `${subFields?.[key]?.['x-component-props']?.title}.${curentSubTableFields?.[k]?.['x-component-props']?.title }`,
                //     value: `${k}`,
                //   });
                // }
                subtableFields.push({
                  label: `${subFields?.[key]?.['x-component-props']?.title}`,
                  value: `${key}`,
                });
              }
              queryList?.forEach((child: any)=>{
                const lable = [...normalFields, ...subtableFields]?.find((item: any)=>item?.value === child?.value?.[0])?.label;
                if (lable) {
                  options?.push({
                    label: nodeDataName + '.' + lable,
                    value: `$(task.${item?.id}.output.${child?.queryVal})`,
                    nodeID: item?.id,
                  });
                }
              });
              return res;
            });
        });
      }
    });

    Promise.all(allArr?.map((item: any)=>item()))
      .then((res: any)=>{
        setNodesOutputOptions(options);
      }).catch((err: any)=>{
      });
  }
};
