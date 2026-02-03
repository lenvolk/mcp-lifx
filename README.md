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

### 🎨 Interactive MCP App

NEW! This server includes an interactive web-based UI that provides:
- Visual controls for all your LIFX lights
- Real-time power, color, and brightness adjustments
- One-click color presets
- Visual effects (breathe & pulse) controls
- Theme-aware design that adapts to your client

See [MCP_APP_GUIDE.md](MCP_APP_GUIDE.md) for details on using the interactive UI.

## Prerequisites

1. **LIFX API Token**: Get your token from [LIFX Cloud Settings](https://cloud.lifx.com/settings)
2. **Node.js**: Version 16 or higher
3. **VS Code** with **GitHub Copilot** extension

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

### With VS Code and GitHub Copilot

The LIFX MCP server works seamlessly with VS Code's GitHub Copilot:

1. Ensure the server is built: `npm run build`
2. Set your `LIFX_API_TOKEN` environment variable
3. The server will be automatically discovered by VS Code's MCP integration
4. Open GitHub Copilot Chat and interact with your lights

Example interactions:
- "List all my LIFX lights"
- "Open LIFX control" (launches the interactive UI)
- "Turn on the kitchen lights"
- "Set living room lights to blue"

### Running the Server

You can run the server directly with:

```bash
npm start
```

Or in development mode:

```bash
npm run serve
```

## Example Usage

Once connected to an MCP client, you can use commands like:

### Text Commands
- "List all my LIFX lights"
- "Turn on the kitchen lights"
- "Set living room lights to blue"
- "Start a breathe effect on all lights with red color"
- "Show me all my saved scenes"
- "Activate the movie night scene"

### Interactive UI
- "Open LIFX control" - Launches the interactive web UI with visual controls
- "Show LIFX app" - Alternative way to open the interactive UI

The interactive UI provides visual controls for power, brightness, colors, and effects without needing text commands. See [MCP_APP_GUIDE.md](./MCP_APP_GUIDE.md) for details.

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
│   ├── index.ts          # Main MCP server implementation
│   ├── mcp-app.tsx       # React MCP app UI
│   └── mcp-app.html      # HTML entry point for app
├── build/
│   ├── index.js          # Compiled server
│   └── src/
│       └── mcp-app.html  # Bundled single-file app UI
├── LIFX.md               # LIFX API documentation
├── MCP_APP_GUIDE.md      # Interactive UI usage guide
├── mcp.md                # MCP tutorial reference
├── vite.config.ts        # Vite build configuration
├── package.json          # Project configuration
├── tsconfig.json         # TypeScript configuration
└── README.md             # This file
```

### Available Scripts

- `npm run build` - Build both the MCP app UI and server
- `npm run build:app` - Build only the React UI
- `npm run build:server` - Build only the TypeScript server
- `npm start` - Run the compiled server
- `npm run serve` - Run server in development mode (with tsx)
- `npm run dev` - Build and run in one command
- `npm run clean` - Remove build directory
- `npm run rebuild` - Clean and rebuild everything

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