import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-md border border-input bg-input/20 px-3 py-1.5 text-xs transition-all duration-200 outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/40 hover:border-input/80 hover:bg-input/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/10 disabled:opacity-50 disabled:text-muted-foreground aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/30 file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-xs file:font-medium file:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export { Input }
