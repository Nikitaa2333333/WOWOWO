# UI/UX Design Automation Rules

## 🎯 MANDATORY: Always Use UI/UX Pro Max Skill

**CRITICAL:** When working on ANY UI/UX task (design, create, build, implement, review, fix, improve), you MUST follow this workflow:

### Step 1: Generate Design System (REQUIRED FIRST STEP)
```bash
python .agent/skills/ui_ux_pro_max/scripts/search.py "<product_type> <keywords>" --design-system --persist -p "Project Name"
```

**This command runs BEFORE any code is written** and provides:
- UI style recommendation
- Color palette
- Typography pairing
- Effects and animations
- Anti-patterns to avoid

### Step 2: Implement Following the Generated Design System

Use the output from Step 1 as the **Source of Truth** for:
- Color scheme
- Font families
- Spacing scale
- Component styles
- Animation timings

### Step 3: Apply Default Stack Guidelines

If stack not specified, default to `html-tailwind`:
```bash
python .agent/skills/ui_ux_pro_max/scripts/search.py "responsive layout form" --stack html-tailwind
```

---

## 🚨 Non-Negotiable Priorities

1. **Accessibility (CRITICAL)**
   - 4.5:1 contrast ratio minimum
   - 44x44px touch targets
   - Visible focus states
   - Keyboard navigation

2. **Performance (HIGH)**
   - WebP images + lazy loading
   - prefers-reduced-motion support
   - Reserve space for async content

3. **Premium Aesthetics (MANDATORY)**
   - NO generic colors (plain red/blue/green)
   - Use curated palettes from skill
   - Google Fonts (never browser defaults)
   - Micro-animations for interactions

---

## ⚡ When This Rule Applies

Trigger this workflow when user requests:
- Landing page
- Website
- Web app
- Dashboard
- UI component
- Design system
- Page layout
- Any visual interface

**NO EXCEPTIONS.** Always run design system generation first.
