#!/usr/bin/env bash
set -euo pipefail

if [[ $# -gt 1 ]]; then
  echo "Usage: $0 <APK|AAB|AAR|directory>" >&2
  exit 2
fi

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
target=${1:-"$project_root/node_modules/expo-sqlite/local-maven-repo/host/exp/exponent/expo.modules.sqlite/57.0.1/expo.modules.sqlite-57.0.1.aar"}
if [[ ! -e "$target" ]]; then
  echo "Target not found: $target" >&2
  exit 2
fi

if ! command -v readelf >/dev/null 2>&1; then
  echo "readelf is required" >&2
  exit 2
fi

audit_root=$target
audit_tmp=
cleanup() {
  if [[ -n "$audit_tmp" && -d "$audit_tmp" ]]; then
    rm -rf -- "$audit_tmp"
  fi
}
trap cleanup EXIT

if [[ -f "$target" ]]; then
  case "$target" in
    *.apk|*.aab|*.aar)
      if ! command -v unzip >/dev/null 2>&1; then
        echo "unzip is required for archive inspection" >&2
        exit 2
      fi
      audit_tmp=$(mktemp -d /tmp/flow-hijacked-16kb-XXXXXX)
      unzip -q "$target" -d "$audit_tmp"
      audit_root=$audit_tmp
      ;;
    *)
      echo "Expected an APK, AAB, AAR, or directory" >&2
      exit 2
      ;;
  esac
fi

checked=0
failed=0
while IFS= read -r -d '' library; do
  relative=${library#"$audit_root"/}
  case "$relative" in
    *arm64-v8a*|*x86_64*) ;;
    *) continue ;;
  esac

  checked=$((checked + 1))
  minimum=2147483647
  load_count=0
  while IFS= read -r align; do
    load_count=$((load_count + 1))
    value=$((align))
    if (( value < minimum )); then
      minimum=$value
    fi
  done < <(readelf -lW "$library" | awk '$1 == "LOAD" { print $NF }')

  if (( load_count == 0 )); then
    echo "FAIL  $relative (no ELF LOAD segments)"
    failed=$((failed + 1))
  elif (( minimum < 16384 )); then
    printf 'FAIL  %s (minimum LOAD alignment: 0x%x)\n' "$relative" "$minimum"
    failed=$((failed + 1))
  else
    printf 'PASS  %s (minimum LOAD alignment: 0x%x)\n' "$relative" "$minimum"
  fi
done < <(find "$audit_root" -type f -name '*.so' -print0 | sort -z)

if (( checked == 0 )); then
  echo "FAIL  no 64-bit shared libraries were found" >&2
  exit 1
fi

echo "Checked $checked 64-bit shared libraries; failures: $failed"
if (( failed > 0 )); then
  exit 1
fi

if [[ -f "$target" && "$target" == *.apk ]] && command -v zipalign >/dev/null 2>&1; then
  zipalign -c -P 16 -v 4 "$target"
fi
