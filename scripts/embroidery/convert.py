#!/usr/bin/env python3
"""Isolated embroidery stitch-file conversion CLI. Requires pyembroidery."""
import argparse
import json
import os
from pathlib import Path
import sys
import tempfile

READABLE = {"pes", "dst", "exp", "jef", "vp3", "pec", "xxx", "hus", "sew", "tbf", "u01"}
WRITABLE = {"pes", "dst", "exp", "jef", "vp3", "pec", "xxx", "tbf", "u01"}
MAX_BYTES = 20 * 1024 * 1024

def convert(source: Path, destination: Path):
    source = source.resolve(strict=True)
    destination = destination.resolve()
    ext_in = source.suffix.lower().lstrip(".")
    ext_out = destination.suffix.lower().lstrip(".")
    if ext_in not in READABLE or ext_out not in WRITABLE:
        raise ValueError("Unsupported embroidery input or output format")
    if source == destination:
        raise ValueError("Input and output must be different paths")
    if not source.is_file() or source.stat().st_size == 0 or source.stat().st_size > MAX_BYTES:
        raise ValueError("Input must be a nonempty embroidery file of at most 20 MB")
    import pyembroidery
    pattern = pyembroidery.read(str(source))
    if pattern is None or not pattern.stitches:
        raise ValueError("No embroidery stitches found")
    destination.parent.mkdir(parents=True, exist_ok=True)
    fd, temporary = tempfile.mkstemp(prefix=".embroidery-", suffix="." + ext_out, dir=destination.parent)
    os.close(fd)
    try:
        pyembroidery.write(pattern, temporary)
        if not os.path.getsize(temporary):
            raise ValueError("Conversion produced an empty file")
        os.replace(temporary, destination)
    finally:
        if os.path.exists(temporary):
            os.unlink(temporary)
    return {"input_format": ext_in, "output_format": ext_out, "stitch_commands": len(pattern.stitches), "bytes": destination.stat().st_size}

def main():
    parser = argparse.ArgumentParser(description="Convert existing embroidery stitch files; not image digitizing")
    parser.add_argument("input")
    parser.add_argument("output")
    args = parser.parse_args()
    try:
        print(json.dumps(convert(Path(args.input), Path(args.output))))
    except (ValueError, OSError, ImportError) as exc:
        print(json.dumps({"error": str(exc)}), file=sys.stderr)
        return 1
    return 0

if __name__ == "__main__":
    sys.exit(main())
