import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useState } from "react";

interface QuickAction {
    label: string;
    prompt: string;
}

interface ChatInputProps {
    onSend: (message: string) => void;
    isLoading: boolean;
    quickActions?: QuickAction[];
}

const DEFAULT_QUICK_ACTIONS: QuickAction[] = [
    { label: "🌱 Mi Huella CO2", prompt: "¿Cuál es mi huella de carbono actual?" },
    { label: "📊 Auditar F29", prompt: "Ayúdame a revisar mi declaración F29" },
    { label: "💡 Ahorro Energía", prompt: "Dame consejos para reducir el consumo energético de mi empresa" },
];

export function ChatInput({ onSend, isLoading, quickActions = DEFAULT_QUICK_ACTIONS }: ChatInputProps) {
    const [input, setInput] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        onSend(input);
        setInput("");
    };

    const handleQuickAction = (prompt: string) => {
        setInput(prompt);
        // Optionally auto-send
        // onSend(prompt);
    };

    return (
        <div className="space-y-2">
            {/* Quick Action Chips */}
            {quickActions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {quickActions.map((action, index) => (
                        <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickAction(action.prompt)}
                            disabled={isLoading}
                            className="text-xs h-7 px-2 hover:bg-green-50 hover:border-green-300 dark:hover:bg-green-950"
                        >
                            {action.label}
                        </Button>
                    ))}
                </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Escribe tu consulta..."
                    disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        </div>
    );
}
