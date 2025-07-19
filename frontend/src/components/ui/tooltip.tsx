import * as RT from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

interface Props {
  content: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

/** Very small Radix tooltip – tuned for quick-peek popups on cards. */
export function Tooltip({ content, className, children }: Props) {
  return (
    <RT.Provider>
      <RT.Root delayDuration={150}>
        <RT.Trigger asChild>{children}</RT.Trigger>
        <RT.Portal>
          <RT.Content
            side="top"
            sideOffset={6}
            className={cn(
              "z-50 rounded-md bg-gray-900/90 px-2 py-1 text-xs text-gray-100 shadow-md backdrop-blur",
              "animate-in fade-in-0 zoom-in-95",
              className,
            )}
          >
            {content}
            <RT.Arrow className="fill-gray-900/90" />
          </RT.Content>
        </RT.Portal>
      </RT.Root>
    </RT.Provider>
  );
}
