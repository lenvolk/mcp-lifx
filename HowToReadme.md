# mcp-lifx

# For the prompt below use Agent mode GPT4.1

# Step 1 Scraping API Docs with GPT-4 in Agent Mode

https://api.developer.lifx.com/reference/introduction

Prompt: Take a look at the web page for this URL and make a markdown table that contains all of the API endpoints as well as the link to get to that specific API endpoint page

# Step 2 Building an API Knowledge Base in VS Code

Prompt: Excellent. Can you now please iterate over each one of these pages and create a file called LIFX dot MD which contains a list of all of the API endpoints, how you call those endpoints, the path to those endpoints, the HTTP methods for those endpoints, and any parameters and whether or not they're required

# Step 3 Understanding MCP and Setting Up the Server

https://modelcontextprotocol.io/quickstart/server  copy the page to mcp.md

# Step 4 Using Claude to Auto-Build the MCP Server

Prompt: Lets build an mcp server for the lifx api #file:LIFX.md #file:mcp.md use node
