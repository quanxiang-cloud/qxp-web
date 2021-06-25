import React from 'react';
import {
  Background,
  BackgroundVariant,
  MiniMap,
} from 'react-flow-renderer';

import Control from './control';
import FormDataNode from './nodes/form-data';
import EndNode from './nodes/end';
import FillInNode from './nodes/fill-in';
import ApproveNode from './nodes/approve';
import Plus from './edges/plus';
import ProcessBranchNode from './nodes/process-branch';
import ProcessBranchSourceNode from './nodes/process-branch-source';
import ProcessBranchTargetNode from './nodes/process-branch-target';
import ProcessVariableAssignmentNode from './nodes/process-variable-assignment';
import TableDataCreateNode from './nodes/table-data-create';
import TableDataUpdateNode from './nodes/table-data-update';
import SendEmailNode from './nodes/send-email';
import WebMessage from './nodes/web-message';
import CCNode from './nodes/cc';

export const nodeTypes = {
  formData: FormDataNode,
  end: EndNode,
  fillIn: FillInNode,
  approve: ApproveNode,
  processBranch: ProcessBranchNode,
  processVariableAssignment: ProcessVariableAssignmentNode,
  tableDataCreate: TableDataCreateNode,
  tableDataUpdate: TableDataUpdateNode,
  sendEmail: SendEmailNode,
  webMessage: WebMessage,
  cc: CCNode,
  processBranchSource: ProcessBranchSourceNode,
  processBranchTarget: ProcessBranchTargetNode,
};

export const edgeTypes = {
  plus: Plus,
};

export default function FlowConfig(): JSX.Element {
  return (
    <>
      <Background
        variant={BackgroundVariant.Dots}
        gap={12}
        size={0.5}
      />
      <MiniMap
        nodeColor={(node) => {
          switch (node.type) {
          case 'input':
            return 'red';
          case 'default':
            return '#00ff00';
          case 'output':
            return 'rgb(0,0,255)';
          default:
            return '#eee';
          }
        }}
        nodeStrokeWidth={3}
      />
      <Control className="left-16 top-16 right-16 flex absolute z-10" />
    </>
  );
}
