import subprocess
import sys

# 从 git 历史中移除大文件
cmd = [
    'git', 'filter-branch', '--force',
    '--index-filter',
    'git rm --cached --ignore-unmatch -r apps/markdown-editor/release apps/markdown-editor/playwright-report apps/markdown-editor/test-results',
    '--prune-empty',
    '--tag-name-filter', 'cat',
    '--', '--all'
]

print('执行命令:', ' '.join(cmd))
result = subprocess.run(cmd, capture_output=True, text=True, cwd=r'D:\MdEditor')
print('STDOUT:', result.stdout)
print('STDERR:', result.stderr)
print('返回码:', result.returncode)
sys.exit(result.returncode)
