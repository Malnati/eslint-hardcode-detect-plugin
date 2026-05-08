#!/usr/bin/env bash
set -euo pipefail

MEMORY_LIMIT="512m"
CPU_LIMIT="0.5"
MONITOR_SECONDS=0
INCLUDE_GLOBAL=1
DRY_RUN=0
TIMESTAMP="$(date +%Y%m%d%H%M%S)"
declare -a ROOTS=()

usage() {
  cat <<'EOF'
Usage: hardening-mcp.sh [options]

Hardens Codex/Docker MCP usage by:
1) Removing [mcp_servers.MCP_DOCKER] blocks from config.toml files
2) Applying memory/cpu limits to active docker-mcp containers
3) Killing orphan "docker mcp gateway run" processes
4) Removing docker-mcp containers
5) Optionally monitoring for respawn

Options:
  --memory <value>           Memory limit for docker-mcp containers (default: 512m)
  --cpus <value>             CPU limit for docker-mcp containers (default: 0.5)
  --root <path>              Root to scan for */.codex/config.toml (repeatable)
                             Default when omitted: $HOME
  --no-global                Do not include $HOME/.codex/config.toml directly
  --monitor-seconds <int>    Watch for MCP respawn for N seconds (default: 0)
  --dry-run                  Print actions without mutating files/processes/containers
  --help                     Show this help

Examples:
  hardening-mcp.sh
  hardening-mcp.sh --root "$HOME/GitHub" --root "$HOME/Documents" --monitor-seconds 300
  hardening-mcp.sh --memory 768m --cpus 1 --dry-run
EOF
}

log() {
  printf '[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$*"
}

run() {
  if [[ "$DRY_RUN" -eq 1 ]]; then
    log "DRY-RUN: $*"
  else
    eval "$@"
  fi
}

