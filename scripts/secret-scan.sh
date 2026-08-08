#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Print file names only: a scan must never echo a credential into CI output.
high_confidence_pattern='(sk-(proj|svcacct)-[A-Za-z0-9_-]{20,}|AIza[0-9A-Za-z_-]{30,}|AKIA[0-9A-Z]{16}|gh[pousr]_[A-Za-z0-9_]{30,}|xox[baprs]-[A-Za-z0-9-]{20,}|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|"private_key"[[:space:]]*:|"client_secret"[[:space:]]*:)' 

matches="$(
  rg -l --hidden --no-messages -i "$high_confidence_pattern" "$project_root" \
    --glob '!node_modules/**' \
    --glob '!dist/**' \
    --glob '!android/**' \
    --glob '!coverage/**' \
    --glob '!docs/**' \
    --glob '!store/**' \
    --glob '!package-lock.json' \
    --glob '!scripts/secret-scan.sh' || true
)"

if [[ -n "$matches" ]]; then
  echo 'Potential credential material found in:' >&2
  printf '%s\n' "$matches" >&2
  exit 1
fi

for forbidden in .env google-services.json; do
  if [[ -e "$project_root/$forbidden" ]]; then
    echo "Forbidden release file present: $forbidden" >&2
    exit 1
  fi
done

if find "$project_root" -path "$project_root/node_modules" -prune -o -path "$project_root/android" -prune -o \
  \( -name '*.jks' -o -name '*.keystore' -o -name '*.p12' -o -name '*.pem' \) -print -quit | grep -q .; then
  echo 'Signing or private-key material is present outside excluded generated directories.' >&2
  exit 1
fi

echo 'Secret scan passed: no high-confidence credential material found.'
