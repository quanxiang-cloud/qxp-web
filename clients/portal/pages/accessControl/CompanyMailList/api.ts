import { QueryFunctionContext } from 'react-query';

import { httpPost } from '../../../../assets/lib/f';
import { IResponse } from '../../../../@types/interface/api';

import { TreeNode } from './DepartmentTree'


// ------------------ 部门 ---------------
// 获取部门树
export const getERPTree = () => {
  return httpPost<IResponse<TreeNode[]>>('/api/org/v1/DEPTree', null, {
    'Content-Type': 'application/x-www-form-urlencoded'
  }).then(( ({ data }) => data )}

/**
 * @returns 新增
 * @param departmentName true(true：必须 false：非必须)
 * @param departmentLeaderID false
 * @param pid true
 */
export const addDEP = () => {
  return httpPost<IResponse<TreeNode[]>>('/api/org/v1/addDEP', null, {
    'Content-Type': 'application/json'
  }).then(( ({ data }) => data )}

/**
 * @returns 管理员查询详情
 * @param id true
 */
export const getAdminDEPInfo = () => {
  return httpPost<IResponse<TreeNode[]>>('/api/org/v1/adminDEPInfo', null, {
    'Content-Type': 'application/json'
  }).then(( ({ data }) => data )}

/**
 * @returns 管理员分页查询
 * @param departmentName true
 * @param superPID false
 * @param pid false
 * @param page true
 * @param limit true
 */
 export const getAdminDEPList = (id: string) => {
  return httpPost<IResponse<TreeNode[]>>('/api/org/v1/adminDEPList', JSON.stringify({ id }), {
    'Content-Type': 'application/json'
  }).then(( ({ data }) => data )}

  /**
 * @returns 管理员顶层查询部门列表
 * @param superPID true
 * @param page true
 * @param limit true
 */
 export const getAdminDEPSuperPID = () => {
  return httpPost<IResponse<TreeNode[]>>('/api/org/v1/adminDEPSuperPID', null, {
    'Content-Type': 'application/json'
  }).then(( ({ data }) => data )}

/**
 * @returns 管理员查询当前层级部门列表
 * @param useStatus false
 * @param pid true
 * @param page true
 * @param limit true
 */
 export const getAdminDEPPID = () => {
  return httpPost<IResponse<TreeNode[]>>('/api/org/v1/adminDEPList', null, {
    'Content-Type': 'application/json'
  }).then(( ({ data }) => data )}

/**
 * @returns 修改
 * @param id false
 * @param departmentName false
 * @param departmentLeaderID false
 * @param useStatus false
 * @param pid false
 */
 export const updateDEP = () => {
  return httpPost<IResponse<TreeNode[]>>('/api/org/v1/updateDEP', null, {
    'Content-Type': 'application/json'
  }).then(( ({ data }) => data )}

/**
 * @returns 删除
 * @param id true
 */
 export const deleteDEP = (id: string) => {
   console.log(id);
  return httpPost<IResponse<{code: number}>>('/api/org/v1/delDEP', JSON.stringify({id}), {
    'Content-Type': 'application/json'
  }).then(( ({ data }) => {
    console.log(data);
    return data;
  } )}

/**
 * @returns 用户查询部门详情
 * @param id true
 */
 export const getUserDEPInfo = () => {
  return httpPost<IResponse<TreeNode[]>>('/api/org/v1/userDEPInfo', null, {
    'Content-Type': 'application/json'
  }).then(( ({ data }) => data )}