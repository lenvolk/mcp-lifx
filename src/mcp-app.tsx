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
      
      // Call the MCP tool to get lights in JSON format
      const result = await app.callServerTool({
        name: "list_lights",
        arguments: { selector: "all", format: "json" },
      });

      // Parse the JSON response
      if (result.content?.[0]?.type === "text") {
        const lightsData = JSON.parse(result.content[0].text) as Light[];
        setLights(lightsData);
      }
      
    } catch (err) {
      console.error("Failed to load lights:", err);
      setError(err instanceof Error ? err.message : "Failed to load lights");
    } finally {
      setLoading(false);
    }
  };

  const togglePower = async (lightId: string) => {
    if (!app) return;
    
    // Extract the actual ID without the selector prefix
    const actualId = lightId.startsWith('id:') ? lightId.slice(3) : lightId;
    
    // Find the current light state
    const currentLight = lights.find(l => l.id === actualId);
    const newPowerState = currentLight?.power === "on" ? "off" : "on";
    
    console.log(`Toggling ${actualId} from ${currentLight?.power} to ${newPowerState}`);
    
    // Optimistically update local state immediately
    setLights(prev => prev.map(light => 
      light.id === actualId 
        ? { ...light, power: newPowerState }
        : light
    ));
    
    try {
      await app.callServerTool({
        name: "set_state",
        arguments: { selector: lightId, power: newPowerState, duration: 0.5 },
      });
      // Refresh after a delay to sync with actual state
      setTimeout(() => loadLights(), 2000);
    } catch (err) {
      console.error("Failed to toggle power:", err);
      // Revert on error by reloading
      loadLights();
    }
  };

  const setColor = async (selector: string, color: string) => {
    if (!app) return;
    
    try {
      await app.callServerTool({
        name: "set_state",
        arguments: { selector, color, duration: 0.5 },
      });
    } catch (err) {
      console.error("Failed to set color:", err);
    }
  };

  const setBrightness = async (lightId: string, brightness: number) => {
    if (!app) return;
    
    // Update local state immediately for responsive UI
    setLights(prev => prev.map(light => 
      light.id === lightId.replace('id:', '') 
        ? { ...light, brightness }
        : light
    ));
    
    try {
      await app.callServerTool({
        name: "set_state",
        arguments: { selector: lightId, brightness, duration: 0.3 },
      });
    } catch (err) {
      console.error("Failed to set brightness:", err);
    }
  };

  const startEffect = async (selector: string, effect: "breathe" | "pulse" | "sunrise" | "relax" | "energize", color?: string) => {
    if (!app) return;
    
    try {
      if (effect === "breathe") {
        await app.callServerTool({
          name: "breathe_effect",
          arguments: {
            selector,
            color: color || "blue",
            period: 2,
            cycles: 5,
            power_on: true,
          },
        });
      } else if (effect === "pulse") {
        await app.callServerTool({
          name: "pulse_effect",
          arguments: {
            selector,
            color: color || "red",
            period: 0.5,
            cycles: 10,
            power_on: true,
          },
        });
      } else if (effect === "sunrise") {
        // Gradually warm up - simulate sunrise
        await app.callServerTool({
          name: "set_state",
          arguments: {
            selector,
            power: "on",
            color: "kelvin:2500",
            brightness: 0.3,
            duration: 2,
          },
        });
        setTimeout(async () => {
          await app.callServerTool({
            name: "set_state",
            arguments: {
              selector,
              color: "kelvin:4000",
              brightness: 1.0,
              duration: 5,
            },
          });
        }, 2000);
      } else if (effect === "relax") {
        await app.callServerTool({
          name: "set_state",
          arguments: {
            selector,
            power: "on",
            color: "kelvin:2700",
            brightness: 0.5,
            duration: 2,
          },
        });
      } else if (effect === "energize") {
        await app.callServerTool({
          name: "set_state",
          arguments: {
            selector,
            power: "on",
            color: "kelvin:5500",
            brightness: 1.0,
            duration: 1,
          },
        });
      }
      // Refresh after effect
      setTimeout(() => loadLights(), 3000);
    } catch (err) {
      console.error("Failed to start effect:", err);
    }
  };

  const stopEffects = async (selector: string) => {
    if (!app) return;
    try {
      await app.callServerTool({
        name: "effects_off",
        arguments: { selector },
      });
    } catch (err) {
      console.error("Failed to stop effects:", err);
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

  // Render actual lights dynamically
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

      {lights.length === 0 && !loading ? (
        <div style={{
          padding: "24px",
          backgroundColor: "var(--color-background-secondary)",
          borderRadius: "var(--border-radius-md)",
          textAlign: "center",
          color: "var(--color-text-secondary)",
        }}>
          No lights found. Make sure your LIFX lights are connected and the API token is valid.
        </div>
      ) : (
        <div style={{
          display: "grid",
          gap: "16px",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        }}>
          {lights.map((light) => (
            <div
              key={light.id}
              style={{
                padding: "20px",
                backgroundColor: "var(--color-background-secondary)",
                borderRadius: "var(--border-radius-lg)",
                border: "1px solid var(--color-border-secondary)",
                opacity: light.connected ? 1 : 0.6,
              }}
            >
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
                    {light.label}
                  </h3>
                  <p style={{
                    margin: "4px 0 0 0",
                    fontSize: "var(--font-text-sm-size)",
                    color: "var(--color-text-secondary)",
                  }}>
                    {light.location.name} • {light.group.name}
                  </p>
                </div>
                <button
                  type="button"
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    border: light.power === "on" ? "none" : "2px dashed var(--color-border-primary)",
                    backgroundColor: light.power === "on" ? "#4CAF50" : "#333",
                    color: "white",
                    fontSize: "28px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: light.power === "on" ? "0 0 12px rgba(76, 175, 80, 0.5)" : "none",
                    transition: "all 0.2s ease",
                    position: "relative",
                    zIndex: 10,
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    togglePower(`id:${light.id}`);
                  }}
                  title={light.power === "on" ? "Click to turn off" : "Click to turn on"}
                >
                  💡
                </button>
              </div>

              {light.power === "on" ? (
                <>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "var(--font-text-sm-size)",
                      color: "var(--color-text-secondary)",
                    }}>
                      Brightness: {Math.round(light.brightness * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={Math.round(light.brightness * 100)}
                      onChange={(e) => setBrightness(`id:${light.id}`, parseInt(e.target.value) / 100)}
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
                          onClick={() => setColor(`id:${light.id}`, color)}
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
                      marginBottom: "12px",
                      fontSize: "var(--font-text-sm-size)",
                      color: "var(--color-text-secondary)",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                    }}>
                      Run Effect:
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); startEffect(`id:${light.id}`, "breathe"); }}
                        style={{
                          padding: "16px 8px",
                          backgroundColor: "var(--color-background-tertiary)",
                          color: "var(--color-text-primary)",
                          border: "1px solid var(--color-border-primary)",
                          borderRadius: "var(--border-radius-md)",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span style={{ fontSize: "24px" }}>🌬️</span>
                        <span style={{ fontSize: "12px" }}>breathe</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); startEffect(`id:${light.id}`, "pulse"); }}
                        style={{
                          padding: "16px 8px",
                          backgroundColor: "var(--color-background-tertiary)",
                          color: "var(--color-text-primary)",
                          border: "1px solid var(--color-border-primary)",
                          borderRadius: "var(--border-radius-md)",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span style={{ fontSize: "24px" }}>💗</span>
                        <span style={{ fontSize: "12px" }}>pulse</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); startEffect(`id:${light.id}`, "sunrise"); }}
                        style={{
                          padding: "16px 8px",
                          backgroundColor: "var(--color-background-tertiary)",
                          color: "var(--color-text-primary)",
                          border: "1px solid var(--color-border-primary)",
                          borderRadius: "var(--border-radius-md)",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span style={{ fontSize: "24px" }}>🌅</span>
                        <span style={{ fontSize: "12px" }}>sunrise</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); startEffect(`id:${light.id}`, "relax"); }}
                        style={{
                          padding: "16px 8px",
                          backgroundColor: "var(--color-background-tertiary)",
                          color: "var(--color-text-primary)",
                          border: "1px solid var(--color-border-primary)",
                          borderRadius: "var(--border-radius-md)",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span style={{ fontSize: "24px" }}>😌</span>
                        <span style={{ fontSize: "12px" }}>relax</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); startEffect(`id:${light.id}`, "energize"); }}
                        style={{
                          padding: "16px 8px",
                          backgroundColor: "var(--color-background-tertiary)",
                          color: "var(--color-text-primary)",
                          border: "1px solid var(--color-border-primary)",
                          borderRadius: "var(--border-radius-md)",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span style={{ fontSize: "24px" }}>⚡</span>
                        <span style={{ fontSize: "12px" }}>energize</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); stopEffects(`id:${light.id}`); }}
                        style={{
                          padding: "16px 8px",
                          backgroundColor: "var(--color-background-tertiary)",
                          color: "var(--color-text-primary)",
                          border: "1px solid var(--color-border-primary)",
                          borderRadius: "var(--border-radius-md)",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span style={{ fontSize: "24px" }}>⏹️</span>
                        <span style={{ fontSize: "12px" }}>stop</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div style={{
                  padding: "16px",
                  backgroundColor: "var(--color-background-tertiary)",
                  borderRadius: "var(--border-radius-md)",
                  textAlign: "center",
                }}>
                  <p style={{
                    margin: "0 0 12px 0",
                    color: "var(--color-text-secondary)",
                    fontSize: "var(--font-text-sm-size)",
                  }}>
                    {light.connected ? "Light is off" : "Light is disconnected"}
                  </p>
                  {light.connected && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        togglePower(`id:${light.id}`);
                      }}
                      style={{
                        padding: "10px 24px",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: "var(--border-radius-sm)",
                        cursor: "pointer",
                        fontSize: "var(--font-text-sm-size)",
                        fontWeight: "bold",
                      }}
                    >
                      ⚡ Turn On
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Global Effects Section - All Lights */}
      {lights.length > 0 && (
        <div style={{
          marginTop: "24px",
          padding: "20px",
          backgroundColor: "var(--color-background-secondary)",
          borderRadius: "var(--border-radius-lg)",
          border: "1px solid var(--color-border-secondary)",
        }}>
          <label style={{
            display: "block",
            marginBottom: "16px",
            fontSize: "var(--font-heading-sm-size)",
            fontWeight: "var(--font-weight-medium)",
            color: "var(--color-text-primary)",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}>
            🌟 All Lights - Run Effect:
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "12px" }}>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); startEffect("all", "breathe"); }}
              style={{
                padding: "20px 12px",
                backgroundColor: "var(--color-background-tertiary)",
                color: "var(--color-text-primary)",
                border: "1px solid var(--color-border-primary)",
                borderRadius: "var(--border-radius-md)",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "32px" }}>🌬️</span>
              <span style={{ fontSize: "14px" }}>breathe</span>
            </button>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); startEffect("all", "pulse"); }}
              style={{
                padding: "20px 12px",
                backgroundColor: "var(--color-background-tertiary)",
                color: "var(--color-text-primary)",
                border: "1px solid var(--color-border-primary)",
                borderRadius: "var(--border-radius-md)",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "32px" }}>💗</span>
              <span style={{ fontSize: "14px" }}>pulse</span>
            </button>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); startEffect("all", "sunrise"); }}
              style={{
                padding: "20px 12px",
                backgroundColor: "var(--color-background-tertiary)",
                color: "var(--color-text-primary)",
                border: "1px solid var(--color-border-primary)",
                borderRadius: "var(--border-radius-md)",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "32px" }}>🌅</span>
              <span style={{ fontSize: "14px" }}>sunrise</span>
            </button>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); startEffect("all", "relax"); }}
              style={{
                padding: "20px 12px",
                backgroundColor: "var(--color-background-tertiary)",
                color: "var(--color-text-primary)",
                border: "1px solid var(--color-border-primary)",
                borderRadius: "var(--border-radius-md)",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "32px" }}>😌</span>
              <span style={{ fontSize: "14px" }}>relax</span>
            </button>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); startEffect("all", "energize"); }}
              style={{
                padding: "20px 12px",
                backgroundColor: "var(--color-background-tertiary)",
                color: "var(--color-text-primary)",
                border: "1px solid var(--color-border-primary)",
                borderRadius: "var(--border-radius-md)",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "32px" }}>⚡</span>
              <span style={{ fontSize: "14px" }}>energize</span>
            </button>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); stopEffects("all"); }}
              style={{
                padding: "20px 12px",
                backgroundColor: "#ff5252",
                color: "white",
                border: "none",
                borderRadius: "var(--border-radius-md)",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "32px" }}>⏹️</span>
              <span style={{ fontSize: "14px" }}>stop all</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Mount the app
const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<LIFXApp />);
}
