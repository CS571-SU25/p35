//  src/components/ui/skeleton.tsx
import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Simple gray pulse placeholder.  Tailwind’s animate-pulse handles the shimmer.
 */
export function Skeleton({ className, ...props }: Props) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-700/70",
        className
      )}
      {...props}
    />
  );
}
