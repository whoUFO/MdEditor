@echo off
REM 从 git 历史中移除 release 目录和测试产物
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch -r apps\markdown-editor\release apps\markdown-editor\playwright-report apps\markdown-editor\test-results" --prune-empty --tag-name-filter cat -- --all
