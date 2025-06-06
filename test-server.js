#!/usr/bin/env node

// Simple test script to verify the MCP server can start
// This doesn't test the actual MCP communication, just that the server loads

console.log("Testing LIFX MCP Server...");

try {
  // Try to import the built server
  import('./build/index.js')
    .then(() => {
      console.log("✅ Server module loaded successfully");
      console.log("✅ MCP server appears to be working");
      console.log("\nTo use this server:");
      console.log("1. Add it to your Claude Desktop config");
      console.log("2. Use: node build/index.js");
      console.log("3. Ensure you have a LIFX API token from https://cloud.lifx.com/settings");
      
      // Exit after a short delay to prevent hanging
      setTimeout(() => process.exit(0), 1000);
    })
    .catch((error) => {
      console.error("❌ Error loading server:", error.message);
      process.exit(1);
    });
} catch (error) {
  console.error("❌ Error:", error.message);
  process.exit(1);
}
