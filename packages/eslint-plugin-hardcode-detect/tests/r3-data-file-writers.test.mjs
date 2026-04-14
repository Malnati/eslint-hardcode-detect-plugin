import assert from "node:assert/strict";
import { test } from "node:test";
import {
  mergePlainObjectDeep,
  parseJsonRootObject,
  parseYamlRootObject,
  sortKeysDeep,
  stableStringifyJson,
  stableStringifyYaml,
} from "../dist/index.js";

test("sortKeysDeep ordena chaves em todos os níveis", () => {
  const out = sortKeysDeep({ z: 1, a: { m: 2, b: 3 } });
  assert.deepEqual(out, { a: { b: 3, m: 2 }, z: 1 });
});

test("stableStringifyJson é determinístico (ordem de chaves)", () => {
  const a = stableStringifyJson({ b: 1, a: 2 });
  const b = stableStringifyJson({ a: 2, b: 1 });
  assert.equal(a, b);
  assert.ok(a.includes('"a"'));
});

test("merge-keys sobrescreve folhas em conflito", () => {
  const r = mergePlainObjectDeep(
    { x: { y: 1 }, k: "a" },
    { x: { y: 2 }, k: "a" },
    "merge-keys",
  );
  assert.equal(r.ok, true);
  assert.deepEqual(r.merged, { k: "a", x: { y: 2 } });
});

test("fail-on-conflict rejeita folhas diferentes", () => {
  const r = mergePlainObjectDeep({ a: 1 }, { a: 2 }, "fail-on-conflict");
  assert.equal(r.ok, false);
  assert.deepEqual(r.conflictPath, ["a"]);
});

test("fail-on-conflict aceita objectos aninhados fundíveis", () => {
  const r = mergePlainObjectDeep(
    { a: { b: 1 } },
    { a: { c: 2 } },
    "fail-on-conflict",
  );
  assert.equal(r.ok, true);
  assert.deepEqual(r.merged, { a: { b: 1, c: 2 } });
});

test("parseJsonRootObject e parseYamlRootObject — UTF-8", () => {
  const j = parseJsonRootObject('{"msg":"café","n":1}');
  assert.deepEqual(j, { msg: "café", n: 1 });
  const y = parseYamlRootObject("msg: olá\nn: 2\n");
  assert.deepEqual(y, { msg: "olá", n: 2 });
});

test("stableStringifyYaml produz saída ordenada", () => {
  const s = stableStringifyYaml({ zebra: 1, alpha: { q: 3, p: 4 } });
  const lines = s.split("\n");
  assert.ok(lines.some((l) => l.includes("alpha:")));
});
