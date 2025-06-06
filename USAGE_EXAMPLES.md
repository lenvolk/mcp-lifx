# LIFX MCP Server Usage Examples

This document provides examples of how to use the LIFX MCP Server tools.

## Prerequisites

You'll need:
1. A LIFX API token from https://cloud.lifx.com/settings
2. The MCP server configured in your MCP client (like Claude Desktop)

## Tool Examples

### 1. List All Lights

```
Please list all my LIFX lights using my token: YOUR_TOKEN_HERE
```

This will use the `list_lights` tool to show all your lights with their current state.

### 2. Control Light Power

Turn on all lights:
```
Turn on all my lights using token: YOUR_TOKEN_HERE
```

Turn off kitchen lights:
```
Turn off the kitchen lights using my token: YOUR_TOKEN_HERE
```

### 3. Set Light Colors

Set all lights to blue:
```
Set all my lights to blue color using token: YOUR_TOKEN_HERE
```

Set living room lights to warm white:
```
Set my living room lights to kelvin:3000 using token: YOUR_TOKEN_HERE
```

### 4. Adjust Brightness

Set lights to 50% brightness:
```
Set all lights to 50% brightness using token: YOUR_TOKEN_HERE
```

### 5. Create Effects

Start a breathe effect:
```
Start a breathe effect on all lights with red color for 5 cycles using token: YOUR_TOKEN_HERE
```

Start a pulse effect:
```
Create a pulse effect on bedroom lights with purple color using token: YOUR_TOKEN_HERE
```

### 6. Work with Scenes

List all scenes:
```
Show me all my LIFX scenes using token: YOUR_TOKEN_HERE
```

Activate a scene:
```
Activate the "Movie Night" scene using token: YOUR_TOKEN_HERE
```

### 7. Advanced Selectors

Target specific lights:
```
Set the light labeled "Desk Lamp" to green using token: YOUR_TOKEN_HERE
```

Target lights by group:
```
Turn on all lights in the "Living Room" group using token: YOUR_TOKEN_HERE
```

### 8. Validate Colors

Check if a color is valid:
```
Check if "rainbow" is a valid LIFX color using token: YOUR_TOKEN_HERE
```

### 9. Stop Effects

Turn off all running effects:
```
Stop all light effects using token: YOUR_TOKEN_HERE
```

## Color Examples

The LIFX API supports many color formats:

- **Named colors**: red, blue, green, purple, orange, yellow, cyan, magenta, white, pink, lime, etc.
- **RGB values**: `rgb:255,0,0` (red), `rgb:0,255,0` (green), `rgb:0,0,255` (blue)
- **HSB values**: `hue:120 saturation:1.0 brightness:0.5`
- **Kelvin values**: `kelvin:2700` (warm), `kelvin:4000` (neutral), `kelvin:6500` (cool)

## Selector Examples

- `all` - All lights
- `label:Bedroom` - Light labeled "Bedroom"
- `group:Kitchen` - All lights in "Kitchen" group
- `location:Home` - All lights at "Home" location
- `id:d073d5000000` - Specific light by device ID

## Tips

1. Always include your LIFX API token in requests
2. Use descriptive light labels to make targeting easier
3. Test color strings with the validate_color tool first
4. Effects run for their specified duration - use effects_off to stop them early
5. Scene UUIDs are required for activation - list scenes first to get UUIDs

## Error Handling

If you get errors:
- Check that your API token is valid and not expired
- Ensure your lights are online and connected to WiFi
- Verify that selectors match your actual light/group/location names
- Some effects may not work on all light models

## Rate Limiting

The LIFX API has rate limits. If you're making many requests:
- Space out your requests
- Use selectors to target multiple lights at once
- Consider using the `fast` parameter for state changes to skip confirmations
