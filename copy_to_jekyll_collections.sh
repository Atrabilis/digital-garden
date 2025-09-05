#!/usr/bin/env bash
set -euo pipefail

# Copy-only migration into jekyll-site collections (NO config edits).
# - Never modifies, deletes, or moves sources.
# - Lowercases folder names and prefixes "_" for collection dirs.
# - For .md: if missing front matter, it is added ONLY IN THE COPIED VERSION.
# - If destination exists, the existing file is renamed to .bak, then the new file is written.
# - DRY_RUN is disabled by default (this writes!). Set DRY_RUN=true to simulate.

DRY_RUN=${DRY_RUN:-false}         # false = write changes; true = simulate
SITE_DIR="jekyll-site"
MISC_COLLECTION="_misc"

# Top-level exclusions in repo root
EXCLUDE_DIRS=("jekyll-site" ".git" ".github")
EXCLUDE_FILES=(".gitignore" "copy_to_jekyll_collections_safe.sh")

log() { printf '%s\n' "$*"; }
run() { if [[ "$DRY_RUN" == "false" ]]; then eval "$*"; else log "[DRY_RUN] $*"; fi; }

is_excluded_name() {
  local name="$1"
  for ex in "${EXCLUDE_DIRS[@]}"; do [[ "$name" == "$ex" ]] && return 0; done
  for ex in "${EXCLUDE_FILES[@]}"; do [[ "$name" == "$ex" ]] && return 0; done
  [[ "$name" == .* ]] && return 0   # dotfiles/dirs
  return 1
}

to_collection_dir() {
  local raw="$1"
  local lower; lower="$(echo "$raw" | tr '[:upper:]' '[:lower:]')"
  [[ "$lower" == _* ]] && echo "$lower" || echo "_$lower"
}

has_front_matter() {
  local file="$1"
  IFS= read -r first < "$file" || true
  [[ "$first" == "---" ]]
}

infer_title_from_filename() {
  local file="$1"
  local base="$(basename "$file" .md)"
  base="${base#_}"
  base="${base//_/ }"
  base="${base//-/ }"
  printf "%s" "${base^}"
}

safe_backup_then_place() {
  # place $2 at $1, backing up existing target first
  local dst="$1"
  local prepared_src="$2"

  if [[ -e "$dst" ]]; then
    local bak="${dst}.bak"
    log "  - Backup existing: $(basename "$dst") -> $(basename "$bak")"
    run "mv \"$dst\" \"$bak\""
  fi
  run "mkdir -p \"$(dirname "$dst")\""
  run "cp -a \"$prepared_src\" \"$dst\""
}

copy_md_with_optional_front_matter() {
  # Build a temp copy (adding front matter if missing), then place it
  local src_file="$1"
  local dst_file="$2"

  local tmp; tmp="$(mktemp)"
  if has_front_matter "$src_file"; then
    run "cat \"$src_file\" > \"$tmp\""
  else
    local title; title="$(infer_title_from_filename "$src_file")"
    {
      echo "---"
      echo "title: \"$title\""
      echo "layout: default"
      echo "---"
      echo
      cat "$src_file"
    } > "$tmp"
  fi

  safe_backup_then_place "$dst_file" "$tmp"
  run "rm -f \"$tmp\""
}

copy_one_file_preserving_structure() {
  local src_abs="$1"     # absolute source file path
  local src_root="$2"    # absolute source root folder being processed
  local target_coll="$3" # absolute path to collection folder inside SITE_DIR

  local rel="${src_abs#$src_root/}"
  local dirpart="$(dirname "$rel")"
  local fname="$(basename "$src_abs")"

  # lowercase name (keep extension)
  local name_noext="${fname%.*}"
  local ext="${fname##*.}"
  local lower_name="$(echo "$name_noext" | tr '[:upper:]' '[:lower:]')"
  local newname="${lower_name}.${ext}"

  local dst="$target_coll/$dirpart/$newname"

  if [[ "${ext,,}" == "md" ]]; then
    log "  -> ${rel}  =>  ${dst#$SITE_DIR/} (md)"
    copy_md_with_optional_front_matter "$src_abs" "$dst"
  else
    log "  -> ${rel}  =>  ${dst#$SITE_DIR/}"
    safe_backup_then_place "$dst" "$src_abs"
  fi
}

copy_folder_as_collection() {
  local src_dir="$1"       # absolute path to source folder
  local base="$2"          # basename of source folder
  local coll_dir; coll_dir="$(to_collection_dir "$base")"
  local target_coll="$SITE_DIR/$coll_dir"

  log "Process dir: $base -> $coll_dir  (-> $target_coll)"
  run "mkdir -p \"$target_coll\""

  # Walk all files in the folder (preserve substructure)
  while IFS= read -r -d '' f; do
    copy_one_file_preserving_structure "$f" "$src_dir" "$target_coll"
  done < <(find "$src_dir" -type f -print0)
}

# ---------- Preconditions ----------
if [[ ! -d "$SITE_DIR" ]]; then
  log "ERROR: '$SITE_DIR' not found. Run this script from your repo root."
  exit 1
fi
run "mkdir -p \"$SITE_DIR/$MISC_COLLECTION\""

ROOT="$(pwd)"

# ---------- 1) Copy top-level folders (as collections) ----------
shopt -s nullglob
for entry in "$ROOT"/*; do
  base="$(basename "$entry")"
  if is_excluded_name "$base"; then
    log "Skip excluded: $base"
    continue
  fi
  if [[ -d "$entry" ]]; then
    copy_folder_as_collection "$entry" "$base"
  fi
done
shopt -u nullglob

# ---------- 2) Copy loose Markdown files in repo root -> misc ----------
shopt -s nullglob
for f in "$ROOT"/*.md; do
  base="$(basename "$f")"
  if is_excluded_name "$base"; then
    log "Skip excluded file: $base"
    continue
  fi
  # lowercase filename
  name_noext="${base%.*}"
  ext="${base##*.}"
  lower_name="$(echo "$name_noext" | tr '[:upper:]' '[:lower:]')"
  newname="${lower_name}.${ext}"
  dst="$SITE_DIR/$MISC_COLLECTION/$newname"
  log "Root MD -> $MISC_COLLECTION: $base -> ${dst#$SITE_DIR/}"
  copy_md_with_optional_front_matter "$f" "$dst"
done
shopt -u nullglob

log ""
log "DONE. (Set DRY_RUN=true to simulate without writing)"
