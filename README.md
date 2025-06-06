# LIFX MCP Server

A Model Context Protocol (MCP) server that provides tools for controlling LIFX smart lights through the LIFX HTTP API.

## Features

This MCP server exposes the following LIFX API functionality as tools:

- 🔍 **list_lights** - Get all lights or filter by selector
- ⚡ **set_state** - Control power, color, brightness of lights
- 🔄 **toggle_power** - Toggle lights on/off
- 🫁 **breathe_effect** - Create breathing light effects
- 💫 **pulse_effect** - Create pulsing light effects
- 🎬 **list_scenes** - List all saved scenes
- ▶️ **activate_scene** - Activate a specific scene
- ✅ **validate_color** - Validate color string formats
- ⏹️ **effects_off** - Turn off any running effects

## Prerequisites

1. **LIFX API Token**: Get your token from [LIFX Cloud Settings](https://cloud.lifx.com/settings)
2. **Node.js**: Version 16 or higher
3. **MCP Client**: Such as Claude Desktop or any MCP-compatible client

## Installation

1. Clone this repository:
```bash
git clone https://github.com/lenvolk/mcp-lifx.git
cd mcp-lifx
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

## Usage

### With Claude Desktop

Add this server to your Claude Desktop configuration file:

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "lifx": {
      "command": "node",
      "args": ["C:/path/to/mcp-lifx/build/index.js"],
      "env": {}
    }
  }
}
```

### Direct Usage

You can also run the server directly:

```bash
npm start
```

## Example Usage

Once connected to an MCP client, you can use commands like:

- "List all my LIFX lights"
- "Turn on the kitchen lights"
- "Set living room lights to blue"
- "Start a breathe effect on all lights with red color"
- "Show me all my saved scenes"
- "Activate the movie night scene"

## LIFX Selectors

Use selectors to target specific lights:

- `all` - All lights
- `label:Kitchen` - Lights labeled "Kitchen"  
- `group:Living Room` - Lights in "Living Room" group
- `location:Home` - Lights at "Home" location
- `id:d073d5000000` - Specific light by ID

## Color Formats

The server supports various color formats:

- **Named colors**: `red`, `blue`, `green`, `purple`, etc.
- **RGB**: `rgb:255,0,0` (red)
- **HSB**: `hue:120 saturation:1.0 brightness:0.5` 
- **Kelvin**: `kelvin:3500` (warm white)

## Development

### Project Structure

```
mcp-lifx/
├── src/
│   └── index.ts      # Main MCP server implementation
├── build/            # Compiled JavaScript output
├── LIFX.md          # LIFX API documentation
├── mcp.md           # MCP tutorial reference
├── package.json     # Project configuration
├── tsconfig.json    # TypeScript configuration
└── README.md        # This file
```

### Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the compiled server
- `npm run dev` - Build and run in one command

### API Reference

All LIFX API endpoints and parameters are documented in [LIFX.md](./LIFX.md).

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC License

## Support

For issues with this MCP server, please open an issue on GitHub.
For LIFX API issues, refer to the [official LIFX API documentation](https://api.developer.lifx.com/).

---

**Note**: This is an unofficial LIFX MCP server. LIFX is a trademark of LIFX Pty Ltd.