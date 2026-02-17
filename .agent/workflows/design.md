---
description: Generate design system using UI/UX Pro Max skill
---

# Design System Generation Workflow

This workflow is **MANDATORY** for all UI/UX work (landing pages, web apps, dashboards, components).

## Step 1: Analyze User Requirements

Extract from user request:
- **Product type**: SaaS, e-commerce, portfolio, service, dashboard, etc.
- **Industry**: healthcare, fintech, beauty, education, etc.
- **Style keywords**: minimal, elegant, playful, professional, dark mode, etc.
- **Stack**: React, Next.js, Vue, or default to `html-tailwind`

## Step 2: Generate Complete Design System

// turbo
Run this command BEFORE writing any code:

```bash
python .agent/skills/ui_ux_pro_max/scripts/search.py "<product_type> <industry> <keywords>" --design-system --persist -p "Project Name"
```

**Example:**
```bash
python .agent/skills/ui_ux_pro_max/scripts/search.py "saas dashboard fintech professional" --design-system --persist -p "FinTrack"
```

This creates:
- `design-system/MASTER.md` — Complete design system with style, colors, typography, effects
- Ready-to-use design tokens

## Step 3: Get Stack-Specific Guidelines

// turbo
If user didn't specify stack, use `html-tailwind` (default):

```bash
python .agent/skills/ui_ux_pro_max/scripts/search.py "responsive layout form" --stack html-tailwind
```

Available stacks: `html-tailwind`, `react`, `nextjs`, `vue`, `svelte`, `shadcn`

## Step 4: Implement Following Design System

- Read `design-system/MASTER.md`
- Use recommended colors, fonts, spacing
- Apply suggested effects and animations
- Avoid listed anti-patterns

## Step 5: (Optional) Get Additional Details

If you need more specific guidance:

```bash
# Get UX best practices
python .agent/skills/ui_ux_pro_max/scripts/search.py "animation accessibility" --domain ux

# Get alternative typography
python .agent/skills/ui_ux_pro_max/scripts/search.py "elegant luxury" --domain typography

# Get chart recommendations
python .agent/skills/ui_ux_pro_max/scripts/search.py "real-time dashboard" --domain chart
```

---

## ⚡ Turbo Mode

All steps marked with `// turbo` will auto-run without asking for permission.
