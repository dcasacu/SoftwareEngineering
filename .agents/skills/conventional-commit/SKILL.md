---
name: conventional-commit
description: Generate meaningful git commit messages following Conventional Commits. Use when asked to "commit", "write commit message", or "git commit". Supports Chinese descriptions.
---

# Conventional Commits

Generate clear, standardized commit messages that describe what changed and why.

## Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

## Types

| Type | Use When |
|------|----------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no code change |
| `refactor` | Code restructure |
| `perf` | Performance improvement |
| `test` | Adding tests |
| `build` | Build system changes |
| `ci` | CI/CD changes |
| `chore` | Maintenance tasks |

## Examples

**Good:**
```
feat(queue): add position badge component

Display user's queue position with estimated wait time.
Add animation when position updates.
```

**Bad:**
```
update
fixed stuff
```

## Chinese Commit Messages

For Chinese-speaking teams, describe the "why" in Chinese:

```
feat(map): 添加店铺标记队列数量显示

用户在地图上可以直接看到每家店的排队人数，
无需点开详情页面。
```

## Implementation for LineUp

| Change | Commit |
|--------|--------|
| Add mode switch | `feat(ui): 添加客户/店主模式切换按钮` |
| Fix queue order | `fix(queue): 修复取消后位置未更新的问题` |
| Add map markers | `feat(map): 实现店铺地图标记组件` |
| Update colors | `style(theme): 统一主题色变量` |

## Rules

1. Subject line under 72 characters
2. Use imperative mood: "add" not "added"
3. Body explains what and why, not how
4. Reference issues: `Fix #123` or `Closes #456`