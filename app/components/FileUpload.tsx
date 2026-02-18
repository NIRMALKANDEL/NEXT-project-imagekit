"use client";

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { useRef, useState } from "react";

interface FileUploadProps {
  onUploadSuccess?: (response: any) => void;
  onUploadProgress?: (progress: number) => void;
  onUploadError?: (error: any) => void;
  fileType?: "image" | "video";
}

const FileUpload = ({
  onUploadError,
  onUploadProgress,
  onUploadSuccess,
  fileType,
}: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFileType = (file: File) => {
    if (fileType === "video" && !file.type.startsWith("video/")) {
      return "Please select a valid video file.";
    }

    if (file.size > 100 * 1024 * 1024) {
      return "File exceeds 100MB limit.";
    }

    return true;
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationResult = validateFileType(file);
    if (validationResult !== true) {
      setError(validationResult as string);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const authRes = await fetch("/api/auth/imageKit-auth");
      const authData = await authRes.json();

      const uploadResponse = await upload({
        expire: authData.expire,
        token: authData.token,
        signature: authData.signature,
        publicKey:
          process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
        file,
        fileName: file.name,
        onProgress: (event) => {
          if (event.lengthComputable && onUploadProgress) {
            const progress = Math.round(
              (event.loaded / event.total) * 100
            );
            onUploadProgress(progress);
          }
        },
      });

      // ✅ Notify parent
      onUploadSuccess?.(uploadResponse);

      // ✅ Reset input
      if (inputRef.current) inputRef.current.value = "";
    } catch (err: any) {
      let message = "Upload failed.";

      if (err instanceof ImageKitAbortError)
        message = "Upload aborted.";
      else if (err instanceof ImageKitInvalidRequestError)
        message = "Invalid request.";
      else if (err instanceof ImageKitUploadNetworkError)
        message = "Network error.";
      else if (err instanceof ImageKitServerError)
        message = "Server error.";

      setError(message);
      onUploadError?.(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept={fileType === "video" ? "video/*" : "image/*"}
        onChange={handleFileChange}
        disabled={uploading}
      />

      {uploading && <p>Uploading...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default FileUpload;
