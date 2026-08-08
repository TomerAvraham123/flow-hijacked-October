#!/usr/bin/env bash
set -Eeuo pipefail

readonly EXPECTED_REPOSITORY="TomerAvraham123/flow-hijacked-android"
readonly EXPECTED_ARCHIVE_SHA256="934edcb9e0446124068bc2871632f2353bfc4e536eff8df438aafe6ec7c97c1f"
readonly EXPECTED_FILE_COUNT="194"
readonly EXPECTED_OWNER="flowhijacked1s-team"
readonly EXPECTED_PROJECT_ID="c20009e1-5656-4253-83b4-75a644403efc"
readonly EXPECTED_UPDATES_VERSION="~57.0.12"
readonly RELEASE_BRANCH="release/v1.0.0-eas-final"

die() {
  printf 'ERROR: %s\n' "$*" >&2
  exit 1
}

note() {
  printf '\n==> %s\n' "$*"
}

for command_name in git python3 sha256sum npm npx tee; do
  command -v "$command_name" >/dev/null 2>&1 || die "Required command is missing: $command_name"
done

archive="${1:-Flow-Hijacked-Android-v1.0.0-source.zip}"
mode="${2:-}"
[[ -f "$archive" ]] || die "Archive not found: $archive"
[[ -z "$mode" || "$mode" == "--publish-only" ]] || die "Usage: bash $(basename "$0") [SOURCE.zip] [--publish-only]"

repo_root="$(git rev-parse --show-toplevel 2>/dev/null)" || die "Run this inside the GitHub Codespace for $EXPECTED_REPOSITORY."
git_dir="$(git -C "$repo_root" rev-parse --absolute-git-dir)"
origin_url="$(git -C "$repo_root" config --get remote.origin.url || true)"

case "$origin_url" in
  "https://github.com/$EXPECTED_REPOSITORY"|"https://github.com/$EXPECTED_REPOSITORY.git"|"git@github.com:$EXPECTED_REPOSITORY.git"|"ssh://git@github.com/$EXPECTED_REPOSITORY.git") ;;
  *) die "This Codespace is not attached to https://github.com/$EXPECTED_REPOSITORY (origin is: ${origin_url:-missing})." ;;
esac

archive_dir="$(cd "$(dirname "$archive")" && pwd -P)"
archive_path="$archive_dir/$(basename "$archive")"
release_tmp="$(mktemp -d -t flow-hijacked-release.XXXXXX)"
extract_root="$release_tmp/extracted"
source_root="$extract_root/flow-hijacked-android"
index_file="$release_tmp/release.index"
build_worktree="$release_tmp/build-worktree"
npm_cache="$release_tmp/npm-cache"
session_login=0
token_login=0
worktree_added=0

eas_cli() {
  npx --yes --cache "$npm_cache" eas-cli@latest "$@"
}

cleanup() {
  local status=$?
  trap - EXIT INT TERM

  if [[ "$session_login" == "1" ]]; then
    eas_cli account:logout >/dev/null 2>&1 || true
  fi
  if [[ "$token_login" == "1" ]]; then
    unset EXPO_TOKEN
  fi
  if [[ "$worktree_added" == "1" ]]; then
    git -C "$repo_root" worktree remove --force "$build_worktree" >/dev/null 2>&1 || true
  fi
  rm -rf -- "$release_tmp"
  exit "$status"
}
trap cleanup EXIT INT TERM

note "Verifying the preserved v1.0.0 archive"
actual_sha256="$(sha256sum "$archive_path" | awk '{print $1}')"
[[ "$actual_sha256" == "$EXPECTED_ARCHIVE_SHA256" ]] || die "Archive checksum mismatch. Expected $EXPECTED_ARCHIVE_SHA256 but got $actual_sha256."

mkdir -p "$extract_root"
python3 - "$archive_path" "$extract_root" "$EXPECTED_FILE_COUNT" "$EXPECTED_OWNER" "$EXPECTED_PROJECT_ID" "$EXPECTED_UPDATES_VERSION" <<'PY'
import json
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import stat
import sys
import zipfile

archive = Path(sys.argv[1])
destination = Path(sys.argv[2])
expected_count = int(sys.argv[3])
expected_owner = sys.argv[4]
expected_project_id = sys.argv[5]
expected_updates_version = sys.argv[6]
root_name = "flow-hijacked-android"

