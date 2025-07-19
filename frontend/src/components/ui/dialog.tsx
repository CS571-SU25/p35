import * as React from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

export const Dialog = RadixDialog.Root;
export const DialogTrigger = RadixDialog.Trigger;
export const DialogContent = ({ className = "", children, ...props }: React.ComponentProps<typeof RadixDialog.Content>) => (
    <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 bg-black/90" />
        <RadixDialog.Content
            className={`fixed top-1/2 left-1/2 w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-off-black text-white p-6 shadow-lg ${className}`}
            {...props}
        >
            {children}
            <RadixDialog.Close asChild>
                <button className="absolute top-3 right-3 inline-flex items-center justify-center rounded-full p-1 hover:bg-muted">
                    <X className="h-4 w-4 text-foreground" />
                </button>
            </RadixDialog.Close>
        </RadixDialog.Content>
    </RadixDialog.Portal>
);
export const DialogTitle = RadixDialog.Title;
export const DialogDescription = RadixDialog.Description;
