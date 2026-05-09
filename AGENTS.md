# Agents

## Universal Agent

This project uses the universal agent for all tasks.

### Available Subagents

- **explore**: Fast agent specialized for exploring codebases. Use for finding files by patterns, searching code for keywords, or answering questions about the codebase.
- **general**: General-purpose agent for researching complex questions and executing multi-step tasks.

### Usage

Use the `explore` agent for:
- Finding files by patterns (e.g., "src/components/**/*.tsx")
- Searching code for keywords (e.g., "API endpoints")
- Understanding codebase structure

Use the `general` agent for:
- Complex multi-step tasks
- Implementing new features
- Debugging and fixing issues