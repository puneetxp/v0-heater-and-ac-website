"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { AlertCircle, ImageIcon, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductImageUploadProps {
    /** Currently set image URLs (up to 3) */
    currentImages?: string[];
    /** Category for picking fallback images */
    category?: string;
    /** Called when images change (includes both existing and new) */
    onChange?: (images: string[], newFiles: File[]) => void;
    disabled?: boolean;
}

const MAX_IMAGES = 3;
const MAX_SIZE_MB = 5;

export function ProductImageUpload({
    currentImages = [],
    category,
    onChange,
    disabled = false,
}: ProductImageUploadProps) {
    const [images, setImages] = useState<string[]>(
        currentImages.slice(0, MAX_IMAGES),
    );
    const [pendingFiles, setPendingFiles] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const canAddMore = images.length < MAX_IMAGES;

    const processFiles = useCallback(
        (files: FileList | null) => {
            if (!files) return;
            setError(null);
            const remaining = MAX_IMAGES - images.length;
            const toAdd = Array.from(files).slice(0, remaining);
            const newUrls: string[] = [];
            const newFiles: File[] = [];

            for (const file of toAdd) {
                if (!file.type.startsWith("image/")) {
                    setError("Only image files are allowed.");
                    continue;
                }
                if (file.size > MAX_SIZE_MB * 1024 * 1024) {
                    setError(`Each image must be under ${MAX_SIZE_MB}MB.`);
                    continue;
                }
                newUrls.push(URL.createObjectURL(file));
                newFiles.push(file);
            }

            const updated = [...images, ...newUrls];
            const updatedFiles = [...pendingFiles, ...newFiles];
            setImages(updated);
            setPendingFiles(updatedFiles);
            onChange?.(updated, updatedFiles);
        },
        [images, pendingFiles, onChange],
    );

    const removeImage = (index: number) => {
        const isNewFile = index >= currentImages.length;
        const fileIndex = index - (images.length - pendingFiles.length);

        const updated = images.filter((_, i) => i !== index);
        let updatedFiles = pendingFiles;
        if (isNewFile && fileIndex >= 0) {
            // Revoke blob URL to prevent memory leak
            URL.revokeObjectURL(images[index]);
            updatedFiles = pendingFiles.filter((_, i) => i !== fileIndex);
        }
        setImages(updated);
        setPendingFiles(updatedFiles);
        onChange?.(updated, updatedFiles);
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700">
                    Product Images{" "}
                    <span className="text-slate-400 font-normal">
                        ({images.length}/{MAX_IMAGES})
                    </span>
                </p>
                {error && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {error}
                    </p>
                )}
            </div>

            {/* Image grid */}
            <div className="grid grid-cols-3 gap-3">
                {images.map((src, idx) => (
                    <div
                        key={idx}
                        className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-50"
                    >
                        <Image
                            src={src}
                            alt={`Product image ${idx + 1}`}
                            fill
                            className="object-cover"
                            sizes="180px"
                        />
                        {!disabled && (
                            <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Remove image"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                        {idx === 0 && (
                            <span className="absolute bottom-1 left-1 text-[10px] bg-black/50 text-white rounded px-1">
                                Primary
                            </span>
                        )}
                    </div>
                ))}

                {/* Drop zone — only shown if slots remain */}
                {canAddMore && !disabled && (
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        onDragOver={(e) => {
                            e.preventDefault();
                            setDragging(true);
                        }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={(e) => {
                            e.preventDefault();
                            setDragging(false);
                            processFiles(e.dataTransfer.files);
                        }}
                        className={cn(
                            "aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-slate-600 hover:border-slate-400 transition-colors",
                            dragging &&
                                "border-blue-400 text-blue-500 bg-blue-50",
                        )}
                    >
                        {images.length === 0
                            ? (
                                <>
                                    <ImageIcon className="w-8 h-8" />
                                    <span className="text-xs text-center px-2">
                                        Drop images<br />or click to upload
                                    </span>
                                </>
                            )
                            : (
                                <>
                                    <Upload className="w-5 h-5" />
                                    <span className="text-xs">Add more</span>
                                </>
                            )}
                    </button>
                )}

                {/* Extra empty slots placeholders */}
                {images.length === 0 && (
                    <>
                        {[1, 2].map((i) => (
                            <div
                                key={i}
                                className="aspect-square rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-200"
                            >
                                <ImageIcon className="w-6 h-6" />
                            </div>
                        ))}
                    </>
                )}
                {images.length === 1 && (
                    <div className="aspect-square rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-200">
                        <ImageIcon className="w-6 h-6" />
                    </div>
                )}
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => processFiles(e.target.files)}
            />

            <p className="text-xs text-slate-400">
                Upload up to {MAX_IMAGES} images (max{" "}
                {MAX_SIZE_MB}MB each). First image is the primary display image.
            </p>
        </div>
    );
}
