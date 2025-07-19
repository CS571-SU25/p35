import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className = "", ...props }, ref) => (
        <input
            ref={ref}
            className={`w-full rounded-md border border-border bg-input px-3 py-2 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
            {...props}
        />
    )
);

Input.displayName = "Input";
