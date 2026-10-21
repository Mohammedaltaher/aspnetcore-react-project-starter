# Frontend design foundation

The starter's dashboard is inspired by [Riju Rajan's ICarePro medical admin dashboard](https://dribbble.com/shots/21377516-Medical-Admin-Dashboard-ICarePro). It adapts the white navigation rail, quiet canvas, thin card borders, colorful metric icons, charts, and compact tables to a generic Customers sample. It does not copy the medical branding or claim to provide medical workflows.

## Preview routes

- `/design-system` shows the dashboard composition with clearly labeled sample metrics. The chart period control switches the sample data.
- `/components` shows buttons, fields, status badges, feedback, loading, empty states, tables, details, and confirmation patterns.
- `/customers` is the authenticated Customers module connected to the API.

An [editable Figma dashboard mockup](https://www.figma.com/design/7sYGGns2J3SokeobpC7vrK?node-id=4-2) sits beside the original component study for further exploration. The React pages and CSS are the current implementation reference.

## Reusable pieces

| Pattern | Implementation | Use |
| --- | --- | --- |
| App shell and navigation | `src/components/AppShell.tsx` | White sidebar, active navigation, mobile menu, account actions |
| Dashboard composition | `src/pages/DashboardPreviewPage.tsx` | Sample metrics, trends, channel chart, and tables |
| Page heading | `src/components/patterns.tsx` | Eyebrow, title, description, and main action |
| Status and feedback | `src/components/patterns.tsx` | Badges, success/error messages, loading, and empty states |
| Confirmation dialog | `src/components/patterns.tsx` | Name the record before destructive actions |
| Buttons, cards, fields, table | `src/components/ui/` | Shared controls based on shadcn/ui and Base UI |
| Tokens and layout | `src/design.css`, `src/reference-theme.css` | Shared patterns plus the reference-inspired theme and dashboard layout |

## Page conventions

1. Use `PageHeading` for module pages. Put the main action in its `action` slot.
2. Show loading, error, empty, and success states explicitly. Give error and empty states a useful next action.
3. Keep list search and sort together. Put row actions at the end. Use server pagination for real data.
4. Confirm destructive actions in `ConfirmDialog`; enforce authorization in the API.
5. Keep form labels visible and show validation near the field. Use the shared banner for server errors.
6. Replace dashboard sample metrics with real API data when copying the starter for a product, or remove the preview route.

The two preview routes are public so the design can be reviewed without a seeded account. Remove or protect them if a product should keep its component gallery internal.
