# 项目领域分类

## Frontend

出现页面、组件、设计系统、浏览器状态或前端构建入口，且后端不在同一交付边界。生成前端 Owner、设计系统、状态、资产、路由、API client 和前端验证导航。

## Backend

出现 API/RPC、domain/service、数据库、队列、缓存、worker 或后端部署入口，且 UI 不在同一交付边界。生成源契约、业务、数据、异步、外部集成、可观测和后端验证导航。

## Fullstack / Monorepo

前后端在同一仓库和共同交付边界内。一个适配层可以同时包含前后端地图，但必须分别标出 Owner，并增加单向契约链路；不要把 UI 与后端规则混在同一表格行中。

## Multi-repo

前后端或消费者/提供者位于独立仓库。每个仓库生成自己的薄适配层，共同引用一个源契约 Owner：

```text
source contract -> provider projection -> consumer copy/client
```

不要在多个仓库复制契约定义。只有存在稳定项目根目录、统一文档 Owner 和反复发生的跨仓任务时才创建平台适配 Skill。

## 判定规则

- 以 Git root、构建/部署边界、契约生成链路和实际依赖为证据，不以父目录名称判断。
- 仓库包含遗留的另一端代码但独立提交/部署时，仍按 multi-repo 处理。
- 分类不确定会改变适配层位置或契约 Owner 时，先请求确认。