forbidden_directories = {
    ".cxx", ".eas", ".expo", ".git", ".gradle", ".next",
    "build", "coverage", "deriveddata", "dist", "generated",
    "node_modules", "out", "pods",
}
forbidden_suffixes = {
    ".aab", ".apk", ".ipa", ".jks", ".key", ".keystore",
    ".mobileprovision", ".p12", ".p8", ".pem",
}
secret_patterns = [
    re.compile(rb"sk-(?:proj|svcacct)-[A-Za-z0-9_-]{20,}", re.I),
    re.compile(rb"AIza[0-9A-Za-z_-]{30,}"),
    re.compile(rb"AKIA[0-9A-Z]{16}"),
    re.compile(rb"gh[pousr]_[A-Za-z0-9_]{30,}"),
    re.compile(rb"xox[baprs]-[A-Za-z0-9-]{20,}"),
    re.compile(rb"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"),
    re.compile(rb'"private_key"\s*:', re.I),
    re.compile(rb'"client_secret"\s*:', re.I),
]

with zipfile.ZipFile(archive) as source_zip:
    bad_crc = source_zip.testzip()
    if bad_crc is not None:
        raise SystemExit(f"ZIP integrity check failed at: {bad_crc}")

    files = []
    seen = set()
    for info in source_zip.infolist():
        raw_name = info.filename
        if "\\" in raw_name:
            raise SystemExit(f"Unsafe ZIP path: {raw_name}")

        path = PurePosixPath(raw_name)
        if path.is_absolute() or ".." in path.parts or not path.parts or path.parts[0] != root_name:
            raise SystemExit(f"Unsafe ZIP path: {raw_name}")

        unix_mode = (info.external_attr >> 16) & 0o177777
        if stat.S_IFMT(unix_mode) == stat.S_IFLNK:
            raise SystemExit(f"Symbolic links are not allowed: {raw_name}")

        if info.is_dir():
            continue
        if raw_name in seen:
            raise SystemExit(f"Duplicate ZIP path: {raw_name}")
        seen.add(raw_name)

        relative_parts = path.parts[1:]
        lowered_parts = tuple(part.lower() for part in relative_parts)
        if any(part in forbidden_directories for part in lowered_parts[:-1]):
            raise SystemExit(f"Generated/cache directory found: {raw_name}")

        filename = lowered_parts[-1]
        if filename == "google-services.json":
            raise SystemExit(f"Service credentials are not allowed: {raw_name}")
        if filename == ".env" or (filename.startswith(".env.") and filename != ".env.example"):
            raise SystemExit(f"Environment secrets are not allowed: {raw_name}")
        if any(filename.endswith(suffix) for suffix in forbidden_suffixes):
            raise SystemExit(f"Signing/binary artifact is not allowed: {raw_name}")

        files.append((info, path))

    if len(files) != expected_count:
        raise SystemExit(f"Expected {expected_count} files, found {len(files)}")

    for info, path in files:
        target = destination.joinpath(*path.parts)
        target.parent.mkdir(parents=True, exist_ok=True)
        with source_zip.open(info) as source, target.open("wb") as output:
            shutil.copyfileobj(source, output)
        mode = ((info.external_attr >> 16) & 0o777) or 0o644
        os.chmod(target, mode)

source_root = destination / root_name
app = json.loads((source_root / "app.json").read_text(encoding="utf-8"))
expo = app.get("expo", {})
if expo.get("owner") != expected_owner:
    raise SystemExit("app.json has the wrong EAS owner")
if expo.get("version") != "1.0.0":
    raise SystemExit("app.json has the wrong release version")
if expo.get("android", {}).get("package") != "com.flowhijacked.app":
    raise SystemExit("app.json has the wrong Android package")
if expo.get("extra", {}).get("eas", {}).get("projectId") != expected_project_id:
    raise SystemExit("app.json has the wrong EAS project ID")
expected_updates_url = f"https://u.expo.dev/{expected_project_id}"
if expo.get("updates", {}).get("url") != expected_updates_url:
    raise SystemExit("app.json is missing the canonical EAS Update URL")

package = json.loads((source_root / "package.json").read_text(encoding="utf-8"))
if package.get("dependencies", {}).get("expo-updates") != expected_updates_version:
    raise SystemExit("package.json is missing the pinned SDK-compatible expo-updates dependency")
doctor_check = package.get("expo", {}).get("doctor", {}).get("appConfigFieldsNotSyncedCheck", {})
if doctor_check.get("enabled") is not False:
    raise SystemExit("Expo Doctor is not configured for the audited native-project release workflow")

gradlew = source_root / "android/gradlew"
if not gradlew.is_file():
    raise SystemExit("The native Android Gradle wrapper is missing")
