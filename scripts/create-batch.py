#!/usr/bin/env python3

from __future__ import annotations

import argparse
import difflib
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TOOLS_DIR = ROOT / "src/app/tools"
REGISTRY = ROOT / "src/data/registry.ts"
OUTPUT_DIR = ROOT / ".tool-factory"

SLUG_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


def fail(msg: str, code: int = 1):
    print(f"ERROR: {msg}")
    sys.exit(code)


def load_manifest(path: Path) -> dict:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        fail(f"{path}: {exc}")

    required = [
        "name",
        "slug",
        "category",
        "description",
        "search_intent",
        "keywords",
        "inputs",
        "outputs",
        "calculation",
    ]

    missing = [k for k in required if not data.get(k)]

    if missing:
        fail(
            f"{path.name}: missing fields: "
            + ", ".join(missing)
        )

    if not SLUG_RE.fullmatch(data["slug"]):
        fail(f"{path.name}: invalid slug '{data['slug']}'")

    return data


def existing_routes() -> set[str]:
    return {
        p.parent.name
        for p in TOOLS_DIR.glob("*/page.tsx")
    }


def registry_slugs() -> set[str]:
    if not REGISTRY.exists():
        return set()

    text = REGISTRY.read_text(
        encoding="utf-8",
        errors="ignore",
    )

    return set(
        re.findall(
            r"""slug:\s*['"]([^'"]+)['"]""",
            text,
        )
    )


def normalize(slug: str) -> str:
    endings = [
        "-calculator",
        "-converter",
        "-generator",
        "-estimator",
        "-checker",
        "-tool",
    ]

    result = slug

    for ending in endings:
        if result.endswith(ending):
            result = result[:-len(ending)]

    return result


def similarity(a: str, b: str) -> float:
    na = normalize(a)
    nb = normalize(b)

    seq = difflib.SequenceMatcher(
        None,
        na,
        nb,
    ).ratio()

    aw = set(na.split("-"))
    bw = set(nb.split("-"))

    union = aw | bw

    word = (
        len(aw & bw) / len(union)
        if union
        else 0
    )

    return max(seq, word)


def fmt_items(items) -> str:
    lines = []

    for item in items:
        if isinstance(item, dict):
            label = (
                item.get("label")
                or item.get("name")
                or item.get("key")
                or "Field"
            )

            details = []

            for key in [
                "key",
                "default",
                "min",
                "max",
                "step",
                "format",
                "help",
            ]:
                if key in item:
                    details.append(
                        f"{key}={item[key]}"
                    )

            suffix = (
                f" ({', '.join(details)})"
                if details
                else ""
            )

            lines.append(f"- {label}{suffix}")
        else:
            lines.append(f"- {item}")

    return "\n".join(lines)


def tool_prompt(data: dict, index: int) -> str:
    related = data.get("related_tools", [])
    limitations = data.get("limitations", [])
    tests = data.get("tests", [])

    related_text = (
        "\n".join(f"- {x}" for x in related)
        if related
        else "- Select 2–4 relevant existing Navorika tools."
    )

    limitations_text = (
        "\n".join(f"- {x}" for x in limitations)
        if limitations
        else "- Results are planning estimates."
    )

    tests_text = (
        json.dumps(
            tests,
            indent=2,
            ensure_ascii=False,
        )
        if tests
        else (
            "Add deterministic reference tests, boundary tests, "
            "zero/invalid handling and checks against NaN/Infinity."
        )
    )

    return f"""
===============================================================================
TOOL {index}: {data["name"]}
===============================================================================

SLUG
{data["slug"]}

CATEGORY
{data["category"]}

DESCRIPTION
{data["description"]}

SEARCH INTENT
{data["search_intent"]}

KEYWORDS
{fmt_items(data["keywords"])}

INPUTS
{fmt_items(data["inputs"])}

OUTPUTS
{fmt_items(data["outputs"])}

CALCULATION
{data["calculation"]}

RELATED TOOLS
{related_text}

LIMITATIONS
{limitations_text}

TEST SPECIFICATION
{tests_text}
"""


