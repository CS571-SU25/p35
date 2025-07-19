import { Toast } from "@/components/ui/toast.tsx";

interface Props {
    warnings: string[];
}

export function CompatibilityToast({ warnings }: Props) {
    if (!warnings.length) return null;
    return (
        <Toast variant="destructive" title="Compatibility alerts">
            <ul className="ml-4 list-disc space-y-1">
                {warnings.map((w) => (
                    <li key={w}>{w}</li>
                ))}
            </ul>
        </Toast>
    );
}
