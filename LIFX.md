# LIFX HTTP API Endpoints

Below is a list of LIFX API endpoints, including how to call them, their paths, HTTP methods, and parameters (with required/optional status).

---

## 1. List Lights
- **Method:** GET
- **Path:** `/v1/lights/{selector}`
- **Description:** Gets lights belonging to the authenticated account. Filter the lights using selectors.
- **Parameters:**
  - `selector` (path, required): Selector for filtering lights (e.g., all, label:Kitchen, id:d073d5000000)

---

## 2. Set State
- **Method:** PUT
- **Path:** `/v1/lights/{selector}/state`
- **Description:** Sets the state of the lights within the selector. All parameters except selector are optional.
- **Parameters:**
  - `selector` (path, required): Selector for filtering lights
  - `power` (body, optional): on/off
  - `color` (body, optional): Color string
  - `brightness` (body, optional): 0.0 to 1.0
  - `duration` (body, optional): Time in seconds
  - `infrared` (body, optional): 0.0 to 1.0
  - `fast` (body, optional): true/false

---

## 3. Set States
- **Method:** PUT
- **Path:** `/v1/lights/states`
- **Description:** Set multiple states across multiple selectors in a single request.
- **Parameters:**
  - `states` (body, required): Array of state objects (each with `selector` and state fields as in Set State)
  - `defaults` (body, optional): Default state values

---

## 4. State Delta
- **Method:** POST
- **Path:** `/v1/lights/{selector}/state/delta`
- **Description:** Change the state of the lights by the amount specified.
- **Parameters:**
  - `selector` (path, required): Selector for filtering lights
  - `power` (body, optional): on/off
  - `brightness` (body, optional): Amount to change brightness
  - `duration` (body, optional): Time in seconds

---

## 5. Toggle Power
- **Method:** POST
- **Path:** `/v1/lights/{selector}/toggle`
- **Description:** Turn off lights if any are on, or turn them on if all are off.
- **Parameters:**
  - `selector` (path, required): Selector for filtering lights
  - `duration` (body, optional): Time in seconds

---

## 6. Breathe Effect
- **Method:** POST
- **Path:** `/v1/lights/{selector}/effects/breathe`
- **Description:** Performs a breathe effect by fading between colors.
- **Parameters:**
  - `selector` (path, required)
  - `color` (body, required): Color to breathe
  - `from_color` (body, optional): Color to start from
  - `period` (body, optional): Duration of one cycle
  - `cycles` (body, optional): Number of cycles
  - `persist` (body, optional): true/false
  - `power_on` (body, optional): true/false
  - `peak` (body, optional): 0.0 to 1.0

---

## 7. Move Effect
- **Method:** POST
- **Path:** `/v1/lights/{selector}/effects/move`
- **Description:** Performs a move effect on a linear device with zones.
- **Parameters:**
  - `selector` (path, required)
  - `direction` (body, optional): left/right
  - `period` (body, optional): Duration
  - `cycles` (body, optional): Number of cycles

---

## 8. Morph Effect
- **Method:** POST
- **Path:** `/v1/lights/{selector}/effects/morph`
- **Description:** Performs a morph effect on the tiles in your selector.
- **Parameters:**
  - `selector` (path, required)
  - `palette` (body, required): Array of colors
  - `period` (body, optional): Duration
  - `cycles` (body, optional): Number of cycles

---

## 9. Flame Effect
- **Method:** POST
- **Path:** `/v1/lights/{selector}/effects/flame`
- **Description:** Performs a flame effect on the tiles in your selector.
- **Parameters:**
  - `selector` (path, required)
  - `period` (body, optional): Duration
  - `cycles` (body, optional): Number of cycles

---

## 10. Pulse Effect
- **Method:** POST
- **Path:** `/v1/lights/{selector}/effects/pulse`
- **Description:** Performs a pulse effect by quickly flashing between colors.
- **Parameters:**
  - `selector` (path, required)
  - `color` (body, required): Color to pulse
  - `from_color` (body, optional): Color to start from
  - `period` (body, optional): Duration of one cycle
  - `cycles` (body, optional): Number of cycles
  - `persist` (body, optional): true/false
  - `power_on` (body, optional): true/false
  - `peak` (body, optional): 0.0 to 1.0

---

## 11. Clouds Effect
- **Method:** POST
- **Path:** `/v1/lights/{selector}/effects/clouds`
- **Description:** Performs a clouds effect on the tiles in your selector.
- **Parameters:**
  - `selector` (path, required)
  - `period` (body, optional): Duration
  - `cycles` (body, optional): Number of cycles

---

## 12. Sunrise Effect
- **Method:** POST
- **Path:** `/v1/lights/{selector}/effects/sunrise`
- **Description:** Performs a sunrise effect on the tiles in your selector.
- **Parameters:**
  - `selector` (path, required)
  - `period` (body, optional): Duration
  - `cycles` (body, optional): Number of cycles

---

## 13. Sunset Effect
- **Method:** POST
- **Path:** `/v1/lights/{selector}/effects/sunset`
- **Description:** Performs a sunset effect on the tiles in your selector.
- **Parameters:**
  - `selector` (path, required)
  - `period` (body, optional): Duration
  - `cycles` (body, optional): Number of cycles

---

## 14. Effects Off
- **Method:** POST
- **Path:** `/v1/lights/{selector}/effects/off`
- **Description:** Turns off any running effects on the device.
- **Parameters:**
  - `selector` (path, required)
  - `power_off` (body, optional): true/false

---

## 15. Cycle
- **Method:** POST
- **Path:** `/v1/lights/{selector}/cycle`
- **Description:** Make the light(s) cycle to the next or previous state in a list of states.
- **Parameters:**
  - `selector` (path, required)
  - `states` (body, required): Array of state objects
  - `direction` (body, optional): forward/backward

---

## 16. List Scenes
- **Method:** GET
- **Path:** `/v1/scenes`
- **Description:** Lists all the scenes available in the user's account.
- **Parameters:**
  - None

---

## 17. Activate Scene
- **Method:** PUT
- **Path:** `/v1/scenes/scene_id:{scene_uuid}/activate`
- **Description:** Activates a scene from the user's account.
- **Parameters:**
  - `scene_uuid` (path, required): Scene UUID
  - `duration` (body, optional): Time in seconds
  - `fast` (body, optional): true/false

---

## 18. Validate Color
- **Method:** GET
- **Path:** `/v1/color`
- **Description:** Validate a color string.
- **Parameters:**
  - `color` (query, required): Color string

---

## 19. Clean
- **Method:** POST
- **Path:** `/v1/lights/{selector}/clean`
- **Description:** Control clean-capable LIFX devices.
- **Parameters:**
  - `selector` (path, required)
  - `duration` (body, required): Time in seconds

---

> For all endpoints, authentication is required via an Authorization header with a Bearer token.