def build_batch_prompt(
    manifests: list[dict],
    batch_name: str,
) -> str:

    tool_sections = "\n".join(
        tool_prompt(tool, i + 1)
        for i, tool in enumerate(manifests)
    )

    slugs = "\n".join(
        f"- {tool['slug']}"
        for tool in manifests
    )

    return f"""# NAVORIKA BATCH IMPLEMENTATION PACKAGE

Batch:
{batch_name}

Tools:
{slugs}

IMPORTANT
=========

Implement ALL tools in this batch in one working session.

Before editing, inspect the existing Navorika architecture.

Do not invent parallel page, SEO, calculation, registry,
taxonomy, UX, or component systems.

Use existing architecture wherever possible.

AUTHORITATIVE AREAS TO INSPECT
==============================

- src/app/tools/
- src/components/tools/BusinessCalculatorTool.tsx
- src/components/tools/ExpansionToolPage.tsx
- src/data/registry.ts
- src/data/taxonomy.ts
- src/data/toolUx.ts
- src/data/tool-pages/
- src/lib/toolIcons.ts
- src/lib/calculations/
- scripts/run-calculation-tests.mjs
- scripts/run-ux-tests.mjs
- scripts/validate-architecture.mjs

For each tool, inspect at least one similar existing tool
before implementing it.

ARCHITECTURE RULES
==================

1. Prefer pure calculation functions in src/lib/calculations/.

2. Prefer existing shared calculator components/config-driven
   architecture instead of creating standalone calculator
   components.

3. Use ExpansionToolPage where consistent with existing tools.

4. Use createToolMetadata + ToolPageContent patterns already
   present in Navorika.

5. Add exactly one registry entry per new tool.

6. Add taxonomy placement only where genuinely relevant.

7. Reuse existing tool UX/result actions.

8. Add icons using the existing mapping format.

9. Add deterministic calculation tests.

10. Update count-based tests only where required by the existing
    architecture.

11. Do not modify unrelated tools.

12. Do not introduce new dependencies unless absolutely necessary.
    If you think a dependency is required, first determine whether
    existing browser/Node capabilities can solve it.

13. Never show NaN or Infinity to users.

14. Legitimate negative results must remain negative unless the
    specification explicitly requires otherwise.

15. Calculators should run locally in-browser whenever practical.

16. Preserve responsive layout, accessibility and dark/light mode.

17. Do not commit.
18. Do not push.
19. Do not deploy.

SEO RULES
=========

For each tool:

- unique search intent
- useful title and description
- methodology/formula
- interpretation
- limitations
- useful FAQs
- related internal tools
- no keyword stuffing
- no invented regulatory/legal guarantees
- no duplicate canonical intent

TOOLS
=====

{tool_sections}

VALIDATION
==========

After ALL tools are implemented:

npm run test:calculations
npm run validate:architecture
npm run test:ux
npm run typecheck
npm run lint:baseline

If all pass:

npm run build

If any validation fails:

Fix the implementation and rerun the relevant validation.

Do not stop merely because the first validation run fails.

FINAL REPORT
============

Report:

1. Tools implemented
2. Files created
3. Files modified
4. Calculation modules/functions added
5. Tests added and test count
6. Architecture validation result
7. UX validation result
8. TypeScript result
9. Lint baseline result
10. Production build result
11. Any warnings
12. git status --short
13. git diff --stat

Also explicitly confirm every route created.
"""


def main():
    parser = argparse.ArgumentParser()

    parser.add_argument(
        "directory",
        type=Path,
    )

    parser.add_argument(
        "--generate",
        action="store_true",
    )

    parser.add_argument(
        "--force-similar",
        action="store_true",
    )

    args = parser.parse_args()

    directory = args.directory

    if not directory.exists():
        fail(f"Directory not found: {directory}")

    paths = sorted(directory.glob("*.json"))

    if not paths:
        fail(
            f"No JSON manifests found in {directory}"
        )

    manifests = [
        load_manifest(path)
        for path in paths
    ]

    print()
    print("=== NAVORIKA BATCH FACTORY ===")
    print(f"Directory: {directory}")
    print(f"Tools:     {len(manifests)}")
    print()

    existing = (
        existing_routes()
        | registry_slugs()
    )

    errors = False

    # Exact duplicates against Navorika
    for data in manifests:
        slug = data["slug"]

        if slug in existing:
            print(
                f"EXISTING: {slug}"
            )
            errors = True

    # Exact duplicates inside batch
    seen = set()

    for data in manifests:
        slug = data["slug"]

        if slug in seen:
            print(
                f"BATCH DUPLICATE: {slug}"
            )
            errors = True

        seen.add(slug)

    # Similarity against current site
    strong_similarity = False

    print()
    print("Similarity audit:")
    print()

    for data in manifests:
        slug = data["slug"]

        matches = []

        for candidate in existing:
            score = similarity(
                slug,
                candidate,
            )

            if score >= 0.55:
                matches.append(
                    (candidate, score)
                )

        matches.sort(
            key=lambda x: x[1],
            reverse=True,
        )

        matches = matches[:5]

        print(slug)

        if not matches:
            print("  no significant overlap")
        else:
            for candidate, score in matches:
                level = (
                    "HIGH"
                    if score >= 0.70
                    else "review"
                )

                print(
                    f"  {score:.2f} [{level}] {candidate}"
                )

                if score >= 0.70:
                    strong_similarity = True

        print()

    # Similarity within batch
    print("Within-batch intent audit:")
    print()

    for i in range(len(manifests)):
        for j in range(i + 1, len(manifests)):
            a = manifests[i]["slug"]
            b = manifests[j]["slug"]

            score = similarity(a, b)

            if score >= 0.65:
                print(
                    f"  {score:.2f}  {a}  <->  {b}"
                )

                if score >= 0.75:
                    strong_similarity = True

    if errors:
        print()
        print(
            "STOPPED: exact duplicate detected."
        )
        sys.exit(2)

    if (
        strong_similarity
        and not args.force_similar
    ):
        print()
        print(
            "STOPPED: strong similarity detected."
        )
        print(
            "Review overlap before generating."
        )
        print(
            "Use --force-similar only after confirming "
            "the search intent is genuinely distinct."
        )
        sys.exit(3)

    if not args.generate:
        print()
        print("AUDIT PASSED.")
        print("No application files changed.")
        print()
        print("Generate combined implementation brief with:")
        print(
            f"python3 scripts/create-batch.py "
            f"{directory} --generate"
        )
        return

    OUTPUT_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    batch_name = directory.name

    output = (
        OUTPUT_DIR
        / f"{batch_name}-antigravity.md"
    )

    output.write_text(
        build_batch_prompt(
            manifests,
            batch_name,
        ),
        encoding="utf-8",
    )

    print()
    print("BATCH PACKAGE CREATED:")
    print(output.relative_to(ROOT))
    print()
    print("No application source files changed.")
    print()
    print("Use:")
    print(
        f"cat {output.relative_to(ROOT)}"
    )


if __name__ == "__main__":
    main()
