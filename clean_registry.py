#!/usr/bin/env python3
import re
from pathlib import Path

# Read the registry
with open('src/data/registry.ts', 'r') as f:
    content = f.read()

# Fix the extra comma
content = content.replace(']],', '],')

# Find all tool objects
tools_start = content.find('export const tools: Tool[] = [')
tools_end = content.find('];', tools_start) + 2

if tools_start == -1 or tools_end == -1:
    print("❌ Could not find tools array")
    exit(1)

tools_content = content[tools_start:tools_end]

# Extract all tool objects
tool_objects = re.findall(r'\{[^{}]*\}', tools_content)

# Remove duplicates based on slug
seen_slugs = set()
unique_tools = []
for obj in tool_objects:
    slug_match = re.search(r"slug:\s*'([^']*)'", obj)
    if slug_match:
        slug = slug_match.group(1)
        if slug not in seen_slugs:
            seen_slugs.add(slug)
            unique_tools.append(obj)
        else:
            print(f"⚠️ Removing duplicate: {slug}")

# Filter out malformed entries (missing required fields)
valid_tools = []
for obj in unique_tools:
    if 'slug:' in obj and 'title:' in obj and 'description:' in obj and 'category:' in obj and 'keywords:' in obj:
        valid_tools.append(obj)
    else:
        print(f"⚠️ Removing malformed entry: {obj[:50]}...")

print(f"✅ Found {len(valid_tools)} valid tools")

# Rebuild the tools array
new_tools_content = 'export const tools: Tool[] = [\n' + ',\n'.join(valid_tools) + '\n];'

# Replace the tools array
new_content = content[:tools_start] + new_tools_content + content[tools_end:]

# Write the file
with open('src/data/registry.ts', 'w') as f:
    f.write(new_content)

print(f"✅ Cleaned registry with {len(valid_tools)} tools")
