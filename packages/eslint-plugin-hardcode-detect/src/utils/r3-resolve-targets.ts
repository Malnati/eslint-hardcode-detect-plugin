/**
 * Resolve `dataFileTargets` (caminhos relativos ao cwd do ESLint) para caminhos absolutos.
 * Padrões glob simples `pasta/*.ext` (um `*` no último segmento) expandem-se com `readdir`;
 * outros globs podem não produzir correspondências até extensão futura.
 */

import fs from "node:fs";
import path from "node:path";

function hasGlobSyntax(t: string): boolean {
  for (const c of t) {
    if ("*?[]{}".includes(c)) {
      return true;
    }
  }
  return false;
}

function expandSimpleStarPattern(cwd: string, pattern: string): string[] {
  const norm = pattern.replace(/\\/g, "/").trim();
  const star = norm.indexOf("*");
  if (star < 0) {
    return [];
  }
  const slashBefore = norm.lastIndexOf("/", star);
  if (slashBefore < 0) {
    return [];
  }
  const relDir = norm.slice(0, slashBefore);
  const afterStar = norm.slice(star + 1);
  const dirAbs = path.resolve(cwd, relDir);
  if (!fs.existsSync(dirAbs) || !fs.statSync(dirAbs).isDirectory()) {
    return [];
  }
  const out: string[] = [];
  for (const name of fs.readdirSync(dirAbs)) {
    const joined = path.join(dirAbs, name);
    if (!fs.statSync(joined).isFile()) {
      continue;
    }
    if (afterStar === "" || name.endsWith(afterStar)) {
      out.push(joined);
    }
  }
  return out;
}

export function resolveDataFileTargetPaths(cwd: string, targets: string[]): string[] {
  const out = new Set<string>();
  for (const raw of targets) {
    const t = raw.trim().replace(/\\/g, "/");
    if (t.length === 0) {
      continue;
    }
    if (!hasGlobSyntax(t)) {
      out.add(path.resolve(cwd, t));
      continue;
    }
    const simple = expandSimpleStarPattern(cwd, t);
    if (simple.length > 0) {
      for (const p of simple) {
        out.add(p);
      }
    }
  }
  return [...out].sort((a, b) => a.localeCompare(b));
}
