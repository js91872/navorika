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


def fail(message: str, code: int = 1) -> None:
    print(f"ERROR: {message}")
    sys.exit(code)


def load_manifest(path: Path) -> dict:
    if not path.exists():
        fail(f"Manifest not found: {path}")

    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        fail(f"Invalid JSON manifest: {exc}")

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

    missing = [key for key in required if not data.get(key)]

    if missing:
        fail("Missing required manifest field(s): " + ", ".join(missing))

    slug = data["slug"]

    if not isinstance(slug, str) or not SLUG_RE.fullmatch(slug):
        fail(
            "Slug must use lowercase letters, numbers and hyphens only."
        )

    if not isinstance(data["inputs"], list) or not data["inputs"]:
        fail("'inputs' must be a non-empty list.")

    if not isinstance(data["outputs"], list) or not data["outputs"]:
        fail("'outputs' must be a non-empty list.")

    return data


def existing_routes() -> set[str]:
    if not TOOLS_DIR.exists():
        return set()

    return {
        page.parent.name
        for page in TOOLS_DIR.glob("*/page.tsx")
    }


def registry_slugs() -> set[str]:
    if not REGISTRY.exists():
        return set()

    text = REGISTRY.read_text(
        encoding="utf-8",
        errors="ignore",
    )

    return set(
        re.findall(r"""slug:\s*['"]([^'"]+)['"]""", text)
    )


def normalize_slug(slug: str) -> str:
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
            result = result[: -len(ending)]

    return result


def similar_slugs(
    slug: str,
    candidates: set[str],
) -> list[tuple[str, float]]:
    wanted = normalize_slug(slug)

    results = []

    wanted_words = set(wanted.split("-"))

    for candidate in candidates:
        candidate_normalized = normalize_slug(candidate)

        sequence_score = difflib.SequenceMatcher(
            None,
            wanted,
            candidate_normalized,
        ).ratio()

        candidate_words = set(candidate_normalized.split("-"))

        union = wanted_words | candidate_words

        word_score = (
            len(wanted_words & candidate_words) / len(union)
            if union
            else 0
        )

        score = max(
            sequence_score,
            word_score,
        )

        if score >= 0.48:
            results.append((candidate, score))

    return sorted(
        results,
        key=lambda item: item[1],
        reverse=True,
    )[:10]


def format_list(items) -> str:
    lines = []

    for item in items:
        if isinstance(item, dict):
            label = item.get("label") or item.get("name") or item.get("key")
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
                    details.append(f"{key}={item[key]}")

            suffix = (
                " (" + ", ".join(details) + ")"
                if details
                else ""
            )

            lines.append(f"- {label}{suffix}")
        else:
            lines.append(f"- {item}")

    return "\n".join(lines)


def related_tools_block(data: dict) -> str:
    tools = data.get("related_tools", [])

    if not tools:
        return "- Inspect Navorika and select 2–4 genuinely relevant existing tools."

    return "\n".join(f"- {tool}" for tool in tools)


def tests_block(data: dict) -> str:
    tests = data.get("tests", [])

    if not tests:
        return """- Add at least one deterministic normal case.
- Add boundary/zero handling.
- Assert no Infinity or NaN can escape into UI results."""

    output = []

    for index, test in enumerate(tests, 1):
        output.append(f"CASE {index}: {test.get('name', 'Unnamed case')}")
        output.append(
            json.dumps(
                test,
                indent=2,
                ensure_ascii=False,
            )
        )
        output.append("")

    return "\n".join(output)


