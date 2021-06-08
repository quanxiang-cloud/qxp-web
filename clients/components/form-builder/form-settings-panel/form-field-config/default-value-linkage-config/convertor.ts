export function convertFormValues(
  values: any,
  appID: string,
  linkageTables: Array<FormBuilder.Option>,
): FormBuilder.DefaultValueLinkage {
  return {
    linkedAppID: appID,
    linkedTable: {
      id: values.linkedTableID,
      name: linkageTables.find((option) => option.value === values.linkedTableID)?.label || '',
    },
    linkedTableSortRules: [`${values.sortOrder || '+'}${values.sortBy}`],
    linkedField: values.linkedField,
    targetField: '',
    ruleJoinOperator: values.ruleJoinOperator,
    rules: values.rules,
  };
}

export function convertLinkage(linkage: FormBuilder.DefaultValueLinkage) {
  const sortRule = `${linkage.linkedTableSortRules[0] || ''}`;
  const sortOrder = sortRule.startsWith('-') ? '-' : '+';
  const sortBy = /[^+-].*/.exec(sortRule)?.[0] || '';
  return {
    linkedTableID: linkage.linkedTable?.id,
    sortBy: sortBy,
    sortOrder: sortOrder,
    ruleJoinOperator: linkage.ruleJoinOperator,
    rules: linkage.rules || [],
    linkedField: linkage.linkedField,
  };
}
