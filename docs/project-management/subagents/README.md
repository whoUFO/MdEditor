# Subagent 配置文件

本目录包含各个角色 Subagent 的配置文件。每个 Subagent 都有其特定的职责、技能和工作范围。

## 目录结构

```
/workspace/
├── docs/
│   ├── project-management/
│   │   ├── 02-task-management.md    # 任务管理列表
│   │   └── subagents/               # Subagent 配置
│   │       ├── README.md             # Subagent 使用说明
│   │       ├── fe-agent.md           # FE 前端开发 Subagent
│   │       ├── be-agent.md           # BE Electron开发 Subagent
│   │       ├── qa-agent.md           # QA 测试工程师 Subagent
│   │       └── pm-agent.md           # PM 项目经理 Subagent
│   └── plans/                        # 设计文档
└── ...
```

## 快速开始

### 如何使用 Subagent

1. **查看 Subagent 配置**：阅读对应的 `*-agent.md` 文件了解职责
2. **启动 Subagent**：使用 `Task` 工具并指定对应的 agent 类型
3. **分配任务**：根据任务类型选择合适的 Subagent

### Subagent 类型

| Subagent | 职责 | 适用任务 |
|----------|------|---------|
| **FE-Agent** | 前端开发 | React组件、UI交互、样式编写 |
| **BE-Agent** | Electron开发 | 主进程、IPC、打包发布 |
| **QA-Agent** | 测试工程 | 测试用例、自动化测试、质量检查 |
| **PM-Agent** | 项目管理 | 文档编写、任务跟踪、进度管理 |

## 配置说明

每个 Subagent 配置包含以下字段：

```yaml
name: Subagent名称
role: 角色类型
description: 详细描述
skills: 
  - 技能列表
working_directory: 工作目录
task_patterns:
  - 任务匹配模式
```

## 最佳实践

1. **明确任务边界**：每个任务只分配给一个 Subagent
2. **提供充分上下文**：在任务描述中包含相关文件和依赖
3. **设置验收标准**：明确任务完成的判断标准
4. **跟踪进度**：定期更新任务状态

## 联系信息

- **项目负责人**: 胡宇峰
- **邮箱**: hyf2k@163.com
- **Slack/Discord**: (待补充)
