import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "btn-modern inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-green-600 to-green-500 text-white shadow-md hover:from-green-700 hover:to-green-600 hover:shadow-lg",
        destructive:
          "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md hover:from-red-700 hover:to-red-600",
        outline:
          "border-2 border-green-200 bg-background text-green-700 shadow-sm hover:bg-green-50 hover:border-green-300 hover:text-green-800",
        secondary:
          "bg-gradient-to-r from-gray-100 to-gray-50 text-gray-900 shadow-sm hover:from-gray-200 hover:to-gray-100 border border-gray-200",
        ghost: "text-green-700 hover:bg-green-50 hover:text-green-800",
        link: "text-green-600 underline-offset-4 hover:underline hover:text-green-700",
        success: "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md hover:from-emerald-700 hover:to-emerald-600",
        warning: "bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md hover:from-amber-600 hover:to-yellow-600",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
