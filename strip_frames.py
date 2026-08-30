import re
import os

filepath = r'C:\Users\user\Projects\octagram-portfolio\src\components\ocean\OceanJourneyCanvas.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Remove cache definitions
code = re.sub(
    r'const loaded = new Map<string, LoadedFrame>\(\).*?const failed = new Set<string>\(\);\s*const selectionCache = new Map<string, SelectedFrames>\(\);\s*',
    '',
    code,
    flags=re.DOTALL
)
code = re.sub(r'let retainedFrame: HTMLImageElement \| null = null;\s*', '', code)
code = re.sub(r'const maxConcurrentLoads =.*?;\s*', '', code, flags=re.DOTALL)

# 2. Remove functions getSelection -> preloadWindow
code = re.sub(
    r'const getSelection = \(.*?\).*?};.*?const preloadWindow = \(.*?\).*?};\s*',
    '',
    code,
    flags=re.DOTALL
)

# 3. Remove resolveChapter, frameAtProgress, primeProgressFrame
code = re.sub(
    r'const resolveChapter = \(.*?\).*?};\s*',
    '',
    code,
    flags=re.DOTALL
)
code = re.sub(
    r'const frameAtProgress = \(.*?\).*?};\s*',
    '',
    code,
    flags=re.DOTALL
)
code = re.sub(
    r'const primeProgressFrame = \(.*?\).*?};\s*',
    '',
    code,
    flags=re.DOTALL
)

# 4. Remove image cleanup on unmount
code = re.sub(r'loaded\.clear\(\);.*?failed\.clear\(\);\s*selectionCache\.clear\(\);\s*', '', code, flags=re.DOTALL)

# 5. Remove selectionCache.clear() in resize
code = re.sub(r'selectionCache\.clear\(\);\s*', '', code)

# 6. Remove primeProgressFrame calls
code = re.sub(r'primeProgressFrame\(.*?\);\s*', '', code)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(code)

print("Done")