require_cmd() {
  local cmd="$1"
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "Required command not found: $cmd" >&2
    exit 1
  fi
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --memory)
      MEMORY_LIMIT="${2:-}"
      shift 2
      ;;
    --cpus)
      CPU_LIMIT="${2:-}"
      shift 2
      ;;
    --root)
      ROOTS+=("${2:-}")
      shift 2
      ;;
    --no-global)
      INCLUDE_GLOBAL=0
      shift
      ;;
    --monitor-seconds)
      MONITOR_SECONDS="${2:-0}"
      shift 2
      ;;
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ ${#ROOTS[@]} -eq 0 ]]; then
  ROOTS=("$HOME")
fi

if ! [[ "$MONITOR_SECONDS" =~ ^[0-9]+$ ]]; then
  echo "--monitor-seconds must be an integer >= 0" >&2
  exit 1
fi

require_cmd awk
require_cmd find
require_cmd grep
require_cmd docker
require_cmd pgrep
require_cmd ps
require_cmd xargs

log "Starting MCP hardening"
log "Settings: memory=$MEMORY_LIMIT cpu=$CPU_LIMIT monitor_seconds=$MONITOR_SECONDS dry_run=$DRY_RUN"

declare -A SEEN=()
declare -a CONFIG_FILES=()

add_config() {
  local f="$1"
  if [[ -f "$f" && -z "${SEEN["$f"]+x}" ]]; then
    SEEN["$f"]=1
    CONFIG_FILES+=("$f")
  fi
}

if [[ "$INCLUDE_GLOBAL" -eq 1 ]]; then
  add_config "$HOME/.codex/config.toml"
fi

for root in "${ROOTS[@]}"; do
  if [[ -d "$root" ]]; then
    while IFS= read -r -d '' cfg; do
      add_config "$cfg"
    done < <(find "$root" -type f -path '*/.codex/config.toml' -print0 2>/dev/null)
  fi
done

log "Config files found: ${#CONFIG_FILES[@]}"

changed=0
scanned=0

for file in "${CONFIG_FILES[@]}"; do
  scanned=$((scanned + 1))
  if grep -qE '^\[mcp_servers\.MCP_DOCKER\][[:space:]]*$' "$file"; then
    changed=$((changed + 1))
    backup="${file}.bak.${TIMESTAMP}"
    tmp="${file}.tmp.$$"
    log "Removing MCP_DOCKER block from: $file"
    run "cp \"$file\" \"$backup\""
    run "awk '
      BEGIN { skip=0 }
      \$0 ~ /^\\[mcp_servers\\.MCP_DOCKER\\][[:space:]]*$/ { skip=1; next }
      skip && \$0 ~ /^\\[/ { skip=0 }
      !skip { print }
    ' \"$file\" > \"$tmp\""
    run "mv \"$tmp\" \"$file\""
  fi
done

log "Config scan complete: scanned=$scanned changed=$changed"

log "Applying container limits to running docker-mcp containers"
running_ids="$(docker ps -q --filter label=docker-mcp=true)"
if [[ -n "$running_ids" ]]; then
  while IFS= read -r id; do
    [[ -z "$id" ]] && continue
    if [[ "$DRY_RUN" -eq 1 ]]; then
      log "DRY-RUN: docker update --memory $MEMORY_LIMIT --memory-swap $MEMORY_LIMIT --cpus $CPU_LIMIT $id"
    else
      if docker update --memory "$MEMORY_LIMIT" --memory-swap "$MEMORY_LIMIT" --cpus "$CPU_LIMIT" "$id" >/dev/null; then
        log "Updated limits: $id"
      else
        log "Warning: failed to update limits for $id"
      fi
    fi
  done <<<"$running_ids"
else
  log "No running docker-mcp containers found"
fi

log "Stopping docker mcp gateway processes"
if [[ "$DRY_RUN" -eq 1 ]]; then
  pgrep -af 'docker mcp gateway run|/docker-mcp mcp gateway run' || true
else
  pgrep -f 'docker mcp gateway run|/docker-mcp mcp gateway run' | xargs -r kill -TERM || true
  sleep 1
  pgrep -f 'docker mcp gateway run|/docker-mcp mcp gateway run' | xargs -r kill -KILL || true
fi

log "Removing all docker-mcp containers"
if [[ "$DRY_RUN" -eq 1 ]]; then
  docker ps -a --filter label=docker-mcp=true --format '{{.ID}} {{.Image}} {{.Status}} {{.Names}}' || true
else
  docker ps -aq --filter label=docker-mcp=true | xargs -r -n1 docker rm -f >/dev/null || true
fi

log "Validation snapshot"
left_containers="$(docker ps -a --filter label=docker-mcp=true -q | wc -l | tr -d ' ')"
left_gateways="$(ps -axo command= | grep -E 'docker mcp gateway run|/docker-mcp mcp gateway run' | grep -v -E 'grep|pgrep|hardening-mcp.sh' | wc -l | tr -d ' ')"
log "Remaining docker-mcp containers: $left_containers"
log "Remaining gateway processes: $left_gateways"

if [[ "$MONITOR_SECONDS" -gt 0 ]]; then
  if [[ "$DRY_RUN" -eq 1 ]]; then
    log "DRY-RUN: skipping monitor loop"
  else
    log "Monitoring for respawn for ${MONITOR_SECONDS}s"
    end=$((SECONDS + MONITOR_SECONDS))
    check=0
    while ((SECONDS < end)); do
      check=$((check + 1))
      total="$(docker ps --filter label=docker-mcp=true -q | wc -l | tr -d ' ')"
      sandbox="$(docker ps --format '{{.Image}}' | grep -c '^mcp/node-code-sandbox' || true)"
      log "monitor check=$check docker-mcp-running=$total node-code-sandbox-running=$sandbox"
      if [[ "$total" -ne 0 || "$sandbox" -ne 0 ]]; then
        log "Respawn detected"
        docker ps --filter label=docker-mcp=true --format '{{.ID}} {{.Image}} {{.Status}} {{.Names}}' || true
        exit 2
      fi
      sleep 30
    done
    log "Monitor window completed without respawn"
  fi
fi

log "Done"
log "Note: restart Codex app manually to ensure clean runtime after config changes."
