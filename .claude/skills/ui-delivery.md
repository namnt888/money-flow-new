# UI Delivery

- Mobile-first: build for small screen first, add desktop breakpoints
- Fast interactions: sheets/drawers close immediately on submit
- Show loading state (skeleton) before data arrives
- Show empty state when no data
- Use shadcn/ui components from `src/components/ui/`
- New components should be small and focused
- Avoid unnecessary animation
- Use Badge for status labels
- Use Card for grouped content
- Responsive: use `sm:`, `md:` Tailwind prefixes

## UI Table Rules
- Prefer full-width desktop content usage for data-heavy pages; avoid overly narrow containers that waste horizontal space.
- Horizontal table scroll should be a fallback, not the default desktop experience.
- Avoid monospace for table body cells unless explicitly requested.
- Prefer default UI font with consistent numeric alignment.
- Use readable number formatting:
  - thousands separators
  - hide unnecessary trailing `.00` where appropriate
  - blank noisy zero values where appropriate
- Use subtle header backgrounds and column separation for dense data tables.