if not gradlew.stat().st_mode & stat.S_IXUSR:
    raise SystemExit("The native Android Gradle wrapper is not executable")

expected_easignore = [
    "node_modules/",
    ".expo/",
    "dist/",
    "coverage/",
    "*.jks",
    "*.keystore",
    "google-services.json",
    ".env",
    ".env.*",
    "!.env.example",
    "npm-debug.log*",
]
easignore_path = source_root / ".easignore"
if not easignore_path.is_file():
    raise SystemExit(".easignore is missing; EAS would inherit the Android exclusion from .gitignore")
if easignore_path.read_text(encoding="utf-8").splitlines() != expected_easignore:
    raise SystemExit(".easignore does not match the audited upload rules")

manifest = (source_root / "android/app/src/main/AndroidManifest.xml").read_text(encoding="utf-8")
required_manifest_values = (
    'android:name="expo.modules.updates.ENABLED" android:value="true"',
    f'android:name="expo.modules.updates.EXPO_UPDATE_URL" android:value="{expected_updates_url}"',
)
if any(value not in manifest for value in required_manifest_values):
    raise SystemExit("Android native EAS Update configuration is incomplete")

eas = json.loads((source_root / "eas.json").read_text(encoding="utf-8"))
production = eas.get("build", {}).get("production", {})
production_android = production.get("android", {})
if production_android.get("buildType") != "app-bundle":
    raise SystemExit("eas.json production build is not an Android App Bundle")
if production_android.get("credentialsSource") != "remote":
    raise SystemExit("eas.json production credentials are not remote")
if production.get("channel") != "production":
    raise SystemExit("eas.json production update channel is not configured")

for path in source_root.rglob("*"):
    if not path.is_file():
        continue
    data = path.read_bytes()
    if any(pattern.search(data) for pattern in secret_patterns):
        relative = path.relative_to(source_root)
        raise SystemExit(f"Potential credential material found in: {relative}")

print(f"Verified: {len(files)} files; no dependencies, caches, secrets, signing material, or build outputs.")
PY

note "Creating an exact Git tree from only the verified source"
rm -f -- "$index_file"
(
  cd "$source_root"
  GIT_DIR="$git_dir" GIT_WORK_TREE="$source_root" GIT_INDEX_FILE="$index_file" git read-tree --empty
  GIT_DIR="$git_dir" GIT_WORK_TREE="$source_root" GIT_INDEX_FILE="$index_file" git add -f -A -- .
)

indexed_count="$(GIT_DIR="$git_dir" GIT_INDEX_FILE="$index_file" git ls-files -z | tr -cd '\0' | wc -c | tr -d ' ')"
[[ "$indexed_count" == "$EXPECTED_FILE_COUNT" ]] || die "The Git tree contains $indexed_count files instead of $EXPECTED_FILE_COUNT."
tree_sha="$(GIT_DIR="$git_dir" GIT_INDEX_FILE="$index_file" git write-tree)"

author_name="$(git -C "$repo_root" config --get user.name || true)"
author_email="$(git -C "$repo_root" config --get user.email || true)"
author_name="${author_name:-Flow Hijacked Release}"
author_email="${author_email:-release@flowhijacked.invalid}"
commit_message="Release Flow Hijacked Android v1.0.0 EAS-native-ready source

Verified archive SHA-256: $EXPECTED_ARCHIVE_SHA256
Files: $EXPECTED_FILE_COUNT
EAS project: $EXPECTED_PROJECT_ID"

commit_sha="$(printf '%s\n' "$commit_message" | \
  GIT_AUTHOR_NAME="$author_name" GIT_AUTHOR_EMAIL="$author_email" \
  GIT_COMMITTER_NAME="$author_name" GIT_COMMITTER_EMAIL="$author_email" \
  git -C "$repo_root" commit-tree "$tree_sha")"

remote_ref="refs/heads/$RELEASE_BRANCH"
remote_error="$release_tmp/ls-remote.err"
set +e
remote_line="$(git -C "$repo_root" ls-remote --exit-code --heads origin "$remote_ref" 2>"$remote_error")"
remote_status=$?
set -e

needs_push=0
case "$remote_status" in
  0)
    remote_commit="${remote_line%%[[:space:]]*}"
    git -C "$repo_root" fetch --quiet --force --no-tags origin "$remote_ref:refs/remotes/origin/$RELEASE_BRANCH"
    remote_tree="$(git -C "$repo_root" rev-parse "$remote_commit^{tree}")"
    [[ "$remote_tree" == "$tree_sha" ]] || die "Remote branch $RELEASE_BRANCH already exists with different content. Nothing was overwritten."
    release_commit="$remote_commit"
    printf 'Remote branch already contains the verified frozen source: %s\n' "$RELEASE_BRANCH"
    ;;
  2)
    release_commit="$commit_sha"
    needs_push=1
    ;;
  *)
    cat "$remote_error" >&2
    die "Could not inspect the GitHub release branch."
    ;;
