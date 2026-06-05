import * as TabsPrimitive from "@radix-ui/react-tabs"
import type * as React from "react"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      className={cn("flex flex-col gap-2", className)}
      data-slot="tabs"
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        "inline-flex h-auto items-center gap-0.5 rounded-md border border-border bg-input/60 p-0.5 text-muted-foreground",
        className
      )}
      data-slot="tabs-list"
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "inline-flex h-6 items-center justify-center rounded-sm px-2 text-xs font-medium whitespace-nowrap text-muted-foreground transition-colors outline-none disabled:pointer-events-none disabled:opacity-50 hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/25 data-[state=active]:bg-background/50 data-[state=active]:text-foreground",
        className
      )}
      data-slot="tabs-trigger"
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn("flex-1 outline-none", className)}
      data-slot="tabs-content"
      {...props}
    />
  )
}

export { Tabs, TabsContent, TabsList, TabsTrigger }
