'use client';

import React, { useState, useRef } from 'react';
import { Upload, Loader2, CheckCircle2, AlertCircle, Image as ImageIcon } from 'lucide-react';

interface ImageKitUploaderProps {
  currentImageUrl?: string;
  onUploadSuccess: (url: string) => void;
  folder?: string;
  className?: string;
  label?: string;
}

export const ImageKitUploader: React.FC<ImageKitUploaderProps> = ({
  currentImageUrl,
  onUploadSuccess,
  folder = '/gumti-cafe',
  className = '',
  label = 'Upload Image (ImageKit)',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image format
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    // Size limit: 10MB
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Image size exceeds 10MB limit.');
      return;
    }

    setErrorMessage(null);
    setIsUploading(true);
    setUploadSuccess(false);

    // Local instant preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', `${Date.now()}_${file.name.replace(/\s+/g, '_')}`);
      formData.append('folder', folder);

      const res = await fetch('/api/imagekit/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload to ImageKit');
      }

      setPreviewUrl(data.url);
      setUploadSuccess(true);
      onUploadSuccess(data.url);
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Upload failed:', error);
      setErrorMessage(error.message || 'ImageKit upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="block text-xs font-bold text-[#3D1020]">{label}</label>}

      <div className="flex items-center gap-3">
        {/* Preview thumbnail */}
        <div className="w-16 h-16 rounded-xl border-2 border-dashed border-[#E9C5A7] bg-[#FFF4E8] flex items-center justify-center overflow-hidden shrink-0 relative group">
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-6 h-6 text-[#947362]" />
          )}

          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            </div>
          )}
        </div>

        {/* Action button */}
        <div className="flex-1 space-y-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
            disabled={isUploading}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-3.5 py-1.5 bg-[#FFFDF9] hover:bg-[#FBE4CB] border border-[#E9C5A7] rounded-xl text-xs font-bold text-[#3D1020] flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#7C203A]" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5 text-[#7C203A]" />
                <span>Select &amp; Upload</span>
              </>
            )}
          </button>

          {uploadSuccess && (
            <span className="text-[11px] text-[#15803D] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Uploaded to ImageKit
            </span>
          )}

          {errorMessage && (
            <span className="text-[11px] text-[#B91C1C] font-semibold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errorMessage}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
