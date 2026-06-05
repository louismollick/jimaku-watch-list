import { type ClassValue, clsx } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Register custom font sizes (see styles.css `--text-*`) so tailwind-merge
// treats them as size utilities and resolves conflicts with `text-sm` etc.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": ["text-label"],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
