'use client';
import { useEffect, useState } from 'react';
import { CheckCircle, Sparkles } from 'lucide-react';

export function CelebrationOverlay({ show, onClose }: { show: boolean; onClose: () => void }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (show) {
            setTimeout(() => setIsVisible(true), 100);
            const timer = setTimeout(onClose, 3500); // Auto cierre
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [show, onClose]);

    if (!show) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`text-center transform transition-all duration-700 ${isVisible ? 'scale-100 translate-y-0' : 'scale-50 translate-y-10'}`}>
                <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-emerald-500 rounded-full blur-3xl opacity-50 animate-pulse" />
                    <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 p-8 rounded-full shadow-2xl">
                        <CheckCircle className="w-24 h-24 text-white animate-bounce" />
                    </div>
                </div>
                <h2 className="text-5xl font-black text-white mb-2">¡Solicitud Enviada!</h2>
                <p className="text-xl text-emerald-200 font-bold">Tu Pasaporte Verde ha sido validado.</p>
                <p className="text-white/80 mt-2">Un ejecutivo te contactará en breve.</p>
            </div>
        </div>
    );
}
