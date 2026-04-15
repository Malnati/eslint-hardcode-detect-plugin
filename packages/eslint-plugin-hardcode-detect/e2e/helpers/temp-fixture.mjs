import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { copyDirRecursive } from "./copy-dir-recursive.mjs";

/**
 * Copia uma fixture para um directório temporário (massa e2e descartável).
 * @param {string} sourceDir Caminho absoluto da pasta de origem
 * @param {string} [prefix="hcd-e2e-"] Prefixo para `fs.mkdtempSync`
 * @returns {string} Caminho absoluto da cópia
 */
export function createTempFixtureCopy(sourceDir, prefix = "hcd-e2e-") {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  copyDirRecursive(sourceDir, tempDir);
  return tempDir;
}

export function removeTempFixtureSync(tempDir) {
  fs.rmSync(tempDir, { recursive: true, force: true });
}

/**
 * Executa `fn(cwd)` com cópia temporária de `sourceDir`; remove a cópia no `finally`.
 * @template T
 * @param {string} sourceDir
 * @param {string} prefix
 * @param {(cwd: string) => T | Promise<T>} fn
 * @returns {Promise<T>}
 */
export async function withTempFixtureCopy(sourceDir, prefix, fn) {
  const dir = createTempFixtureCopy(sourceDir, prefix);
  try {
    return await fn(dir);
  } finally {
    removeTempFixtureSync(dir);
  }
}
