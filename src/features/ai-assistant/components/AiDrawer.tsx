import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { useChat } from "../hooks/useChat"; // <--- Usar TU hook
import { Bot, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export function AiDrawer() {
    // Usamos el hook que conecta con Java, no el de Vercel AI SDK
    const { isOpen, toggleOpen, messages, sendMessage, isLoading } = useChat();
    const pathname = usePathname();

    const handleSendMessage = (content: string) => {
        sendMessage(content);
    };

    return (
        <Sheet open={isOpen} onOpenChange={toggleOpen}>
            <SheetContent className="w-[400px] sm:w-[540px] flex flex-col h-full">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <Bot className="h-5 w-5" />
                        Asistente Financiero (Backend Java)
                    </SheetTitle>
                    <SheetDescription>
                        Conectado a tus datos reales de Facturación y Contabilidad.
                    </SheetDescription>
                    <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 w-full"
                        onClick={() => handleSendMessage(`¿Qué puedo hacer en la página ${pathname}?`)}
                    >
                        <HelpCircle className="mr-2 h-4 w-4" />
                        Preguntar sobre esta página
                    </Button>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto my-4 pr-4">
                    <MessageList messages={messages} isLoading={isLoading} />
                </div>

                <div className="mt-auto">
                    <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
                </div>
            </SheetContent>
        </Sheet>
    );
}
