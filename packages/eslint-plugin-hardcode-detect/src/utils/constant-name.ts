/**
 * Gera identificadores estáveis em UPPER_SNAKE_CASE a partir do valor do literal.
 */

function hash6(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = (h * 33) ^ s.charCodeAt(i);
  }
  return (h >>> 0).toString(16).slice(0, 6).padStart(6, "0");
}

function slugUpperSnake(s: string): string {
  const parts = s
    .trim()
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((p) => p.toUpperCase());
  return parts.join("_");
}

/**
 * Produz um nome único no âmbito do ficheiro (via `usedNames`).
 */
export function uniqueConstantName(
  value: string,
  usedNames: Set<string>,
): string {
  let base = slugUpperSnake(value);
  if (base.length === 0 || !/[A-Z]/.test(base)) {
    base = `STR_${hash6(value)}`;
  }
  let name = base;
  let n = 2;
  while (usedNames.has(name)) {
    name = `${base}_${n}`;
    n++;
  }
  usedNames.add(name);
  return name;
}
