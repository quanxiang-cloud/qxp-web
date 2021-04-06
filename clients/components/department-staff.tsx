import React from 'react';

interface DepartmentStaffProps {
  department: string;
  count?: number;
  unit?: string;
}

export default function DepartmentStaff({ department, count = 0, unit }: DepartmentStaffProps) {
  return (
    <div className="mb-8 pl-20 flex items-center">
      <div className="h-full text-14 text-black-900 font-semibold">{department}</div>
      {unit && (
        <div className="h-full text-12 text-gray-400">
          （{count} {unit}）
        </div>
      )}
    </div>
  );
}
