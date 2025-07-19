import { PartCard } from "./PartCard.tsx";
import type { Part } from "@/lib/types";

interface Props {
    parts: Part[];
    selectedId?: string;
    onSelect: (p: Part) => void;
}

export default function PartPickerCardGrid({ parts, selectedId, onSelect }: Props) {
    return (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
            {parts.map((p) => (
                <PartCard key={p.id} part={p} selected={p.id === selectedId} onOpenDetails={onSelect} />
            ))}
        </div>
    );
}
