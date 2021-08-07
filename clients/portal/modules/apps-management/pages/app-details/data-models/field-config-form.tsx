// import React from 'react';
// import { Select, InputNumber } from 'antd';

// const DATA_TYPE = [
//   {
//     label: 'String（字符串）',
//     value: 'string',
//   },
//   {
//     label: 'Date（时间日期型）',
//     value: 'datetime',
//   },
//   {
//     label: 'Array（数组）',
//     value: 'array',
//   },
//   {
//     label: 'Number（数值型）',
//     value: 'number',
//   },
//   {
//     label: 'Boolean（布尔型）',
//     value: 'boolean',
//   },
// ]
// export const FIELD_CONFIG_SCHEMA: ISchema = {
//   type: 'object',
//   properties: {
//     Fields: {
//       type: 'object',
//       'x-component': 'mega-layout',
//       properties: {
//         type: {
//           type: 'string',
//           title: '数据类型',
//           'x-component': 'Select',
//           enum: [
//             {
//               label: 'String（字符串）',
//               value: 'string',
//             },
//             {
//               label: 'Date（时间日期型）',
//               value: 'datetime',
//             },
//             {
//               label: 'Array（数组）',
//               value: 'array',
//             },
//             {
//               label: 'Number（数值型）',
//               value: 'number',
//             },
//             {
//               label: 'Boolean（布尔型）',
//               value: 'boolean',
//             },
//           ],
//           'x-index': 1,
//           'x-mega-props': {
//             labelAlign: 'top',
//           },
//         },
//         format: {
//           type: 'string',
//           title: '日期格式',
//           'x-component': 'Select',
//           required: true,
//           'x-rules': {
//             required: true,
//             message: '请选择日期格式',
//           },
//           enum: [
//             {
//               label: '年',
//               value: 'YYYY',
//             },
//             {
//               label: '年-月',
//               value: 'YYYY-MM',
//             },
//             {
//               label: '年-月-日',
//               value: 'YYYY-MM-DD',
//             },
//             {
//               label: '年-月-日 时-分',
//               value: 'YYYY-MM-DD HH:mm',
//             },
//             {
//               label: '年-月-日 时-分-秒',
//               value: 'YYYY-MM-DD HH:mm:ss',
//             },
//           ],
//           'x-index': 2,
//           'x-mega-props': {
//             labelAlign: 'top',
//           },
//           'x-linkages': [{
//             type: 'value:visible',
//             target: 'type',
//             condition: '{{ $value === "datetime" }}',
//           }],
//         },
//         length: {
//           type: 'number',
//           title: '长度',
//           default: 50,
//           required: true,
//           'x-rules': {
//             required: true,
//             message: '请输入长度',
//           },
//           'x-component': 'NumberPicker',
//           'x-index': 3,
//           'x-mega-props': {
//             labelAlign: 'top',
//           },
//           'x-linkages': [{
//             type: 'value:visible',
//             target: 'type',
//             condition: '{{ $value === "string" || $value === "number" }}',
//           }],
//         },
//         digits: {
//           type: 'number',
//           title: ' 小数点',
//           required: true,
//           'x-rules': {
//             required: true,
//             message: '请输入小数点位数',
//           },
//           'x-component': 'NumberPicker',
//           'x-index': 4,
//           'x-mega-props': {
//             labelAlign: 'top',
//           },
//           'x-linkages': [{
//             type: 'value:visible',
//             target: 'type',
//             condition: '{{ $value === "number" }}',
//           }],
//         },
//         validationRules: {
//           type: 'string',
//           title: '校验规则',
//           'x-component': 'Select',
//           'x-index': 5,
//           'x-mega-props': {
//             labelAlign: 'top',
//           },
//           'x-linkages': [{
//             type: 'value:visible',
//             target: 'type',
//             condition: '{{ $value === "string" }}',
//           }],
//         },
//       },
//     },
//   },
// };

// function FieldConfigForm(): JSX.Element {
//   console.log('131');
//   return (
//     <>
//       <Select options={} />
//     </>
//   );
// }

// // FieldConfigForm.isFieldComponent = true;

// export default FieldConfigForm;
