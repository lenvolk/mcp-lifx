import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, ListResourcesRequestSchema, ReadResourceRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
// LIFX API configuration
const LIFX_API_BASE = "https://api.lifx.com/v1";
const USER_AGENT = "mcp-lifx-server/1.0";
// Get token from environment
function getLifxToken() {
    const token = process.env.LIFX_API_TOKEN;
    if (!token) {
        throw new Error("LIFX_API_TOKEN environment variable is not set. Get your token at https://cloud.lifx.com/settings");
    }
    return token;
}
// Helper function to make LIFX API requests
async function makeLIFXRequest(endpoint, options) {
    const { method = "GET", body, token } = options;
    const url = `${LIFX_API_BASE}${endpoint}`;
    const headers = {
        "Authorization": `Bearer ${token}`,
        "User-Agent": USER_AGENT,
    };
    if (body && (method === "POST" || method === "PUT")) {
        headers["Content-Type"] = "application/json";
    }
    try {
        const response = await fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`LIFX API error: ${response.status} ${response.statusText} - ${errorText}`);
        }
        // Some endpoints return empty responses
        const contentType = response.headers.get("content-type");
        if (contentType?.includes("application/json")) {
            return await response.json();
        }
        return await response.text();
    }
    catch (error) {
        throw new Error(`Failed to make LIFX API request: ${error instanceof Error ? error.message : String(error)}`);
    }
}
// Validation schemas
const SelectorSchema = z.string().describe("LIFX selector (e.g., 'all', 'label:Kitchen', 'id:d073d5000000')");
const ColorSchema = z.string().describe("Color string (e.g., 'blue', 'rgb:255,0,0', 'hue:120 saturation:1.0')");
const PowerSchema = z.enum(["on", "off"]).describe("Power state");
const BrightnessSchema = z.number().min(0).max(1).describe("Brightness level (0.0 to 1.0)");
const DurationSchema = z.number().min(0).describe("Duration in seconds");
// Create server instance
const server = new Server({
    name: "lifx-server",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
        resources: {},
    },
});
// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "list_lights",
                description: "Get lights belonging to the authenticated account. Token is read from LIFX_API_TOKEN environment variable.",
                inputSchema: {
                    type: "object",
                    properties: {
                        selector: { type: "string", description: "Selector for filtering lights (default: 'all'). Examples: 'all', 'label:Kitchen', 'group:Living Room', 'id:d073d5000000'" },
                    },
                    required: [],
                },
            },
            {
                name: "set_state",
                description: "Set the state of lights (power, color, brightness). Token is read from LIFX_API_TOKEN environment variable.",
                inputSchema: {
                    type: "object",
                    properties: {
                        selector: { type: "string", description: "Selector for filtering lights (default: 'all')" },
                        power: { type: "string", enum: ["on", "off"], description: "Power state" },
                        color: { type: "string", description: "Color string (e.g., 'blue', 'rgb:255,0,0', 'kelvin:3500')" },
                        brightness: { type: "number", minimum: 0, maximum: 1, description: "Brightness (0.0 to 1.0)" },
                        duration: { type: "number", minimum: 0, description: "Transition duration in seconds" },
                        infrared: { type: "number", minimum: 0, maximum: 1, description: "Infrared brightness (0.0 to 1.0)" },
                        fast: { type: "boolean", description: "Fast mode (skip confirmation)" },
                    },
                    required: [],
                },
            },
            {
                name: "toggle_power",
                description: "Toggle power state of lights. Token is read from LIFX_API_TOKEN environment variable.",
                inputSchema: {
                    type: "object",
                    properties: {
                        selector: { type: "string", description: "Selector for filtering lights (default: 'all')" },
                        duration: { type: "number", minimum: 0, description: "Transition duration in seconds" },
                    },
                    required: [],
                },
            },
            {
                name: "breathe_effect",
                description: "Perform a breathe effect (slowly pulse between colors). Token is read from LIFX_API_TOKEN environment variable.",
                inputSchema: {
                    type: "object",
                    properties: {
                        selector: { type: "string", description: "Selector for filtering lights (default: 'all')" },
                        color: { type: "string", description: "Color to breathe" },
                        from_color: { type: "string", description: "Starting color" },
                        period: { type: "number", minimum: 0.1, description: "Duration of one cycle in seconds" },
                        cycles: { type: "number", minimum: 1, description: "Number of cycles" },
                        persist: { type: "boolean", description: "Persist the final color" },
                        power_on: { type: "boolean", description: "Turn on if off" },
                        peak: { type: "number", minimum: 0, maximum: 1, description: "Peak brightness (0.0 to 1.0)" },
                    },
                    required: ["color"],
                },
            },
            {
                name: "pulse_effect",
                description: "Perform a pulse effect (flash between colors). Token is read from LIFX_API_TOKEN environment variable.",
                inputSchema: {
                    type: "object",
                    properties: {
                        selector: { type: "string", description: "Selector for filtering lights (default: 'all')" },
                        color: { type: "string", description: "Color to pulse" },
                        from_color: { type: "string", description: "Starting color" },
                        period: { type: "number", minimum: 0.1, description: "Duration of one cycle in seconds" },
                        cycles: { type: "number", minimum: 1, description: "Number of cycles" },
                        persist: { type: "boolean", description: "Persist the final color" },
                        power_on: { type: "boolean", description: "Turn on if off" },
                        peak: { type: "number", minimum: 0, maximum: 1, description: "Peak brightness (0.0 to 1.0)" },
                    },
                    required: ["color"],
                },
            },
            {
                name: "list_scenes",
                description: "List all scenes available in the account. Token is read from LIFX_API_TOKEN environment variable.",
                inputSchema: {
                    type: "object",
                    properties: {},
                    required: [],
                },
            },
            {
                name: "activate_scene",
                description: "Activate a scene by UUID. Token is read from LIFX_API_TOKEN environment variable.",
                inputSchema: {
                    type: "object",
                    properties: {
                        scene_uuid: { type: "string", description: "Scene UUID (get from list_scenes)" },
                        duration: { type: "number", minimum: 0, description: "Transition duration in seconds" },
                        fast: { type: "boolean", description: "Fast mode (skip confirmation)" },
                    },
                    required: ["scene_uuid"],
                },
            },
            {
                name: "validate_color",
                description: "Validate a color string format. Token is read from LIFX_API_TOKEN environment variable.",
                inputSchema: {
                    type: "object",
                    properties: {
                        color: { type: "string", description: "Color string to validate (e.g., 'blue', 'rgb:255,0,0', 'hue:120')" },
                    },
                    required: ["color"],
                },
            },
            {
                name: "effects_off",
                description: "Turn off any running effects. Token is read from LIFX_API_TOKEN environment variable.",
                inputSchema: {
                    type: "object",
                    properties: {
                        selector: { type: "string", description: "Selector for filtering lights (default: 'all')" },
                        power_off: { type: "boolean", description: "Also turn off the lights" },
                    },
                    required: [],
                },
            },
        ],
    };
});
// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        const token = getLifxToken();
        switch (name) {
            case "list_lights": {
                const { selector = "all" } = args;
                const lights = await makeLIFXRequest(`/lights/${selector}`, { token });
                return {
                    content: [
                        {
                            type: "text",
                            text: `Found ${lights.length} lights:\n\n${lights.map((light) => `• ${light.label} (${light.id})\n  Power: ${light.power}\n  Brightness: ${(light.brightness * 100).toFixed(1)}%\n  Color: H:${light.color.hue}° S:${(light.color.saturation * 100).toFixed(1)}% K:${light.color.kelvin}\n  Connected: ${light.connected ? 'Yes' : 'No'}\n  Group: ${light.group.name}\n  Location: ${light.location.name}`).join('\n\n')}`,
                        },
                    ],
                };
            }
            case "set_state": {
                const { selector = "all", ...stateParams } = args;
                const body = Object.fromEntries(Object.entries(stateParams).filter(([_, value]) => value !== undefined));
                const result = await makeLIFXRequest(`/lights/${selector}/state`, {
                    method: "PUT",
                    body,
                    token,
                });
                return {
                    content: [
                        {
                            type: "text",
                            text: `State updated successfully for selector "${selector}". ${JSON.stringify(result, null, 2)}`,
                        },
                    ],
                };
            }
            case "toggle_power": {
                const { selector = "all", duration } = args;
                const body = duration !== undefined ? { duration } : {};
                const result = await makeLIFXRequest(`/lights/${selector}/toggle`, {
                    method: "POST",
                    body,
                    token,
                });
                return {
                    content: [
                        {
                            type: "text",
                            text: `Power toggled successfully for selector "${selector}". ${JSON.stringify(result, null, 2)}`,
                        },
                    ],
                };
            }
            case "breathe_effect": {
                const { selector = "all", ...effectParams } = args;
                const body = Object.fromEntries(Object.entries(effectParams).filter(([_, value]) => value !== undefined));
                const result = await makeLIFXRequest(`/lights/${selector}/effects/breathe`, {
                    method: "POST",
                    body,
                    token,
                });
                return {
                    content: [
                        {
                            type: "text",
                            text: `Breathe effect started for selector "${selector}". ${JSON.stringify(result, null, 2)}`,
                        },
                    ],
                };
            }
            case "pulse_effect": {
                const { selector = "all", ...effectParams } = args;
                const body = Object.fromEntries(Object.entries(effectParams).filter(([_, value]) => value !== undefined));
                const result = await makeLIFXRequest(`/lights/${selector}/effects/pulse`, {
                    method: "POST",
                    body,
                    token,
                });
                return {
                    content: [
                        {
                            type: "text",
                            text: `Pulse effect started for selector "${selector}". ${JSON.stringify(result, null, 2)}`,
                        },
                    ],
                };
            }
            case "list_scenes": {
                const scenes = await makeLIFXRequest("/scenes", { token });
                return {
                    content: [
                        {
                            type: "text",
                            text: `Found ${scenes.length} scenes:\n\n${scenes.map((scene) => `• ${scene.name} (${scene.uuid})\n  States: ${scene.states.length} lights\n  Created: ${new Date(scene.created_at * 1000).toLocaleDateString()}`).join('\n\n')}`,
                        },
                    ],
                };
            }
            case "activate_scene": {
                const { scene_uuid, duration, fast } = args;
                const body = Object.fromEntries(Object.entries({ duration, fast }).filter(([_, value]) => value !== undefined));
                const result = await makeLIFXRequest(`/scenes/scene_id:${scene_uuid}/activate`, {
                    method: "PUT",
                    body,
                    token,
                });
                return {
                    content: [
                        {
                            type: "text",
                            text: `Scene activated successfully. ${JSON.stringify(result, null, 2)}`,
                        },
                    ],
                };
            }
            case "validate_color": {
                const { color } = args;
                const result = await makeLIFXRequest(`/color?color=${encodeURIComponent(color)}`, { token });
                return {
                    content: [
                        {
                            type: "text",
                            text: `Color validation result:\n${JSON.stringify(result, null, 2)}`,
                        },
                    ],
                };
            }
            case "effects_off": {
                const { selector = "all", power_off } = args;
                const body = power_off !== undefined ? { power_off } : {};
                const result = await makeLIFXRequest(`/lights/${selector}/effects/off`, {
                    method: "POST",
                    body,
                    token,
                });
                return {
                    content: [
                        {
                            type: "text",
                            text: `Effects turned off for selector "${selector}". ${JSON.stringify(result, null, 2)}`,
                        },
                    ],
                };
            }
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error: ${error instanceof Error ? error.message : String(error)}`,
                },
            ],
            isError: true,
        };
    }
});
// List resources (for documentation)
server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
        resources: [
            {
                uri: "lifx://api-docs",
                mimeType: "text/markdown",
                name: "LIFX API Documentation",
                description: "Complete LIFX API endpoint documentation",
            },
        ],
    };
});
// Read resource content
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;
    if (uri === "lifx://api-docs") {
        const docs = `# LIFX MCP Server

This server provides access to the LIFX HTTP API through MCP tools.

## Available Tools

1. **list_lights** - Get all lights or filtered by selector
2. **set_state** - Set power, color, brightness of lights
3. **toggle_power** - Toggle lights on/off
4. **breathe_effect** - Create breathing light effect
5. **pulse_effect** - Create pulsing light effect
6. **list_scenes** - List all saved scenes
7. **activate_scene** - Activate a specific scene
8. **validate_color** - Validate color string format
9. **effects_off** - Turn off any running effects

## Authentication

All tools require a LIFX API token. Get yours at: https://cloud.lifx.com/settings

## Selectors

Use selectors to target specific lights:
- \`all\` - All lights
- \`label:Kitchen\` - Lights labeled "Kitchen"
- \`group:Living Room\` - Lights in "Living Room" group
- \`location:Home\` - Lights at "Home" location
- \`id:d073d5000000\` - Specific light by ID

## Color Formats

- Named colors: \`red\`, \`blue\`, \`green\`, etc.
- RGB: \`rgb:255,0,0\`
- HSB: \`hue:120 saturation:1.0 brightness:0.5\`
- Kelvin: \`kelvin:3500\`
`;
        return {
            contents: [
                {
                    uri,
                    mimeType: "text/markdown",
                    text: docs,
                },
            ],
        };
    }
    throw new Error(`Unknown resource: ${uri}`);
});
// Start the server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("LIFX MCP Server running on stdio");
}
main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map