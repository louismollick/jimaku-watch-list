import { ExternalLink } from "lucide-react"
import type { FocusEvent, ReactNode } from "react"

export function ResultCardActions({
  links,
  onBlur,
  onFocus,
  onPointerEnter,
  onPointerLeave,
}: {
  links: Array<{ href: string; icon: ReactNode; label: string }>
  onBlur?: (event: FocusEvent<HTMLAnchorElement>) => void
  onFocus?: () => void
  onPointerEnter?: () => void
  onPointerLeave?: () => void
}) {
  return links.map((link) => (
    <a
      className="flex h-9 items-center gap-2 rounded-md border border-border bg-card px-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25"
      href={link.href}
      key={link.label}
      onBlur={onBlur}
      onFocus={onFocus}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      rel="noreferrer"
      target="_blank"
    >
      {link.icon}
      <span className="min-w-0 flex-1 truncate">{link.label}</span>
      <ExternalLink className="size-3.5 shrink-0 text-muted-foreground" />
    </a>
  ))
}
