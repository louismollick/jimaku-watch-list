# Design system

The app is **dark-only** and styled through a single set of semantic tokens. The
golden rule: **never hardcode `slate-*` / `sky-*` colors or arbitrary
`text-[..px]` / `rounded-[..]` values in components.** Use the tokens, the radius
scale, and the shared components below. Tokens live in
[`src/styles.css`](src/styles.css) (`:root`); they are the only place colors and
the radius base are defined.

## Color tokens

Use the Tailwind classes (`bg-*`, `text-*`, `border-*`) — never the raw slate
shade. Intent matters more than the hex.

| Token | Class | Hex (slate/sky) | Use for |
|---|---|---|---|
| background | `bg-background` | `#08111d` | the page navy |
| card / popover | `bg-card` · `bg-popover` | `#0f1828` | raised content/overlay surfaces (cards, dialog, select/combobox menus, tooltips, chips) — one step above the page navy |
| foreground | `text-foreground` | `#f1f5f9` (slate-100) | primary text |
| secondary / muted / accent | `bg-secondary` · `bg-muted` · `bg-accent` | `#1e293b` (slate-800) | controls, hover/active surfaces, pills |
| muted-foreground | `text-muted-foreground` | `#94a3b8` (slate-400) | labels, captions, dimmed/secondary text, icons |
| primary | `bg-primary` / `text-primary` | `#38bdf8` (sky-400) | the accent: CTA, active states, slider/checkbox fill |
| primary-foreground | `text-primary-foreground` | `#020617` | text/icons on a primary fill |
| border / input | `border-border` · `bg-input` | `#1e293b` (slate-800) | all borders; control fills use `bg-input/60` |
| ring | `ring-ring` | `#38bdf8` (sky-400) | focus rings (`focus-visible:ring-ring/25`) |
| destructive | `text-destructive` / `bg-destructive/10` | `#fb7185` (rose-400) | errors, danger badges |

Status/warning accents that carry meaning (the watch-status dots in
[`src/lib/status.ts`](src/lib/status.ts), amber/rose `WarningDot`) intentionally
use literal colors — they are data, not chrome.

## Radius scale

Base is `--radius: 0.375rem`; the rest scale from it. The whole scale is
deliberately **slight** — no large pill-corners on containers.

| Class | ≈ size | Use for |
|---|---|---|
| `rounded-sm` | ~4px | tiny chrome: checkboxes, logos, inline marks |
| `rounded-md` | ~5px | **controls**: buttons, inputs, select/combobox triggers, menu options, tabs |
| `rounded-lg` | ~6px | **containers**: cards, dialog, popover/select menus, tooltips, callouts |
| `rounded-full` | — | dots, status pills, badges |

Do not use `rounded-xl` / `rounded-2xl` / `rounded-4xl` or arbitrary
`rounded-[Npx]`.

## Type scale

Tailwind defaults; pick by role, never arbitrary pixels.

| Class | size | Use for |
|---|---|---|
| `text-xs` | 12px | overline labels (see `FieldLabel`), captions, micro text |
| `text-label` | 13px | filter / form field labels (the `Label` above a control) |
| `text-sm` | 14px | **default** for body, controls, inputs, options |
| `text-base` | 16px | the hero search field only |
| `text-lg` | 18px | dialog/section titles |
| `text-xl` | 20px | dialog heading |
| `text-4xl` / `text-5xl` | — | the landing `<h1>` |

## Spacing

- Dialog/card padding: `p-4`; inner section gaps `gap-4`/`gap-5`.
- Filter rows: `space-y-2` (label + control); filter groups: `space-y-6`.
- Result grid gap: `gap-4`.

## Shared components — reuse before styling

- **`FieldLabel`** ([`src/components/ui/field-label.tsx`](src/components/ui/field-label.tsx)) —
  the small overline above a value. Use everywhere a "what is this" caption is
  needed instead of re-inlining `text-xs font-semibold text-muted-foreground`.
  Do not use `uppercase` or `tracking-[..]` letter-spacing anywhere — labels are
  sentence/title case at normal tracking.
- **`Badge`** ([`src/components/ui/badge.tsx`](src/components/ui/badge.tsx)) — pills
  and tags. `variant="neutral"` for status/genre chips, `variant="destructive"`
  for danger. Size tweaks via `className` (e.g. `h-auto px-3 py-1 text-sm`).
- **`Label`** ([`src/components/ui/label.tsx`](src/components/ui/label.tsx)) — form
  field labels (defaults to `text-sm font-medium`); recolor with
  `text-muted-foreground`. Filter/sidebar field labels use `text-label` (13px).
- Standard **shadcn primitives** in [`src/components/ui/`](src/components/ui)
  (`Button`, `Input`, `Select`, `Dialog`, `Card`, `Tooltip`, `Tabs`, `Slider`,
  `Checkbox`, `MultiSelectCombobox`) already consume the tokens — prefer them
  over bespoke markup.

## Adding a new component

1. Build from an existing `ui/` primitive when one fits.
2. Color only through tokens; radius only through the scale; size only through
   the type scale.
3. If you write the same label/pill markup twice, lift it into a shared
   component (`FieldLabel`/`Badge`) instead of copying classes.
