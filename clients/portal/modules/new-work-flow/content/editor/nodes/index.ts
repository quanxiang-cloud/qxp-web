import FormDataNode from './form-data';
import EndNode from './end';
import FillInNode from './fill-in';
import ApproveNode from './approve';
import DelayedNode from './delayed';
import ProcessBranchNode from './process-branch';
import ProcessBranchSourceNode from './process-branch-source';
import ProcessBranchTargetNode from './process-branch-target';
import ProcessVariableAssignmentNode from './process-variable-assignment';
import TableDataCreateNode from './table-data-create';
import TableDataUpdateNode from './table-data-update';
import TableDataQueryNode from './table-data-query';
import SendEmailNode from './send-email';
import WebMessage from './web-message';
import CCNode from './cc';
import Webhook from './webhook';

const nodeTypes = {
  formData: FormDataNode,
  end: EndNode,
  fillIn: FillInNode,
  FORM_TIME: DelayedNode,
  approve: ApproveNode,
  processBranch: ProcessBranchNode,
  processVariableAssignment: ProcessVariableAssignmentNode,
  tableDataCreate: TableDataCreateNode,
  tableDataUpdate: TableDataUpdateNode,
  tableDataQuery: TableDataQueryNode,
  email: SendEmailNode,
  letter: WebMessage,
  autocc: CCNode,
  processBranchSource: ProcessBranchSourceNode,
  processBranchTarget: ProcessBranchTargetNode,
  webhook: Webhook,
};

export default nodeTypes;
