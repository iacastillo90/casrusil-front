import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LogoUploadProps {
    currentLogo?: string;
    onLogoChange: (file: File | null) => void;
}

export function LogoUpload({ currentLogo, onLogoChange }: LogoUploadProps) {
    const [preview, setPreview] = useState<string | null>(currentLogo || null);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File) => {
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
                onLogoChange(file);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const removeLogo = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering click on dropzone
        setPreview(null);
        onLogoChange(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-medium">Logo de la Empresa</h3>
            <div
                className={cn(
                    "relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg transition-colors cursor-pointer",
                    dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
                    preview ? "border-none p-0 overflow-hidden" : "p-6"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleChange}
                />

                {preview ? (
                    <div className="relative w-full h-full group">
                        <img
                            src={preview}
                            alt="Logo Preview"
                            className="w-full h-full object-contain p-2"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={removeLogo}
                            >
                                <X className="h-4 w-4 mr-2" /> Eliminar Logo
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center space-y-2">
                        <div className="p-3 bg-muted rounded-full inline-flex">
                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Click o arrastra tu logo aquí</p>
                            <p className="text-xs text-muted-foreground">PNG, JPG hasta 5MB</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
