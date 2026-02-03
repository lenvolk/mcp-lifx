# LIFX MCP App Guide

## Overview

The LIFX MCP App provides an interactive, web-based UI for controlling your LIFX smart lights directly within MCP-enabled clients that support MCP Apps.

> **Note:** MCP Apps require a host that supports the MCP Apps extension (`ext-apps`). VS Code with GitHub Copilot may have limited support for MCP Apps UI rendering. Use text-based commands as an alternative, or test with the `basic-host` example from the ext-apps SDK.

## Features

- 🎨 **Real-time light control** - Toggle power, adjust brightness, change colors
- 🌈 **Quick color picker** - One-click access to common colors
- ✨ **Visual effects** - Breathe and pulse effects with customizable parameters
- 🎯 **Individual light control** - Control each light independently
- 🌗 **Theme-aware UI** - Automatically adapts to your client's theme
- 📱 **Responsive design** - Works on different screen sizes

## Building the App

The MCP app is built automatically when you run:

```bash
npm run build
```

This command:
1. Builds the React app UI into a single HTML file (`build/src/mcp-app.html`)
2. Compiles the TypeScript server code

You can also build components separately:

```bash
npm run build:app     # Build only the UI
npm run build:server  # Build only the server
```

## Using the App

### In VS Code with GitHub Copilot

1. Make sure the LIFX MCP server is configured in your VS Code settings
   - The server should be added to your MCP servers configuration
   - Ensure `LIFX_API_TOKEN` environment variable is set
2. Open GitHub Copilot Chat in VS Code
3. Ask Copilot to "open LIFX control" or "show LIFX app"
4. The interactive UI will appear in the chat panel

### Configuration

The MCP server is automatically discovered if it's running locally. You can verify it's available by checking the MCP servers list in VS Code settings or by asking Copilot to "list available tools".

### Available Controls

**Per-Light Controls:**
- **Power button** - Toggle light on/off (colored when on)
- **Brightness slider** - Adjust light intensity (0-100%)
- **Color buttons** - Quick access to white, red, blue, green, yellow, purple
- **Breathe effect** - Slow pulsing animation
- **Pulse effect** - Quick flashing animation

**Global Controls:**
- **Refresh button** - Reload all lights from LIFX cloud

## Technical Details

### Architecture

- **Frontend**: React 19 with TypeScript
- **Backend**: MCP server with tool/resource registration
- **Build system**: Vite with single-file bundling
- **Styling**: Inline styles with CSS variables for theme integration

### File Structure

```
src/
  mcp-app.tsx       - React component with app logic
  mcp-app.html      - HTML entry point
  index.ts          - Server with MCP app registration
build/
  src/
    mcp-app.html    - Bundled single-file app (566KB)
  index.js          - Compiled server
```

### Theme Integration

The app uses CSS variables provided by the MCP host:
- `--color-background-*` - Background colors
- `--color-text-*` - Text colors
- `--color-border-*` - Border colors
- `--font-sans` / `--font-mono` - Font families
- `--border-radius-*` - Border radius values

## Development

### Running the Server in Development

```bash
npm run serve  # Uses tsx to run TypeScript directly
```

### Making UI Changes

1. Edit `src/mcp-app.tsx`
2. Run `npm run build:app`
3. Restart the MCP server
4. Refresh the client

### Debugging

- Use browser DevTools to inspect the UI iframe
- Call `app.sendLog()` from the React app to send logs to the host
- Check server logs in the MCP server console

## Troubleshooting

**App not appearing:**
- Verify the build completed: `ls build/src/mcp-app.html`
- Check server logs for "mcp-app.html not found" warnings
- Rebuild: `npm run rebuild`
- **Important:** VS Code/Copilot may not fully support MCP Apps UI yet. Use text-based tools instead, or test with basic-host (see Testing below)

**Wrong file opens instead of MCP App:**
- Ensure there are no HTML files in the workspace with similar names (e.g., `lifx-control.html`)
- The MCP App uses the `lifx://app/control` resource URI, not a local file

**Lights not loading:**
- Verify `LIFX_API_TOKEN` is set
- Check network connectivity
- Use the "Refresh" button

**UI not themed correctly:**
- Check if the host supports MCP Apps
- Verify CSS variables are being applied
- Check browser console for errors

## Testing with basic-host

Since VS Code/Copilot may have limited MCP Apps support, test with the official basic-host:

```bash
# Clone the ext-apps SDK
git clone --branch "v$(npm view @modelcontextprotocol/ext-apps version)" --depth 1 https://github.com/modelcontextprotocol/ext-apps.git /tmp/mcp-ext-apps

# Terminal 1: Build and run your server
npm run build && npm run serve

# Terminal 2: Run basic-host
cd /tmp/mcp-ext-apps/examples/basic-host
npm install
SERVERS='["stdio:node c:\\Temp\\GIT\\mcp-lifx\\build\\index.js"]' npm run start
# Open http://localhost:8080
```

## Future Enhancements

- [ ] Group controls
- [ ] Scene management
- [ ] Color temperature slider
- [ ] Advanced effect controls
- [ ] Light scheduling
- [ ] Favorites and presets

## Resources

- [MCP Apps Documentation](https://github.com/modelcontextprotocol/ext-apps)
- [LIFX API Documentation](https://api.developer.lifx.com/)
- [React Documentation](https://react.dev/)
