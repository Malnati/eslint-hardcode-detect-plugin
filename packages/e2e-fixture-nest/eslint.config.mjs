// @ts-check
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Sem HCD_E2E_REGISTRY_PLUGIN_ROOT: plugin do monorepo (desenvolvimento local).
 * Com env (e2e via `npm test` no pacote do plugin): artefacto instalado do npm registry.
 */
async function loadHardcodeDetect() {
  const root = process.env.HCD_E2E_REGISTRY_PLUGIN_ROOT;
  if (root) {
    const entry = path.join(root, 'dist', 'index.js');
    return (await import(pathToFileURL(entry))).default;
  }
  const local = new URL(
    '../eslint-plugin-hardcode-detect/dist/index.js',
    import.meta.url,
  );
  return (await import(local.href)).default;
}

export default (async () => {
  const hardcodeDetect = await loadHardcodeDetect();

  return tseslint.config(
    {
      ignores: ['dist/**', 'node_modules/**', 'coverage/**', 'eslint.config.mjs'],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    eslintPluginPrettierRecommended,
    {
      languageOptions: {
        globals: {
          ...globals.node,
          ...globals.jest,
        },
        sourceType: 'commonjs',
        parserOptions: {
          projectService: true,
          tsconfigRootDir: __dirname,
        },
      },
    },
    {
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-floating-promises': 'warn',
        '@typescript-eslint/no-unsafe-argument': 'warn',
        'prettier/prettier': ['error', { endOfLine: 'auto' }],
      },
    },
    {
      files: ['src/**/*.ts'],
      plugins: {
        'hardcode-detect': hardcodeDetect,
      },
      rules: {
        'hardcode-detect/no-hardcoded-strings': 'error',
      },
    },
  );
})();
