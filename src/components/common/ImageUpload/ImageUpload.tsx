import { Upload, X } from "lucide-react";
import {
    Controller,
    useFormContext,
} from "react-hook-form";

import { toast } from "sonner";

import {
    Field,
    FieldError,
    FieldLabel,
} from "@/components/ui/field";

import { cn } from "@/lib/utils";

import { useUploadImageMutation } from "@/apis/usersApi";

interface ImageUploadProps {
    name: string;
    label?: string;
    buttonLabel?: string;
    single?: boolean;
}

export default function ImageUpload({
    name,
    label = "Images",
    buttonLabel = "Upload Images",
    single = false,
}: ImageUploadProps) {
    const form = useFormContext();

    const [uploadImage, { isLoading }] = useUploadImageMutation();

    return (
        <Controller
            name={name}
            control={form.control}
            render={({ field, fieldState }) => {
                const previews = single
                    ? field.value
                        ? [field.value]
                        : []
                    : Array.isArray(field.value)
                        ? field.value
                        : [];

                const handleImageUpload = async (
                    e: React.ChangeEvent<HTMLInputElement>
                ) => {
                    const files = e.target.files;

                    if (!files?.length) return;

                    try {
                        const fileArray = Array.from(files);

                        // Validate files
                        for (const file of fileArray) {
                            if (!file.type.startsWith("image/")) {
                                toast.error(
                                    `${file.name} is not an image`
                                );
                                return;
                            }

                            if (file.size > 5 * 1024 * 1024) {
                                toast.error(
                                    `${file.name} exceeds 5MB limit`
                                );
                                return;
                            }
                        }

                        if (single) {
                            const fd = new FormData();

                            fd.append("image", fileArray[0]);

                            const res = await uploadImage(fd).unwrap();

                            field.onChange(res.imageUrl);

                            toast.success(
                                res.message ||
                                "Image uploaded successfully"
                            );
                        } else {
                            const uploadedImages =
                                await Promise.all(
                                    fileArray.map(async (file) => {
                                        const fd = new FormData();

                                        fd.append("image", file);

                                        const res =
                                            await uploadImage(fd).unwrap();

                                        return res.imageUrl;
                                    })
                                );

                            field.onChange([
                                ...(field.value || []),
                                ...uploadedImages,
                            ]);

                            toast.success(
                                "Images uploaded successfully"
                            );
                        }

                        e.target.value = "";
                    } catch (error: any) {
                        console.error(error);

                        toast.error(
                            error?.data?.message ||
                            "Failed to upload images"
                        );
                    }
                };

                const removeImage = (index: number) => {
                    if (single) {
                        field.onChange("");
                        return;
                    }

                    field.onChange(
                        previews.filter(
                            (_: string, i: number) =>
                                i !== index
                        )
                    );
                };

                return (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>
                            {label}
                        </FieldLabel>

                        <div className="flex flex-wrap gap-3">

                            {/* Preview Images */}
                            {previews.map(
                                (image: string, index: number) => (
                                    <div
                                        key={index}
                                        className="relative"
                                    >
                                        <img
                                            src={image}
                                            alt={`Preview ${index + 1}`}
                                            className="h-20 w-20 rounded-md border object-cover"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeImage(index)
                                            }
                                            className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white shadow"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                )
                            )}

                            {/* Upload Button */}
                            {(!single ||
                                previews.length === 0) && (
                                    <label
                                        className={cn(
                                            "flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 transition",
                                            isLoading
                                                ? "pointer-events-none opacity-50"
                                                : "hover:bg-muted"
                                        )}
                                    >
                                        <Upload size={16} />

                                        <span className="text-sm">
                                            {isLoading
                                                ? "Uploading..."
                                                : buttonLabel}
                                        </span>

                                        <input
                                            type="file"
                                            hidden
                                            multiple={!single}
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                        />
                                    </label>
                                )}
                        </div>

                        {fieldState.invalid && (
                            <FieldError
                                errors={[fieldState.error]}
                            />
                        )}
                    </Field>
                );
            }}
        />
    );
}