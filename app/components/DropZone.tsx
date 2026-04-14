"use client";

import { useState, useRef } from "react";

interface DropZoneProps {
    onFiles: (files: File[]) => void;
    accept?: string;
    multiple?: boolean;
    disabled?: boolean;
    children?: React.ReactNode;
    className?: string;
}

export default function DropZone({
    onFiles,
    accept = "image/*",
    multiple = false,
    disabled = false,
    children,
    className,
}: DropZoneProps) {
    const [dragging, setDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dragCounter = useRef(0);

    function handleDragEnter(e: React.DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current++;
        setDragging(true);
    }

    function handleDragLeave(e: React.DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current--;
        if (dragCounter.current === 0) setDragging(false);
    }

    function handleDragOver(e: React.DragEvent) {
        e.preventDefault();
        e.stopPropagation();
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
        dragCounter.current = 0;
        if (disabled) return;

        const files = Array.from(e.dataTransfer.files).filter((f) =>
            accept === "image/*" ? f.type.startsWith("image/") : true
        );
        if (files.length > 0) {
            onFiles(multiple ? files : [files[0]]);
        }
    }

    function handleClick() {
        if (!disabled) fileInputRef.current?.click();
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if (files && files.length > 0) {
            onFiles(Array.from(files));
            e.target.value = "";
        }
    }

    return (
        <div
            onClick={handleClick}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`cursor-pointer transition ${
                dragging
                    ? "border-sky-400 bg-sky-50"
                    : "border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50"
            } ${className ?? "rounded-xl border-2 border-dashed px-6 py-8 text-center"}`}
        >
            {children ?? (
                <div className="flex flex-col items-center gap-2">
                    <svg className="h-8 w-8 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-zinc-500">
                        {dragging ? "Drop here" : "Drag & drop images here, or click to browse"}
                    </p>
                </div>
            )}
            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                multiple={multiple}
                onChange={handleFileChange}
                className="hidden"
                disabled={disabled}
            />
        </div>
    );
}
