export function filterFileName(input) {
  if (!input) return "";

  const base = input.split(/[/\\]/).pop() || "";

  return base.replace(/^\d+-/, "");
}