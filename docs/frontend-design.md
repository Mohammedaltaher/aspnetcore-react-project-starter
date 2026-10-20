# Frontend design foundation

The starter uses a calm workspace layout: a dark navigation rail, a light content canvas, restrained cobalt actions, and clear status colors. The working preview is at `/design-system` after `docker compose up --build -d` or `cd frontend && pnpm dev`. It uses sample data and does not change the database.

An [editable Figma mockup board](https://www.figma.com/design/7sYGGns2J3SokeobpC7vrK) mirrors the common component patterns. It uses native Figma frames and text so the examples can be adapted for a copied project. The React gallery is the working reference for implementation and interaction.

## Review of the original UI

The initial screens covered the customer workflow but relied on page-specific colors and layout rules. The header had no reusable navigation pattern, mobile users had little context outside a horizontally scrolling table, empty and error states were plain text, and delete used the browser's native confirmation prompt. The updated shell, tokens, state components, and dialog give future modules consistent patterns to copy.

## Reusable pieces

| Pattern | Implementation | Use |
| --- | --- | --- |
| App shell and navigation | `src/components/AppShell.tsx` | Consistent layout, active navigation, mobile menu, account actions |
| Page heading | `src/components/patterns.tsx` | Eyebrow, title, description, and one main action |
| Status badge | `src/components/patterns.tsx` | Neutral, success, warning, and information states |
| Feedback banner | `src/components/patterns.tsx` | Success and error feedback with an optional dismiss action |
| Loading and empty states | `src/components/patterns.tsx` | Explain waits and what to do when a list has no results |
| Confirmation dialog | `src/components/patterns.tsx` | Name the record before destructive actions |
| Buttons, cards, fields, table | `src/components/ui/` | Shared controls based on shadcn/ui and Base UI |
| Tokens and layout | `src/design.css` | Product colors, spacing, layout, responsive behavior |

## Page conventions

1. Use `PageHeading` for every module page. Put the main action in its `action` slot.
2. Show loading, error, empty, and success states explicitly. Give error and empty states a useful next action.
3. Keep list search and sort together. Put row actions at the end of the row. Use server pagination for real data.
4. Confirm destructive actions in `ConfirmDialog`; keep authorization in the API. The UI only hides actions the user cannot take.
5. Keep form labels visible and show validation near the field. Use the shared feedback banner for server errors.
6. Use semantic tokens and shared patterns when rebranding a copied project. Replace the wordmark and colors in `AppShell.tsx` and `design.css`.

The design gallery is intentionally public so it can be reviewed without a seeded user account. Remove that route in a product if its component gallery should be internal.
