import { BalanceSheetSection } from "../types/accounting.types";
import { formatCLP } from "@/lib/formatters";
import { ChevronRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface BalanceSheetTreeProps {
    sections: BalanceSheetSection[];
    level?: number;
}

export function BalanceSheetTree({ sections, level = 0 }: BalanceSheetTreeProps) {
    return (
        <div className="space-y-1">
            {sections.map((section) => (
                <BalanceSheetNode key={section.accountCode} section={section} level={level} />
            ))}
        </div>
    );
}

function BalanceSheetNode({ section, level }: { section: BalanceSheetSection; level: number }) {
    const [isOpen, setIsOpen] = useState(true);
    const hasChildren = section.children && section.children.length > 0;

    return (
        <div>
            <div
                className={cn(
                    "flex items-center justify-between py-2 px-2 hover:bg-muted/50 rounded-md cursor-pointer",
                    level === 0 && "font-bold text-lg border-b mb-2",
                    level === 1 && "font-semibold ml-4",
                    level > 1 && `ml-${level * 4 + 4}`
                )}
                onClick={() => hasChildren && setIsOpen(!isOpen)}
                style={{ paddingLeft: `${level * 1.5}rem` }}
            >
                <div className="flex items-center gap-2">
                    {hasChildren && (
                        <span className="text-muted-foreground">
                            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </span>
                    )}
                    <span>{section.accountCode} - {section.accountName}</span>
                </div>
                <span className="font-mono">{formatCLP(section.amount)}</span>
            </div>

            {isOpen && hasChildren && (
                <BalanceSheetTree sections={section.children!} level={level + 1} />
            )}
        </div>
    );
}
