#!/usr/bin/env python3
"""Rename a fresh copy of this starter. Usage: python3 scripts/new_project.py Acme"""

import re
import sys
from pathlib import Path

root = Path(__file__).resolve().parents[1]
ignored = {".git", "bin", "obj", "node_modules", "dist", ".pnpm"}
text_suffixes = {".cs", ".csproj", ".slnx", ".json", ".ts", ".tsx", ".md", ".yml", ".yaml", ".conf", ".example", ".xml", ".css", ".html"}

if len(sys.argv) != 2 or not re.fullmatch(r"[A-Z][A-Za-z0-9]*", sys.argv[1]):
    raise SystemExit("Usage: python3 scripts/new_project.py NewProjectName  (PascalCase)")

name = sys.argv[1]
if name == "Starter":
    raise SystemExit("Choose a different project name.")

files = [path for path in root.rglob("*") if path.is_file() and not set(path.relative_to(root).parts) & ignored]
for path in files:
    if path == Path(__file__).resolve() or (path.suffix not in text_suffixes and path.name not in {"Dockerfile", ".gitignore"}):
        continue
    content = path.read_text(encoding="utf-8")
    changed = content.replace("Starter", name).replace("starter", name.lower())
    if changed != content:
        path.write_text(changed, encoding="utf-8")

for path in sorted(files, key=lambda p: len(p.parts), reverse=True):
    if "Starter" in path.name:
        path.rename(path.with_name(path.name.replace("Starter", name)))

directories = [path for path in root.rglob("*") if path.is_dir() and not set(path.relative_to(root).parts) & ignored]
for path in sorted(directories, key=lambda p: len(p.parts), reverse=True):
    if "Starter" in path.name:
        path.rename(path.with_name(path.name.replace("Starter", name)))

print(f"Renamed starter to {name}. Run dotnet build {name}.slnx and update the project docs.")
