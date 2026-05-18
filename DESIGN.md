---
name: Modern Academic (Editorial Scholarship v2)
description: A high-fidelity design system for professional examination management. Focuses on clarity, authority, and focused learning through strong typography, vibrant accents, and structured layouts.
colors:
  surface: "#FFFFFF"
  on-surface: "#111827" # Slate-900
  on-surface-variant: "#64748B" # Slate-500
  primary: "#2463EB" # Vibrant Blue from code.html
  on-primary: "#FFFFFF"
  primary-container: "#EFF6FF" # Blue-50
  on-primary-container: "#1E40AF" # Blue-800
  secondary: "#F6F6F8" # Background-light
  on-secondary: "#334155" # Slate-700
  accent: "#F59E0B" # Amber-500 (Used for Essay sections)
  on-accent: "#FFFFFF"
  error: "#EF4444" # Red-500
  on-error: "#FEF2F2"
  background: "#F6F6F8"
  on-background: "#111621" # Background-dark
  outline: "#E2E8F0" # Slate-200
  outline-variant: "#F1F5F9" # Slate-100
typography:
  display-lg:
    fontFamily: Lexend
    fontSize: 48px
    fontWeight: "700"
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Lexend
    fontSize: 32px
    fontWeight: "600"
    lineHeight: 40px
  headline-md:
    fontFamily: Lexend
    fontSize: 24px
    fontWeight: "600"
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: "400"
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 24px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: "600"
    lineHeight: 16px
    letterSpacing: 0.05em
  latex:
    fontFamily: "Times New Roman"
    fontStyle: italic
rounded:
  sm: 4px
  DEFAULT: 4px
  md: 8px
  lg: 12px
  xl: 16px
  "2xl": 24px
  full: 9999px
spacing:
  unit: 4px
  container-padding: 32px
  card-gap: 24px
  section-margin: 48px
components:
  card-standard:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.2xl}"
    padding: 20px
    border: "1px solid {colors.outline}"
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.lg}"
    height: 40px
    padding: 0 20px
  input-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 10px 14px
    border: "1px solid {colors.outline}"
  section-header-mcq:
    borderLeft: "4px solid {colors.primary}"
    backgroundColor: "{colors.surface}"
    padding: "8px 16px"
    textTransform: "uppercase"
  section-header-essay:
    borderLeft: "4px solid {colors.accent}"
    backgroundColor: "{colors.surface}"
    padding: "8px 16px"
    textTransform: "uppercase"
---

# Brand & Style
The **Modern Academic** design system is refined based on high-performance educational UI standards. It combines the focus of an editorial layout with the interactive clarity of a professional assessment tool.

## Core Principles
1. **Structural Hierarchy**: Use `Lexend` for all structural elements (headings, identifiers) to maintain a modern, readable feel. Use `Inter` for interface labels and `Times New Roman` (Italic) for mathematical symbols to adhere to standard academic conventions.
2. **Defined Boundaries**: While maintaining generous whitespace, use subtle borders (`slate-200`) and soft shadows to clearly define content areas, especially for complex questions.
3. **Intentional Accents**: 
   - **Primary Blue (#2463EB)**: Action items, identifiers, and MCQ sections.
   - **Amber (#F59E0B)**: Specifically used to denote Essay or high-attention sections.
4. **Soft Layering**: Depth is created through a clean light background (`#F6F6F8`) and pure white surfaces for interaction.

# Colors
The palette uses high-contrast Slate for text and vibrant accents for guidance.
- **Background**: Soft gray-white to reduce eye strain during long sessions.
- **Primary**: Authority blue for trust and clarity.
- **Status Colors**: Green for verification, Red for errors, Amber for differentiation.

# Typography
- **Lexend**: Display font for brand and headings.
- **Inter**: System font for UI and body text.
- **LaTeX (Times New Roman)**: Mathematical variable and formula font.

# Elevation
- **Cards**: `rounded-2xl` with a thin border and small shadow.
- **Focus States**: 2px ring with 20% opacity of the primary color.

# Layout
- **Max Width**: 1440px for large desktop views.
- **Grid**: 12-column system (typically 8 cols for content, 4 for sidebar/configuration).
- **Density**: Moderate. Maintain clarity by not crowding components.
