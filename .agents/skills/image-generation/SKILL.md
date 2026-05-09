---
name: image-generation
description: Generate images using AI for UI mockups, icons, and placeholders. Use when asked to "generate an image", "create icon", "make logo", or "AI image".
---

# AI Image Generation Guidelines

How to use AI image generation to create visual assets for web and mobile apps.

## When to Use

| Good Uses | Poor Uses |
|-----------|-----------|
| App icons and logos | Complex photos requiring stock |
| UI mockups/placeholders | Realistic product photography |
| Illustrations/graphics | Text-heavy images (AI struggles) |
| Hero images | Images requiring exact text |

## Prompt Engineering

**Structure:**
```
[Subject], [style], [colors], [mood], [technical specs]
```

**Examples:**

| Purpose | Prompt |
|---------|--------|
| App icon | `Shopping cart icon, flat design, orange and white, minimal, iOS app icon style, 1024x1024` |
| Hero image | `Fresh fruits market illustration, warm lighting, Mediterranean style, digital art, 16:9` |
| Empty state | `Happy shopper with empty basket, friendly illustration, pastel colors, 4:3` |

## Style Guidelines for LineUp

```markdown
# Queue app imagery
- Style: Friendly, approachable, Mediterranean warmth
- Colors: Orange (#F97316), Blue (#3B82F6), White
- Mood: Fresh, efficient, community-feel
- Avoid: Corporate, cold, overly tech-looking
```

## Generation Services

| Service | Best For | Limitations |
|---------|----------|-------------|
| DALL-E 3 | General purpose | Cost per image |
| Midjourney | Artistic illustrations | Not for logos |
| Stable Diffusion | Custom training | Requires setup |
| Simpler SVG | Icons, badges | Manual work |

## Workflow

1. **Define need** - What visual is needed?
2. **Write prompt** - Include style, colors, dimensions
3. **Generate** - 2-3 variations
4. **Refine** - Iterate on best result
5. **Export** - SVG for icons, PNG for photos

## For LineUp Project

**Shop Category Icons:**
- Fruits & Veg: Fresh produce illustration
- Meat: Quality cuts, warm lighting
- Fish: Mediterranean seafood
- Bakery: Fresh bread, warm tones

**Empty States:**
- No queues: "You're all set!" illustration
- No shops nearby: Map with location pin

## Output Formats

| Type | Format | Use Case |
|------|--------|----------|
| Icons/Logos | SVG, PNG (1x, 2x, 3x) | Scalable |
| Photos | PNG, WebP | Quality |
| Illustrations | SVG | Crisp at any size |
| Mockups | PNG | Presentations |