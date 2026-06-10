@echo off
cd /d D:\MdEditor
agent-browser --session test open http://localhost:5174
agent-browser --session test wait --load networkidle
agent-browser --session test snapshot -i
