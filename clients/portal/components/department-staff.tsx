/**
 * 组件-部门人员
 */
import React from 'react';

interface DepartmentStaffProps {
  department: string;
  count?: number;
  unit?: string;
}

export const DepartmentStaff = ({ department, count = 0, unit }: DepartmentStaffProps) => {
  return (
    <div className="h-1-dot-9 pl-4 flex items-center">
      <div className="h-full leading-1-dot-9 text-dot-7 text-black font-semibold">{department}</div>
      {unit && (
        <div className="h-full leading-1-dot-9 text-dot-6 text-94A3B8">
          （{count} {unit}）
        </div>
      )}
    </div>
  );
};
