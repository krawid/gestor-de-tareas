import { forwardRef } from "react"
import { cn } from "@/lib/utils"

export interface NativeTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const NativeTextarea = forwardRef<HTMLTextAreaElement, NativeTextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
NativeTextarea.displayName = "NativeTextarea"

export { NativeTextarea }
