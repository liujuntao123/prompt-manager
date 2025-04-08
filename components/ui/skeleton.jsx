import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    (<div
      className={cn("animate-pulse rounded bg-primary/10", className)}
      {...props} />)
  );
}

export { Skeleton }
