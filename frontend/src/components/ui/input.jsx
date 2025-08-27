import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "form-modern flex h-11 w-full rounded-lg border-2 border-gray-200 bg-background px-4 py-3 text-base transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/20 focus-visible:border-green-500 focus-visible:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 hover:border-gray-300 md:text-sm",
        className
      )}
      ref={ref}
      {...props} />
  );
})
Input.displayName = "Input"

export { Input }
