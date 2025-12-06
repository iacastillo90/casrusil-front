import { CheckCircle2, Circle, Clock, FileText, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface DTEStatusTrackerProps {
    status: 'DRAFT' | 'SIGNED' | 'SENT' | 'ACCEPTED' | 'REJECTED';
}

export function DTEStatusTracker({ status }: DTEStatusTrackerProps) {
    const steps = [
        { id: 'DRAFT', label: 'Borrador', icon: FileText },
        { id: 'SIGNED', label: 'Firmada', icon: CheckCircle2 },
        { id: 'SENT', label: 'Enviada SII', icon: Send },
        { id: 'ACCEPTED', label: 'Aceptada', icon: CheckCircle2 },
    ];

    const currentStepIndex = steps.findIndex(s => s.id === status);
    // Handle REJECTED as a special case or map it to SENT but red
    const isRejected = status === 'REJECTED';

    return (
        <div className="w-full py-4">
            <div className="relative flex items-center justify-between w-full">
                {/* Connecting Line */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-muted -z-10" />
                <div
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-primary transition-all duration-500 -z-10"
                    style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;

                    return (
                        <div key={step.id} className="flex flex-col items-center bg-background px-2">
                            <div
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                                    isCompleted ? "bg-primary border-primary text-primary-foreground" : "bg-background border-muted text-muted-foreground",
                                    isCurrent && "ring-4 ring-primary/20"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                            </div>
                            <span className={cn(
                                "mt-2 text-xs font-medium",
                                isCompleted ? "text-primary" : "text-muted-foreground"
                            )}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
            {isRejected && (
                <div className="mt-4 p-2 bg-destructive/10 text-destructive text-center rounded text-sm font-medium">
                    Documento Rechazado por el SII
                </div>
            )}
        </div>
    );
}
