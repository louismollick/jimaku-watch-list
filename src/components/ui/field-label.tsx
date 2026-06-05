import type * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Overline label — the small caption used above field values (dialog, tooltip,
 * select groups, filters). Canonical style for "what is this value" labels.
 * See DESIGN.md.
 */
function FieldLabel({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-label"
      className={cn("text-xs font-semibold text-muted-foreground", className)}
      {...props}
    />
  )
}

export { FieldLabel }
