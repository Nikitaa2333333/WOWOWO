# Centrifuge Project Context Memo

## Current Focus
- Primary work is being done on the **"centrifuge"** category and its subcategories.
- All 152 scraped products are currently under the "centrifuge" category.
- Improving data display (unique images, variety) is a priority for this category.

## Architectural Principles (DO NOT CHANGE WITHOUT USER APPROVAL)
- **Home Page Structure**: Must display ALL categories in a grid (e.g., General Lab, Analytical, Distillation, etc.), even if they are currently "shells".
- **Toggle View**: The Home page must maintain the "Categories" vs "Manufacturers" toggle.
- **Data Integrity**: `lib/data.ts` should contain the logical structure for ALL categories.
- **Routing**: Users navigate from Home -> Category -> Subcategory -> Product.

## Current Technical Strategy
- Images are picked from the `product.images` array using an ID-based hash for visual variety on the thumbnail level (to avoid identical placeholders).
- Data is loaded from `public/data/products.json`.
- Icons are mapped by category ID in `Home.tsx`.

## System Instruction
- NEVER collapse the entire Home page into a single "Centrifuge" tile again.
- NEVER remove the "Manufacturers" toggle or other "currently empty" categories.
- Always provide PowerShell commands for the user to run manually.
