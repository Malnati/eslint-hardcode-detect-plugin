#!/usr/bin/env node
/**
 * Extrai blocos ```mermaid de ficheiros .md, gera SVG via Kroki (POST),
 * grava em docs/assets/diagrams/generated/ e substitui o bloco por imagem + detalhe com fonte.
 *
 * Uso: MERMAID_REGEN=1 npm run docs:generate-mermaid-svgs
 * Requer rede (kroki.io). Node 22+.
 *
 * Para voltar a gerar depois de editar o texto dentro de <details>: nesse bloco,
 * renomear a cerca de ```text para ```mermaid, correr este script (procura ```mermaid),
 * e o ficheiro volta com imagem + ```text na fonte.
 */
import { createHash } from "node:crypto";
import {
  existsSync,
  globSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const outDir = join(repoRoot, "docs/assets/diagrams/generated");
const KROKI = "https://kroki.io/mermaid/svg";

const MERMAID_BLOCK = /```mermaid\r?\n([\s\S]*?)```/g;

function hashId(s) {
  return createHash("sha256").update(s, "utf8").digest("hex").slice(0, 14);
}

async function krokiToSvg(source) {
  const res = await fetch(KROKI, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
      Accept: "image/svg+xml",
    },
    body: source.trimEnd() + "\n",
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Kroki ${res.status}: ${t.slice(0, 500)}`);
  }
  return res.text();
}

function relLink(fromMdPath, svgPath) {
  const fromDir = dirname(fromMdPath);
  let r = relative(fromDir, svgPath);
  if (!r.startsWith(".") && !r.startsWith("/")) {
    r = `./${r}`;
  }
  return r.split("\\").join("/");
}

function altFromSource(source) {
  const line = source.split(/\r?\n/).find((l) => l.trim().length > 0) ?? "Diagram";
  const cleaned = line.replace(/[[\]]/g, " ").trim();
  return cleaned.length > 100 ? `${cleaned.slice(0, 97)}…` : cleaned;
}

async function main() {
  const force = process.env.MERMAID_REGEN === "1";
  mkdirSync(outDir, { recursive: true });

  const mdFiles = [
    join(repoRoot, "README.md"),
    ...globSync(join(repoRoot, "docs/**/*.md")),
    ...globSync(join(repoRoot, "packages/*/README.md")),
  ];

  let totalBlocks = 0;
  let filesChanged = 0;

  for (const mdPath of mdFiles) {
    const text = readFileSync(mdPath, "utf8");
    const matches = [...text.matchAll(MERMAID_BLOCK)];
    if (matches.length === 0) {
      continue;
    }

    let out = "";
    let lastIndex = 0;

    for (const m of matches) {
      const full = m[0];
      const source = m[1];
      const id = hashId(source);
      const svgName = `mermaid-${id}.svg`;
      const svgPath = join(outDir, svgName);

      if (force || !existsSync(svgPath)) {
        process.stdout.write(`Generating ${svgName}...\n`);
        const svg = await krokiToSvg(source);
        writeFileSync(svgPath, svg, "utf8");
      }

      const link = relLink(mdPath, svgPath);
      const alt = altFromSource(source);
      const replacement = `![${alt}](${link})\n\n<details>\n<summary>Fonte Mermaid</summary>\n\n\`\`\`text\n${source.trimEnd()}\n\`\`\`\n\n</details>`;

      out += text.slice(lastIndex, m.index);
      out += replacement;
      lastIndex = m.index + full.length;
      totalBlocks += 1;
    }

    out += text.slice(lastIndex);

    if (out !== text) {
      writeFileSync(mdPath, out, "utf8");
      filesChanged += 1;
      process.stdout.write(`Updated ${relative(repoRoot, mdPath)}\n`);
    }
  }

  process.stdout.write(
    `\nDone: ${totalBlocks} diagram(s); ${filesChanged} file(s) updated.\n`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
