# Agent 部署范围决策

> 状态：Approved
> 日期：2026-07-27
> 决策：本博客不部署在线 Agent 页面、Agent API 或 Agent 后端服务。

## 决策边界

本决策移除的是“访客可在博客中直接使用的在线 Agent 产品”，不是 Agent 相关的技术方向。

继续保留：

- Agent、RAG、LangGraph、智能问数等学习笔记；
- `projectType: "agent"` 的项目案例；
- 简历和 About 中已经真实具备的 Agent 工程能力描述；
- 与 Agent 工程相关的架构复盘、安全治理和可观测性内容。

不再进入博客部署范围：

- 公开路由 `/agent`；
- `/api/agent/*` API Route；
- FastAPI / LangGraph 在线后端服务；
- 聊天界面、会话管理、调用额度、模型密钥和运行日志；
- 首页、About、项目详情或导航中的 Agent Demo / Coming Soon 入口；
- Sitemap、E2E 关键路径和 SEO 页面清单中的 `/agent`。

## 清理结果

2026-07-27 已完成第一阶段 Agent 遗留代码清理：

1. 已删除 `app/agent/` 公开页面；
2. 已从首页、Sitemap 和 E2E 关键路径移除 `/agent`；
3. 已删除没有其他调用方的 `lib/agent/` 占位代码；
4. 已通过生产构建确认路由表不再出现 `/agent`；
5. 已通过运行时检核确认访问 `/agent` 返回 404。

## 页面数量口径

- 第一阶段历史验收：15 个公开页面类型 + 1 个 not-found 边界，其中包含 `/agent` 占位页；
- 最终部署目标：14 个公开页面类型 + 1 个 not-found 边界，不包含 `/agent`。

因此，历史验收记录中的“15 + 1”不回写为“14 + 1”；面向后续开发、QA 和部署的文档统一使用“14 + 1”目标口径。

## M4 与 M5 调整

M4 调整为：

- 首页；
- About；
- Resume。

M4 不再实现 Agent Coming Soon 页面或任何 Agent 次级入口。

M5 增加以下退出条件：

- 构建路由表不包含 `/agent`；
- Sitemap 不包含 `/agent`；
- 首页、Header、Footer、About、Resume 不存在 Agent Demo / Coming Soon 链接；
- Agent 技术文章和项目案例仍可正常访问，不因页面下线而被误删。

## 文档优先级

如其他文档仍出现“部署 `/agent`”“Agent Coming Soon”或“后续接入在线 Agent”的描述，以本决策为准，并应在同一轮文档维护中修正。