esac

git -C "$repo_root" worktree add --quiet --detach "$build_worktree" "$release_commit"
worktree_added=1

note "Installing locked dependencies and repeating the release gates"
(
  cd "$build_worktree"
  npm --cache "$npm_cache/project" ci --no-audit --no-fund
  npm run typecheck
  npm run lint
  npm test -- --testTimeout=15000
  EXPO_NO_TELEMETRY=1 npx --yes --cache "$npm_cache/doctor" expo-doctor@latest
  EXPO_NO_TELEMETRY=1 npx expo export --platform android --output-dir "$release_tmp/android-export"
)

if [[ "$needs_push" == "1" ]]; then
  note "Publishing the verified source branch to GitHub"
  git -C "$repo_root" push origin "$release_commit:$remote_ref"
fi

printf '\nGitHub source branch: https://github.com/%s/tree/%s\n' "$EXPECTED_REPOSITORY" "$RELEASE_BRANCH"

if [[ "$mode" == "--publish-only" ]]; then
  note "Publish-only mode finished; EAS build was not started"
  exit 0
fi

note "Authenticating privately with Expo"
if ! eas_cli whoami >/dev/null 2>&1; then
  printf '%s\n' \
    'Nothing typed at the next prompt is sent to ChatGPT or committed to GitHub.' \
    'Choose Expo authentication:' \
    '  1) Expo username and password' \
    '  2) Temporary Expo access token (best for Google-only login)'
  read -r -p 'Enter 1 or 2: ' auth_choice
  case "$auth_choice" in
    1)
      eas_cli account:login --no-browser
      session_login=1
      ;;
    2)
      printf 'Create a temporary token in another tab: https://expo.dev/settings/access-tokens\n'
      read -r -s -p 'Paste the temporary Expo token (hidden): ' expo_token
      printf '\n'
      [[ -n "$expo_token" ]] || die "No Expo token was entered."
      export EXPO_TOKEN="$expo_token"
      unset expo_token
      token_login=1
      ;;
    *) die "Authentication choice must be 1 or 2." ;;
  esac
fi

expo_user="$(NO_COLOR=1 eas_cli whoami)"
printf 'Expo account: %s\n' "$expo_user"
project_info="$(cd "$build_worktree" && NO_COLOR=1 eas_cli project:info)"
printf '%s\n' "$project_info"
grep -Fq "$EXPECTED_OWNER" <<<"$project_info" || die "The authenticated Expo account cannot see owner $EXPECTED_OWNER."
grep -Fq "$EXPECTED_PROJECT_ID" <<<"$project_info" || die "EAS resolved a different project ID."

note "Inspecting the exact EAS upload archive"
eas_archive_inspect="$release_tmp/eas-archive-inspect"
(
  cd "$build_worktree"
  eas_cli build:inspect \
    --platform android \
    --stage archive \
    --profile production \
    --output "$eas_archive_inspect"
)
[[ -x "$eas_archive_inspect/android/gradlew" ]] || die "EAS upload inspection omitted executable android/gradlew. Build was not submitted."
printf 'Verified EAS upload: android/gradlew is present and executable.\n'

note "Starting the production Android App Bundle build on EAS"
printf '%s\n' \
  'If EAS asks about Android credentials, choose Generate new keystore.' \
  'The keystore stays in EAS remote credential storage and is never added to GitHub.'
build_log="$repo_root/Flow-Hijacked-EAS-build.log"
set +e
(
  cd "$build_worktree"
  eas_cli build \
    --platform android \
    --profile production \
    --clear-cache \
    --no-wait \
    --message "Flow Hijacked Android v1.0.0 EAS-native-ready source"
) 2>&1 | tee "$build_log"
build_status=${PIPESTATUS[0]}
set -e

if [[ "$build_status" != "0" ]]; then
  die "EAS build launch failed. The complete non-secret log is preserved at: $build_log"
fi

printf '\nEAS launch log: %s\n' "$build_log"

note "Production build submitted"
printf '%s\n' \
  'Open the EAS build URL printed above. When it succeeds, download the .aab for Play Console internal testing.' \
  'Delete this Codespace after the build to remove its temporary dependency checkout.'
