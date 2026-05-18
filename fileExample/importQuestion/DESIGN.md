# Design System Specification: Editorial Scholarship

## 1. Overview & Creative North Star
**The Creative North Star: "The Curated Archive"**
This design system moves away from the "learning management system" aesthetic and toward a high-end digital editorial experience. It rejects the cluttered, utility-first grid in favor of a sophisticated, breathable layout that treats educational content as a premium asset. 

By leveraging intentional asymmetry, expansive negative space, and a rigorous hierarchy of "Be Vietnam Pro," we create a visual rhythm that feels both authoritative and effortless. The experience should feel like walking through a modern, glass-walled university wing: silent, illuminated, and intellectually stimulating.

---

## 2. Color & Surface Architecture
The color palette is anchored in a deep, scholarly blue, supported by a "lavender-white" atmosphere that reduces eye strain during long-form reading.

### The "No-Line" Rule
**Explicit Instruction:** Prohibit 1px solid borders for sectioning content. Boundaries must be defined solely through background color shifts or subtle tonal transitions. 
*   Instead of a line between a header and body, use a transition from `surface` (#faf9ff) to `surface-container-low` (#f4f3f9).
*   Use `surface-container-highest` (#e2e2e8) only for the most recessed elements, like search bars or code blocks.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. 
*   **Base:** `background` (#faf9ff)
*   **Secondary Content Zones:** `surface-container-low` (#f4f3f9)
*   **Primary Action Cards:** `surface-container-lowest` (#ffffff)
*   **Floating Navigation:** Semi-transparent `surface` with `backdrop-filter: blur(20px)`.

### Signature Textures
To avoid a "flat" digital feel, apply a subtle linear gradient to main CTAs (Primary Buttons):
*   **From:** `primary` (#004194)
*   **To:** `primary_container` (#0057c2) at a 135-degree angle. This adds a "lithographic" depth to the interaction points.

---

## 3. Typography: The Intellectual Voice
We use **Be Vietnam Pro** exclusively. Its clean, geometric construction provides the clarity required for complex academic data while its modern terminals feel premium.

*   **Display (Display-LG/MD):** Used for hero titles and major section headers. Use `on_surface` (#1a1b20) with a `-0.02em` letter-spacing to create a "tight," editorial look.
*   **Headlines (Headline-LG/MD):** The primary narrative driver. Use `on_secondary_container` (#455781) to soften the contrast against the lavender background, making long titles easier to scan.
*   **Body (Body-LG/MD):** Set to `on_surface_variant` (#424753) for optimal legibility. Ensure a line height of at least `1.6` for long-form academic text.
*   **Labels (Label-MD/SM):** Always uppercase with `+0.05em` letter-spacing when used for categories or metadata to provide a "scholarly stamp" aesthetic.

---

## 4. Elevation & Depth
Depth in this system is achieved through **Tonal Layering** rather than structural lines.

### The Layering Principle
Place a `surface-container-lowest` (#ffffff) card atop a `surface-container-low` (#f4f3f9) section. This creates a soft, natural lift that mimics fine stationery on a desk.

### Ambient Shadows
For floating elements (Modals, Popovers), use a "Deep Blue Tint" shadow:
*   **Shadow Color:** Hex `#0057c2` at 6% opacity.
*   **Blur/Spread:** `32px` blur, `0px` spread, `8px` Y-offset.
*   This ensures the shadow feels like an extension of the brand's primary light source rather than a generic grey drop-shadow.

### The "Ghost Border" Fallback
If an edge is required for accessibility (e.g., input fields), use a **Ghost Border**:
*   `outline_variant` (#c2c6d5) at **20% opacity**. It should be barely perceptible, serving only as a guide for the eye.

---

## 5. Components

### Buttons: The "Scholar's Signature"
*   **Primary:** Gradient from `primary` to `primary_container`. Border radius: `md` (0.375rem). Use `on_primary` (#ffffff) for text.
*   **Secondary:** No background. Use a `ghost border` and `primary` text.
*   **Tertiary:** Text only in `primary`. On hover, add a `surface-container-high` background with 0% to 100% opacity transition.

### Cards & Content Modules
*   **Rule:** Forbid divider lines.
*   **Separation:** Use the Spacing Scale `8` (2.75rem) or `10` (3.5rem) to separate internal card sections. Use `surface-container-low` for card headers to distinguish them from the card body.

### Refined Navigation (Academic Breadcrumbs)
*   Navigation should feel like a table of contents. Use `label-md` for breadcrumbs.
*   The active page should be `primary` (#004194) with a `surface-tint` (#0859c4) underline of `2px` height, offset by `4px`.

### Input Fields
*   Background: `surface-container-highest` (#e2e2e8).
*   Active State: Transition background to `surface-container-lowest` (#ffffff) with a 1px `primary` ghost border.

---

## 6. Do’s and Don’ts

### Do
*   **Do** use asymmetrical margins. For example, a wider left margin on a text block to allow for "marginalia" (labels or sub-info) in the gutter.
*   **Do** embrace white space. If a layout feels "empty," it is likely working.
*   **Do** use `primary_fixed_dim` (#afc6ff) for subtle highlights in dark-mode or high-intensity data visualizations.

### Don't
*   **Don't** use 100% black (#000000) for text. Always use `on_surface` (#1a1b20).
*   **Don't** use "Alert Red" for non-critical errors. Use the `error` (#ba1a1a) token sparingly to maintain the calm, academic atmosphere.
*   **Don't** use sharp corners. The `DEFAULT` (0.25rem) or `md` (0.375rem) radius should be applied to almost all containers to soften the "intellectual rigor" with "approachable clarity."