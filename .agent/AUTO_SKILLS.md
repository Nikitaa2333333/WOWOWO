# 🤖 Antigravity Auto-Skills Configuration

## UI/UX Pro Max — Auto-Activation

**TRIGGER KEYWORDS:** design, create, build, landing, website, dashboard, page, component, UI, UX, interface, app

**ACTION:** When user requests anything matching trigger keywords:

1. **BEFORE ANY CODE** → Run design system generation:
   ```bash
   python .agent/skills/ui_ux_pro_max/scripts/search.py "<query>" --design-system --persist -p "Project"
   ```

2. **USE OUTPUT** → Implement using generated design tokens

3. **NO EXCEPTIONS** → This is MANDATORY for all visual work

---

## Why This Matters

❌ **Without skill:** Generic colors, basic fonts, inconsistent spacing
✅ **With skill:** Curated palettes, professional typography, harmonious design

**Token cost:** ~200 tokens per workflow trigger
**Value:** Professional-grade design system in 5 seconds

---

## Quick Reference

- Full rules: `.agent/DESIGN_RULES.md`
- Workflow: `.agent/workflows/design.md` (use `/design`)
- Skill documentation: `.agent/skills/ui_ux_pro_max/SKILL.md`
