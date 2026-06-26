export function renderTemplate(
  template: string,
  variables: Record<string, string>,
) {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key: string) => {
    return variables[key] ?? "";
  });
}
