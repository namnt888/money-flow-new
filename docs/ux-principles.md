# UX Principles

## Mobile-First
- All screens work on small viewports first
- Navigation is bottom-bar or hamburger on mobile, sidebar on desktop
- Touch targets ≥ 44px

## Fast-Feeling Interactions
- Submit, edit, delete actions close drawers/modals immediately
- Show loading indicator (skeleton/spinner) but don't block UX
- Optimistic UI: update local state before server confirms
- Never make user wait inside an open sheet or drawer

## Feedback
- Toast notifications for success/error
- Inline validation for forms
- Don't use blocking modals for transient feedback
- Keep visual noise low — use color and icon cues sparingly

## Sheet/Drawer Pattern (Future)
- Sheets open from right on desktop, bottom on mobile
- Close on submit with result shown via toast
- Errors shown inline, not as blocking alerts
- Form state persisted if user accidentally closes