def build_prompt(data: dict) -> str:
    slug = data["slug"]
    name = data["name"]

    calculation = data["calculation"]

    return f"""# NAVORIKA TOOL IMPLEMENTATION PACKAGE

Implement this production-quality Navorika tool.

Tool:
{name}

Route:
/tools/{slug}

IMPORTANT
=========

First inspect the existing Navorika architecture.

Do not invent a parallel architecture.

Use existing shared components, calculation libraries,
SEO architecture, registry, taxonomy, UX configuration,
result actions and tests.

AUTHORITATIVE REFERENCES
========================

Inspect relevant examples before editing:

- src/components/tools/BusinessCalculatorTool.tsx
- src/components/tools/ExpansionToolPage.tsx
- src/data/registry.ts
- src/data/taxonomy.ts
- src/data/toolUx.ts
- src/lib/toolIcons.ts
- src/data/tool-pages/
- src/lib/calculations/
- scripts/run-calculation-tests.mjs
- scripts/validate-architecture.mjs

Also inspect 2–3 existing tools in the same category.

Do not introduce a standalone component if an existing
shared Navorika tool component can represent this tool.

TOOL DETAILS
============

Name:
{name}

Slug:
{slug}

Category:
{data["category"]}

Description:
{data["description"]}

SEARCH INTENT
=============

{data["search_intent"]}

KEYWORDS
========

{format_list(data["keywords"])}

INPUTS
======

{format_list(data["inputs"])}

OUTPUTS
=======

{format_list(data["outputs"])}

CALCULATION / METHODOLOGY
=========================

{calculation}

Do not silently substitute a different formula.

If division by zero or an undefined result is possible,
return null / Not applicable rather than Infinity or NaN.

Do not clamp legitimate negative financial/business results
to zero unless the specification explicitly requires it.

UX
==

- Run locally in the browser unless server-side processing
  is genuinely required.
- Use the existing Navorika design system.
- Mobile responsive.
- Accessible labels.
- Immediate deterministic calculations where appropriate.
- Reset example/default values.
- Use existing ResultActions where useful.
- Preserve light/dark mode.
- Do not add unnecessary dependencies.

SEO
===

Primary title:
{name}

Description:
{data["description"]}

Add useful content covering:

- what the calculator does
- formulas/methodology
- how to use it
- result interpretation
- worked example where useful
- limitations
- FAQs
- relevant internal links

Do not create keyword-stuffed filler.

RELATED EXISTING TOOLS
======================

{related_tools_block(data)}

LIMITATIONS / DISCLAIMERS
=========================

{format_list(data.get("limitations", [
    "Results are estimates based on user-entered assumptions.",
    "Users should verify important assumptions independently."
]))}

TEST REQUIREMENTS
=================

{tests_block(data)}

At minimum test:

- normal/reference calculation
- zero or boundary input
- invalid/non-finite handling where applicable
- negative outcomes where legitimate
- no Infinity
- no NaN

INTEGRATION CHECKLIST
=====================

Inspect architecture first, then integrate where appropriate:

- src/app/tools/{slug}/page.tsx
- src/app/tools/{slug}/layout.tsx
- suitable src/lib/calculations/* module
- calculation tests
- src/components/tools/shared tool configuration
- src/data/registry.ts
- appropriate src/data/tool-pages/*.ts
- src/data/taxonomy.ts
- src/data/toolUx.ts
- src/lib/toolIcons.ts

Update count-based tests only when the architecture requires it.

Do not alter unrelated tools.

Do not delete existing functionality.

Do not commit.
Do not push.
Do not deploy.

VALIDATION
==========

Run:

npm run test:calculations
npm run validate:architecture
npm run test:ux
npm run typecheck
npm run lint:baseline

If all pass:

npm run build

Finally report:

1. files created
2. files modified
3. calculations/formulas implemented
4. tests added
5. validation results
6. build result
7. warnings
8. git status --short
9. git diff --stat
"""


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Navorika tool planning and duplicate guard."
    )

    parser.add_argument(
        "manifest",
        type=Path,
        help="JSON tool manifest",
    )

    parser.add_argument(
        "--generate",
        action="store_true",
        help="Generate the Antigravity implementation package.",
    )

    parser.add_argument(
        "--force-similar",
        action="store_true",
        help="Allow generation despite a strong similarity warning.",
    )

    args = parser.parse_args()

    data = load_manifest(args.manifest)

    slug = data["slug"]

    routes = existing_routes()
    registry = registry_slugs()
    existing = routes | registry

    print()
    print("=== NAVORIKA TOOL FACTORY v2 ===")
    print(f"Tool:     {data['name']}")
    print(f"Slug:     {slug}")
    print(f"Category: {data['category']}")
    print()

    if slug in existing:
        print(f"EXISTING: {slug}")
        print("No implementation package generated.")
        sys.exit(2)

    similar = similar_slugs(slug, existing)

    if similar:
        print("Potential overlapping search intents:")

        for candidate, score in similar:
            marker = "HIGH" if score >= 0.70 else "review"
            print(
                f"  {score:.2f}  [{marker}]  {candidate}"
            )

        print()

        if (
            any(score >= 0.70 for _, score in similar)
            and not args.force_similar
        ):
            print(
                "STOPPED: strong similarity detected."
            )
            print(
                "Review whether this should upgrade an existing "
                "tool instead."
            )
            print(
                "If the intent is genuinely separate, rerun with "
                "--force-similar."
            )
            sys.exit(3)

    else:
        print("No significant slug overlap detected.")
        print()

    if not args.generate:
        print("AUDIT PASSED.")
        print()
        print("No files changed.")
        print(
            "To generate the implementation package:"
        )
        print(
            f"python3 scripts/create-tool.py "
            f"{args.manifest} --generate"
        )
        return

    OUTPUT_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    output = OUTPUT_DIR / f"{slug}.md"

    output.write_text(
        build_prompt(data),
        encoding="utf-8",
    )

    print("IMPLEMENTATION PACKAGE CREATED:")
    print(output.relative_to(ROOT))
    print()
    print("No application source files were modified.")
    print()
    print("Open the generated Markdown file and give its")
    print("entire contents to Antigravity.")
    print()
    print(f"  cat {output.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
