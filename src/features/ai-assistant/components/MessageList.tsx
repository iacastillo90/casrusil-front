import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import { ClientMessage } from "@/app/actions";

interface MessageListProps {
    messages: ClientMessage[];
    isLoading?: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
    return (
        <div className="space-y-4">
            {messages.map((message) => (
                <div
                    key={message.id}
                    className={cn(
                        "flex gap-3",
                        message.role === "user" ? "flex-row-reverse" : "flex-row"
                    )}
                >
                    <div
                        className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                            message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                        )}
                    >
                        {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>

                    <div
                        className={cn(
                            "rounded-lg px-4 py-2 max-w-[85%] text-sm",
                            message.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-foreground"
                        )}
                    >
                        {message.display}
                    </div>
                </div>
            ))}

            {isLoading && (
                <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-muted rounded-lg px-4 py-2 text-sm text-muted-foreground animate-pulse">
                        Escribiendo...
                    </div>
                </div>
            )}
        </div>
    );
}
