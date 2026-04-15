import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

/**
 * Raiz do pacote `eslint-plugin-hardcode-detect` instalado via `e2e-registry-consumer`
 * (definido pelo orquestrador `run-e2e-with-registry.mjs`).
 * @returns {string}
 */
export function getRegistryPluginRoot() {
  const p = process.env.HCD_E2E_REGISTRY_PLUGIN_ROOT;
  if (!p) {
    throw new Error(
      "E2e requer o plugin instalado do registry: execute `npm test` no pacote eslint-plugin-hardcode-detect (o orquestrador define HCD_E2E_REGISTRY_PLUGIN_ROOT).",
    );
  }
  const resolved = path.resolve(p);
  const entry = path.join(resolved, "dist", "index.js");
  if (!fs.existsSync(entry)) {
    throw new Error(
      `HCD_E2E_REGISTRY_PLUGIN_ROOT inválido ou incompleto (falta ${entry}).`,
    );
  }
  return resolved;
}

/** @returns {Promise<unknown>} */
export async function loadRegistryPlugin() {
  const root = getRegistryPluginRoot();
  const mod = await import(pathToFileURL(path.join(root, "dist", "index.js")));
  return mod.default;
}

/**
 * Módulo interno do pacote publicado (testes apenas).
 * @returns {Promise<{ __resetR2FallbackIndexForTests: () => void }>}
 */
export async function loadR2LiteralIndexForTests() {
  const root = getRegistryPluginRoot();
  return import(
    pathToFileURL(path.join(root, "dist", "utils", "r2-literal-index.js"))
  );
}
