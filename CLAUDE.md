# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workspace Status

This is a freshly initialized Claude Code workspace. No project code exists yet — the directory only contains Claude Code configuration.

## Configured MCP Servers

- **context7** (`@upstash/context7-mcp`) — Fetch up-to-date library/framework documentation. Use `resolve-library-id` then `query-docs` when working with any external library.
- **playwright** — Browser automation via Playwright MCP tools.

## Permissions (settings.local.json)

Pre-approved tool calls:
- `Skill(update-config)` — Configure the Claude Code harness via settings.json
- `Bash(npm install:*)` — Install npm packages
- `Bash(claude mcp:*)` — Manage MCP servers
- `WebSearch` — Web searches
