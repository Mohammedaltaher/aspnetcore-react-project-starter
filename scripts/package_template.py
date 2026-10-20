#!/usr/bin/env python3
"""Create a clean, copyable StarterTemplate.zip next to this script's parent folder."""

from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

root = Path(__file__).resolve().parents[1]
archive = root / "StarterTemplate.zip"
excluded = {".git", ".env", "bin", "obj", "node_modules", "dist", "TestResults", "__pycache__", ".DS_Store", "StarterTemplate.zip"}

with ZipFile(archive, "w", compression=ZIP_DEFLATED, compresslevel=9) as output:
    for path in sorted(root.rglob("*")):
        if not path.is_file() or set(path.relative_to(root).parts) & excluded:
            continue
        if path.name.startswith(".env") and path.name != ".env.example":
            continue
        output.write(path, Path("StarterTemplate") / path.relative_to(root))

print(f"Created {archive}")
