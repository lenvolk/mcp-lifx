# mcp-lifx

# Ref Video [link](https://www.youtube.com/watch?v=yUaz89m1M5w&t=1s)
---

## Get API Token

- Visit: [LIFX Authentication Guide](https://api.developer.lifx.com/reference/authentication)
- Click on **Account Settings** to generate your API token.

---

## To Test

- Test your token at: [List Lights Endpoint](https://api.developer.lifx.com/reference/list-lights)
    - Paste your token into the **Header**
    - For selector, type: `all`
    - Output should include: `label:Vira Light`

### Set State Example

- Endpoint: [Set State](https://api.developer.lifx.com/reference/set-state)
    - Selector: `label:Vira Light`
    - Color: `red`

```json
{
  "selector": "label:Vira Light",
  "color": "red"
}
```

---

## For the prompt below use Agent mode GPT-4.1

---

### Step 1: Scraping API Docs with GPT-4 in Agent Mode

- [LIFX API Introduction](https://api.developer.lifx.com/reference/introduction)

**Prompt:**
> Take a look at the web page for this URL and make a markdown table that contains all of the API endpoints as well as the link to get to that specific API endpoint page

---

### Step 2: Building an API Knowledge Base in VS Code

**Prompt:**
> Excellent. Can you now please iterate over each one of these pages and create a file called `LIFX.md` which contains a list of all of the API endpoints, how you call those endpoints, the path to those endpoints, the HTTP methods for those endpoints, and any parameters and whether or not they're required

---

### Step 3: Understanding MCP and Setting Up the Server

- [MCP Server Quickstart](https://modelcontextprotocol.io/quickstart/server)
    - Copy the page to `mcp.md`

---

### Step 4: Using Claude to Auto-Build the MCP Server

**Prompt:**
> Let's build an mcp server for the lifx api  
> #file:LIFX.md #file:mcp.md use node

---

### Step 5: Add MCP server

 - create .vscode\mcp.json
 - click on `add server`
 - choose `Command (stdio) Run a local command that implements the MCP protocol`
 - command to run `node`
 - name `lifxmcp`

### Step 6: Signal when task is completed by changing color of the Len Light

- update settings.json with 
```json
    {
      "text": "Always change the color of Vira light to yellow, when you are finished with a task."
    },
```    

**Prompt:**
> think for a 5 seconds about something and then tell me when you are done

## Data Protection

*   **API Token Security:** Your LIFX API token grants control over your lights. **Keep it confidential.** Using the config file (`~/.lifx-api-mcp-server.jsonc` with appropriate file permissions) or environment variables is safer than passing the token as a command-line argument, especially in shared environments or logs.
*   **Data Flow:** When using a remote LLM (like via Claude Desktop), your prompts *to* the LLM and the *results* returned by this MCP server (light names, states, scene names) will be sent to the LLM provider. Be mindful of potentially sensitive information in your light/group/location/scene labels if privacy is a major concern.
*   **Local Execution:** This server runs locally on your machine. It communicates directly with the LIFX cloud API over HTTPS.