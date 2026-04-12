"use client";

import { useState, useCallback, useRef } from "react";
import Cropper, { type Area } from "react-easy-crop";

interface ImageUploadProps {
    onImageReady: (file: File) => void;
    currentImageUrl?: string | null;
    aspectRatio?: number;
    shape?: "rect" | "round";
    label?: string;
}

async function getCroppedImage(imageSrc: string, crop: Area): Promise<File> {
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => (image.onload = resolve));

    const canvas = document.createElement("canvas");
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d")!;

    ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
    );

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(new File([blob!], "cropped.png", { type: "image/png" }));
        }, "image/png");
    });
}

export default function ImageUpload({
    onImageReady,
    currentImageUrl,
    aspectRatio = 1,
    shape = "rect",
    label = "Upload Image",
}: ImageUploadProps) {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedArea, setCroppedArea] = useState<Area | null>(null);
    const [preview, setPreview] = useState<string | null>(currentImageUrl ?? null);
    const [cropping, setCropping] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setImageSrc(reader.result as string);
            setCropping(true);
            setCrop({ x: 0, y: 0 });
            setZoom(1);
        };
        reader.readAsDataURL(file);
    }

    const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
        setCroppedArea(croppedAreaPixels);
    }, []);

    async function handleConfirmCrop() {
        if (!imageSrc || !croppedArea) return;

        const croppedFile = await getCroppedImage(imageSrc, croppedArea);
        const previewUrl = URL.createObjectURL(croppedFile);
        setPreview(previewUrl);
        setCropping(false);
        setImageSrc(null);
        onImageReady(croppedFile);
    }

    function handleCancelCrop() {
        setCropping(false);
        setImageSrc(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    function handleRemove() {
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    return (
        <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">{label}</label>

            {/* Cropper modal */}
            {cropping && imageSrc && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-zinc-950/70 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
                        <p className="mb-3 text-sm font-medium">Crop your image</p>
                        <div className="relative h-64 w-full overflow-hidden rounded-lg bg-zinc-100">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={aspectRatio}
                                cropShape={shape}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        </div>
                        <div className="mt-3">
                            <label className="mb-1 block text-xs text-zinc-500">Zoom</label>
                            <input
                                type="range"
                                min={1}
                                max={3}
                                step={0.1}
                                value={zoom}
                                onChange={(e) => setZoom(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>
                        <div className="mt-4 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleCancelCrop}
                                className="rounded-lg px-4 py-2 text-sm text-zinc-500 hover:text-zinc-800"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmCrop}
                                className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview */}
            {preview && !cropping && (
                <div className="mb-3 flex items-center gap-3">
                    <img
                        src={preview}
                        alt="Preview"
                        className={`h-16 w-16 object-cover ${shape === "round" ? "rounded-full" : "rounded-lg"}`}
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="text-sm text-red-500 hover:text-red-700"
                    >
                        Remove
                    </button>
                </div>
            )}

            {/* File input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="w-full text-sm text-zinc-500 file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-zinc-700 hover:file:bg-zinc-200"
            />
        </div>
    );
}
