export function buildWhere<T extends Record<string, any>>(
  params: T,
  fields: (keyof T)[]
) {
  const where: Record<string, any> = {};
  fields.forEach((f) => {
    const v = params[f];
    if (v === undefined || v === null) return;
    if (Array.isArray(v)) {
      if (v.length === 0) return; // ignore empty arrays
      where[String(f)] = { in: v };
    } else if (v !== "") {
      where[String(f)] = v;
    }
  });
  return where;
}
