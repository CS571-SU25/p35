/*  src/lib/utils.ts  */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind class strings safely.
 *
 * ```ts
 * cn("p-2", condition && "text-red-500", "hover:bg-gray-800")
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}
