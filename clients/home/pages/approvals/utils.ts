export function parseFormValue(formData: TaskFormData): Record<string, any> {
  return Object.entries(formData || {}).reduce((acc, [key, { value }]) => {
    acc[key] = value;
    return acc;
  }, {} as Record<string, any>);
}

export function mapFormDataWithKey(formData: TaskFormData | Record<string, any>): Record<string, any> {
  return Object.entries(formData || {}).map(([key, item]) => {
    return { ...item, keyName: key };
  });
}
