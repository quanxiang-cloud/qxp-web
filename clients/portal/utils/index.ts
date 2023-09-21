/* eslint-disable no-empty */
/* eslint-disable no-console */
/* eslint-disable guard-for-in */
import { parse } from 'qs';

import { FlowElement, isNode } from 'react-flow-renderer';

import dataTransfer from '@flow/content/editor/utils/data-transfer';
import type { Data, WorkFlow } from '@flow/content/editor/type';

export const getQuery = (key: string) => {
  const search = parse(document.location.search.slice(1));
  return search[key];
};

export const omitEmpty = (obj: any) => {
  const copy = {};
  for (const p in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, p) && obj[p] !== undefined) {
      Object.assign(copy, { [p]: obj[p] });
    }
  }
  return copy;
};

const getEdges = (nodes: any)=>{
  const edges: any[] = [];
  nodes.forEach((node: any)=>{
    const { id, data: { nodeData: { childrenID } } } = node;
    const len = childrenID.length;
    childrenID.forEach((childID: any)=>{
      edges.push({
        id: `e${id}-${childID}`,
        type: len > 1 ? 'step' : 'plus',
        source: id,
        target: childID,
      });
    });
  });
  return edges;
};

export const parseElements = (bpmn: WorkFlow): FlowElement<Data>[] =>{
  const { version } = bpmn;
  if (parseFloat(version) >= 0.3) {
    const nodes = JSON.parse(JSON.stringify(bpmn.shapes));
    nodes.forEach((item: any)=>{
      const processType = ['processBranchSource', 'processBranchTarget'];
      if (processType.includes(item?.type)) {
        item.data.nodeData.width = 50;
        item.data.nodeData.height = 25;
      } else {
        item.data.nodeData.width = 200;
        item.data.nodeData.height = 72;
      }
      try {
      } catch (error) {
      }
      if (item.type === 'fillIn') {
        try {
          const { businessData } = item.data;
          let { basicConfig } = businessData;
          basicConfig = basicConfig || {};
          businessData.events = {};
          businessData.operatorPermission = {
            custom: [],
            system: [],
          };
          basicConfig.autoRules = [];
          basicConfig.timeRule = {
            enabled: false,
            deadLine: {
              breakPoint: '',
              day: '',
              hours: '',
              minutes: '',
              urge: {
                day: '',
                hours: '',
                minutes: '',
                repeat: {
                  day: '',
                  hours: '',
                  minutes: '',
                },
              },
            },
            whenTimeout: {
              type: '',
              value: '',
            },
          },
          basicConfig.multiplePersonWay = 'or';
          basicConfig.whenNoPerson = 'transferAdmin';
          basicConfig.approvePersons = basicConfig.fillInPersons;
          basicConfig?.approvePersons?.departments && (basicConfig.approvePersons.departments = []);
          delete basicConfig.fillInPersons;
        } catch (error) {
          console.log(error);
        }
      }
    });
    const edges = getEdges(nodes);
    return dataTransfer({ version: bpmn.version, shapes: [...nodes, ...edges] }).shapes;
  } else {
    const elements = bpmn.shapes.filter(Boolean).map((element: FlowElement<Data>) => {
      if (isNode(element)) {
        Object.assign(element.data || {}, { type: element.type });
      }
      return element;
    });
    return dataTransfer({ version: bpmn.version, shapes: elements }).shapes;
  }
};
