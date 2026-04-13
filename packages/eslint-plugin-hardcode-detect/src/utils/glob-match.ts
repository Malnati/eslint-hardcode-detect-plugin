/**
 * Correspondência mínima estilo glob (`*`, `?`, `**`) para caminhos POSIX relativos.
 * Não depende de pacotes externos; adequado a `remediationIncludeGlobs` / `remediationExcludeGlobs`.
 */

function segmentToRegex(segment: string): RegExp {
  let re = "^";
  for (let i = 0; i < segment.length; i++) {
    const c = segment[i];
    if (c === "*") {
      re += "[^/]*";
    } else if (c === "?") {
      re += "[^/]";
    } else if (".^$+()[]{}|\\".includes(c)) {
      re += `\\${c}`;
    } else {
      re += c;
    }
  }
  re += "$";
  return new RegExp(re);
}

function matchSegment(pathSegment: string, patternSegment: string): boolean {
  if (!patternSegment.includes("*") && !patternSegment.includes("?")) {
    return pathSegment === patternSegment;
  }
  return segmentToRegex(patternSegment).test(pathSegment);
}

/**
 * `pathParts` e `patternParts` já divididos por `/` (sem barras vazias).
 */
function matchParts(
  pathParts: string[],
  patternParts: string[],
  i: number,
  j: number,
): boolean {
  if (j === patternParts.length) {
    return i === pathParts.length;
  }
  const p = patternParts[j];
  if (p === "**") {
    if (j === patternParts.length - 1) {
      return true;
    }
    for (let k = i; k <= pathParts.length; k++) {
      if (matchParts(pathParts, patternParts, k, j + 1)) {
        return true;
      }
    }
    return false;
  }
  if (i >= pathParts.length) {
    return false;
  }
  if (!matchSegment(pathParts[i], p)) {
    return false;
  }
  return matchParts(pathParts, patternParts, i + 1, j + 1);
}

/**
 * Verifica se `filePath` (relativo, barras `/`) casa com `pattern` estilo glob.
 */
export function globMatch(filePath: string, pattern: string): boolean {
  const norm = filePath.replace(/\\/g, "/").replace(/^\/+/, "");
  const pat = pattern.replace(/\\/g, "/").replace(/^\/+/, "");
  const pathParts = norm === "" ? [] : norm.split("/");
  const patternParts = pat === "" ? [] : pat.split("/");
  if (patternParts.length === 0) {
    return pathParts.length === 0;
  }
  return matchParts(pathParts, patternParts, 0, 0);
}
