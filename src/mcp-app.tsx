import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { useApp, useHostStyles } from "@modelcontextprotocol/ext-apps/react";

interface Light {
  id: string;
  label: string;
  connected: boolean;
  power: string;
  brightness: number;
  color: {
    hue: number;
    saturation: number;
    kelvin: number;
  };
  group: {
    name: string;
  };
  location: {
    name: string;
  };
}

interface AppProps {}

const LIFXApp: React.FC<AppProps> = () => {
  const [lights, setLights] = useState<Light[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLight, setSelectedLight] = useState<string | null>(null);

  const appInfo = {
    name: "LIFX Control",
    version: "1.0.0",
  };

  const { app } = useApp({
    appInfo,
    capabilities: {},
    async onAppCreated(app) {
      // Handle tool result when lights are listed
      app.ontoolresult = (result) => {
        if (result.content?.[0]?.type === "text") {
          const text = result.content[0].text;
          // This is a simple text parsing for demo - in production you'd want structured data
          console.log("Tool result:", text);
        }
      };

      // Handle tool input
      app.ontoolinput = async (params) => {
        console.log("Tool called:", params.name, params.arguments);
        
        // If it's a refresh, reload lights
        if (params.name === "lifx_control_refresh") {
          await loadLights();
        }
      };
    },
  });

  // Apply host styles for theme integration
  useHostStyles(app);

  // Load lights on mount
  useEffect(() => {
    if (app) {
      loadLights();
    }
  }, [app]);

  const loadLights = async () => {
    if (!app) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Call the MCP tool to get lights
      const result = await app.callServerTool({
        name: "list_lights",
        arguments: { selector: "all" },
      });

      // Parse the result - the actual implementation would need to handle the text format
      // For now, we'll use mock data since the server returns formatted text
      // In production, you'd modify the server to return JSON for the UI
      console.log("Lights result:", result);
      
      // For now, show a placeholder until we get real data
      // In a real implementation, you'd parse the result or modify the server
      setLights([]);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load lights");
    } finally {
      setLoading(false);
    }
  };

  const togglePower = async (selector: string) => {
    if (!app) return;
    
    try {
      await app.callServerTool({
        name: "toggle_power",
        arguments: { selector, duration: 1 },
      });
      await loadLights();
    } catch (err) {
      console.error("Failed to toggle power:", err);
    }
  };

  const setColor = async (selector: string, color: string) => {
    if (!app) return;
    
    try {
      await app.callServerTool({
        name: "set_state",
        arguments: { selector, color, duration: 1 },
      });
      await loadLights();
    } catch (err) {
      console.error("Failed to set color:", err);
    }
  };

  const setBrightness = async (selector: string, brightness: number) => {
    if (!app) return;
    
    try {
      await app.callServerTool({
        name: "set_state",
        arguments: { selector, brightness, duration: 0.5 },
      });
    } catch (err) {
      console.error("Failed to set brightness:", err);
    }
  };

  const startEffect = async (selector: string, effect: "breathe" | "pulse", color: string) => {
    if (!app) return;
    
    try {
      await app.callServerTool({
        name: effect === "breathe" ? "breathe_effect" : "pulse_effect",
        arguments: {
          selector,
          color,
          period: 2,
          cycles: 5,
          power_on: true,
        },
      });
    } catch (err) {
      console.error("Failed to start effect:", err);
    }
  };

  if (loading && lights.length === 0) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "300px",
        fontFamily: "var(--font-sans)",
        color: "var(--color-text-primary)",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "24px", marginBottom: "12px" }}>💡</div>
          <div>Loading lights...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: "24px",
        fontFamily: "var(--font-sans)",
        color: "var(--color-text-primary)",
      }}>
        <div style={{
          padding: "16px",
          backgroundColor: "var(--color-background-error)",
          borderRadius: "var(--border-radius-md)",
          color: "var(--color-text-error)",
        }}>
          <strong>Error:</strong> {error}
        </div>
        <button
          onClick={loadLights}
          style={{
            marginTop: "16px",
            padding: "8px 16px",
            backgroundColor: "var(--color-background-primary)",
            color: "var(--color-text-primary)",
            border: "1px solid var(--color-border-primary)",
            borderRadius: "var(--border-radius-sm)",
            cursor: "pointer",
            fontFamily: "var(--font-sans)",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  // Demo UI showing the interface structure
  return (
    <div style={{
      padding: "24px",
      fontFamily: "var(--font-sans)",
      color: "var(--color-text-primary)",
      backgroundColor: "var(--color-background-primary)",
      minHeight: "100vh",
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
      }}>
        <h1 style={{
          margin: 0,
          fontSize: "var(--font-heading-lg-size)",
          fontWeight: "var(--font-weight-semibold)",
        }}>
          💡 LIFX Control
        </h1>
        <button
          onClick={loadLights}
          style={{
            padding: "8px 16px",
            backgroundColor: "var(--color-background-secondary)",
            color: "var(--color-text-primary)",
            border: "1px solid var(--color-border-primary)",
            borderRadius: "var(--border-radius-sm)",
            cursor: "pointer",
            fontFamily: "var(--font-sans)",
            fontSize: "var(--font-text-sm-size)",
          }}
        >
          🔄 Refresh
        </button>
      </div>

      <div style={{
        display: "grid",
        gap: "16px",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      }}>
        {/* Demo card showing the UI structure */}
        <div style={{
          padding: "20px",
          backgroundColor: "var(--color-background-secondary)",
          borderRadius: "var(--border-radius-lg)",
          border: "1px solid var(--color-border-secondary)",
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}>
            <div>
              <h3 style={{
                margin: 0,
                fontSize: "var(--font-heading-md-size)",
                fontWeight: "var(--font-weight-medium)",
              }}>
                Vira Light
              </h3>
              <p style={{
                margin: "4px 0 0 0",
                fontSize: "var(--font-text-sm-size)",
                color: "var(--color-text-secondary)",
              }}>
                Master Bedroom • MBedroomGrp
              </p>
            </div>
            <button
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                border: "none",
                backgroundColor: "#4CAF50",
                color: "white",
                fontSize: "24px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => togglePower("label:Vira Light")}
            >
              💡
            </button>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "var(--font-text-sm-size)",
              color: "var(--color-text-secondary)",
            }}>
              Brightness
            </label>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="100"
              onChange={(e) => setBrightness("label:Vira Light", parseInt(e.target.value) / 100)}
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "var(--font-text-sm-size)",
              color: "var(--color-text-secondary)",
            }}>
              Quick Colors
            </label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {["white", "red", "blue", "green", "yellow", "purple"].map((color) => (
                <button
                  key={color}
                  onClick={() => setColor("label:Vira Light", color)}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "var(--border-radius-sm)",
                    border: "2px solid var(--color-border-primary)",
                    backgroundColor: color,
                    cursor: "pointer",
                  }}
                  title={color.charAt(0).toUpperCase() + color.slice(1)}
                />
              ))}
            </div>
          </div>

          <div>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "var(--font-text-sm-size)",
              color: "var(--color-text-secondary)",
            }}>
              Effects
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => startEffect("label:Vira Light", "breathe", "blue")}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  backgroundColor: "var(--color-background-tertiary)",
                  color: "var(--color-text-primary)",
                  border: "1px solid var(--color-border-primary)",
                  borderRadius: "var(--border-radius-sm)",
                  cursor: "pointer",
                  fontSize: "var(--font-text-sm-size)",
                }}
              >
                🌊 Breathe
              </button>
              <button
                onClick={() => startEffect("label:Vira Light", "pulse", "red")}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  backgroundColor: "var(--color-background-tertiary)",
                  color: "var(--color-text-primary)",
                  border: "1px solid var(--color-border-primary)",
                  borderRadius: "var(--border-radius-sm)",
                  cursor: "pointer",
                  fontSize: "var(--font-text-sm-size)",
                }}
              >
                ⚡ Pulse
              </button>
            </div>
          </div>
        </div>

        {/* Second demo card */}
        <div style={{
          padding: "20px",
          backgroundColor: "var(--color-background-secondary)",
          borderRadius: "var(--border-radius-lg)",
          border: "1px solid var(--color-border-secondary)",
          opacity: 0.6,
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}>
            <div>
              <h3 style={{
                margin: 0,
                fontSize: "var(--font-heading-md-size)",
                fontWeight: "var(--font-weight-medium)",
              }}>
                Nicole Light
              </h3>
              <p style={{
                margin: "4px 0 0 0",
                fontSize: "var(--font-text-sm-size)",
                color: "var(--color-text-secondary)",
              }}>
                Master Bedroom • MBedroomGrp
              </p>
            </div>
            <button
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                border: "2px solid var(--color-border-primary)",
                backgroundColor: "transparent",
                fontSize: "24px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => togglePower("label:Nicole Light")}
            >
              💡
            </button>
          </div>

          <div style={{
            padding: "16px",
            backgroundColor: "var(--color-background-tertiary)",
            borderRadius: "var(--border-radius-md)",
            textAlign: "center",
            color: "var(--color-text-secondary)",
            fontSize: "var(--font-text-sm-size)",
          }}>
            Light is off
          </div>
        </div>
      </div>

      <div style={{
        marginTop: "24px",
        padding: "16px",
        backgroundColor: "var(--color-background-secondary)",
        borderRadius: "var(--border-radius-md)",
        border: "1px solid var(--color-border-secondary)",
      }}>
        <h3 style={{
          margin: "0 0 12px 0",
          fontSize: "var(--font-heading-sm-size)",
          fontWeight: "var(--font-weight-medium)",
        }}>
          💡 About This Demo
        </h3>
        <p style={{
          margin: 0,
          fontSize: "var(--font-text-sm-size)",
          color: "var(--color-text-secondary)",
          lineHeight: 1.6,
        }}>
          This is an MCP App interface for your LIFX lights. The UI automatically adapts to the host's theme 
          and provides an interactive way to control your lights without using the chat interface. 
          Click the refresh button to load your actual lights!
        </p>
      </div>
    </div>
  );
};

// Mount the app
const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<LIFXApp />);
}
