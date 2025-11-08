import { cn } from "@/lib/utils";

interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function Kbd({ children, className, ...props }: KbdProps) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center px-2 py-1 text-xs font-semibold border rounded-md bg-muted text-muted-foreground border-border min-w-[1.75rem]",
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  );
}
