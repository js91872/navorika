#!/usr/bin/env python3

# Read the file
with open('src/data/registry.ts', 'r') as f:
    lines = f.readlines()

# Find the closing bracket of tools array (should be at line 718)
tools_end = None
categories_start = None
construction_start = None

for i, line in enumerate(lines):
    if i < 700:  # Only check after line 700
        if '];' in line and i > 700 and categories_start is None:
            tools_end = i
        if 'export const categories' in line:
            categories_start = i
        if '// Construction Tools' in line:
            construction_start = i

print(f"Tools end at line: {tools_end + 1}")
print(f"Construction tools start at line: {construction_start + 1}")
print(f"Categories start at line: {categories_start + 1}")

if tools_end is not None and construction_start is not None and categories_start is not None:
    # Remove the closing bracket at tools_end
    lines[tools_end] = ''  # Remove the '];' line
    
    # Extract construction tools (from construction_start to before categories_start)
    construction_tools = lines[construction_start:categories_start]
    lines[construction_start:categories_start] = []  # Remove them from current position
    
    # Insert construction tools at tools_end position (after removing the '];')
    # Find where to insert (after the last tool before the closing bracket)
    insert_pos = tools_end
    for i in range(tools_end - 1, tools_end - 10, -1):
        if '}' in lines[i] and not '//' in lines[i]:
            # Add a comma after this tool if needed
            if not lines[i].rstrip().endswith(','):
                lines[i] = lines[i].rstrip() + ',\n'
            insert_pos = i + 1
            break
    
    # Insert the construction tools
    for tool in construction_tools:
        lines.insert(insert_pos, tool)
        insert_pos += 1
    
    # Add the closing bracket
    lines.insert(insert_pos, '];\n')
    
    # Write the fixed file
    with open('src/data/registry.ts', 'w') as f:
        f.writelines(lines)
    
    print("✅ Fixed registry.ts!")
else:
    print("❌ Could not find required sections")
