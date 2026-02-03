# Copilot Instructions for MCP-LIFX Codebase

## Project Overview
- This is a Model Context Protocol (MCP) server for controlling LIFX smart lights via the LIFX HTTP API.
- Main entry point: `src/index.ts` (TypeScript). Compiled output in `build/index.js`.
- The server exposes LIFX API endpoints as MCP tools for use by AI agents and MCP clients (e.g., Claude Desktop).

## Key Components
- **src/index.ts**: Implements all MCP tool handlers, LIFX API integration, and server startup logic.
- **LIFX.md**: Documents all supported LIFX API endpoints, parameters, and usage patterns.
- **test-server.js**: Simple script to verify server startup (does not test MCP communication).
- **package.json**: Defines build, start, test, and clean scripts. TypeScript project.

## Developer Workflows
- **Build**: `npm run build` (compiles TypeScript)
- **Start**: `npm start` (runs compiled server)
- **Dev**: `npm run dev` (builds and runs in one step)
- **Test**: `npm test` (runs `test-server.js`)
- **Clean/Rebuild**: `npm run clean` / `npm run rebuild`

## MCP Tool Patterns
- All MCP tools require a LIFX API token (see https://cloud.lifx.com/settings).
- Tool names and input schemas are defined in `src/index.ts` (see `server.setRequestHandler(ListToolsRequestSchema, ...)`).
- Supported selectors: `all`, `label:NAME`, `group:NAME`, `location:NAME`, `id:ID`.
- Supported color formats: named colors, `rgb:`, `hue:`, `kelvin:`.
- Tool output is formatted for AI agent consumption (text summaries, JSON details).

## Integration Points
- MCP clients (e.g., Claude Desktop) connect via stdio and invoke tools using the MCP protocol.
- External dependency: `@modelcontextprotocol/sdk` (MCP server framework).
- All LIFX API calls are made via HTTPS with Bearer token authentication.

## Project-Specific Conventions
- All tool handlers filter out undefined parameters before making API requests.
- Error handling: API errors are returned as text in the tool response, not thrown.
- Scene activation uses the path `/scenes/scene_id:{scene_uuid}/activate`.
- Documentation resource available at `lifx://api-docs` (see ListResourcesRequestSchema handler).

## Example Usage
- "List all my LIFX lights" → `list_lights` tool
- "Set living room lights to blue" → `set_state` tool with selector `group:Living Room`, color `blue`
- "Activate the movie night scene" → `activate_scene` tool with scene UUID

## Skills
When asked to create an MCP App, add a UI to an MCP tool, or build interactive MCP views, read `.github/skills/create-mcp-app/SKILL.md` first.
When asked to create or modify MCP servers, read `.github/skills/mcp-builder/SKILL.md` first.

## References
- See `README.md` for setup, usage, and configuration details.
- See `LIFX.md` for full API endpoint documentation.
- See `src/index.ts` for tool handler implementations and conventions.

---

**For AI agents:**
- Always validate required parameters before invoking tools.
- Use selectors and color formats as documented.
- Prefer using the MCP tool interface over direct HTTP calls.
- Reference the documentation resource for endpoint details.

# Tone
- If I tell you that you are wrong, think about whether or not you think that's true and respond with facts.
- Avoid apologizing or making conciliatory statements.
- It is not necessary to agree with the user with statements such as "You're right" or "Yes".
- Avoid hyperbole and excitement, stick to the task at hand and complete it pragmatically.