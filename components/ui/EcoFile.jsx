"use client";

import { useState, useRef, useEffect } from "react";
import { UploadCloud, X, FileImage } from "lucide-react";

export default function EcoFile({
  label,
  error,
  onChange,
  value,
  accept = "image/*",
  maxSizeMB = 2,
  className = "",
}) {
  const [preview, setPreview] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Sync external value
    if (value && typeof value === "string" && value.startsWith("data:image")) {
      setPreview(value);
    } else if (value && typeof value === "string" && value.startsWith("http")) {
      setPreview(value);
    } else if (!value) {
      setPreview(null);
    }
  }, [value]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`Ukuran file maksimal ${maxSizeMB}MB!`);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Set internal preview using object URL for performance
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    // Pass raw file to parent
    if (onChange) {
      onChange(file);
    }
  };

  const processFile = (file) => {
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`Ukuran file maksimal ${maxSizeMB}MB!`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    if (onChange) {
      onChange(file);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (onChange) {
      onChange(null); // Explicitly null to indicate removal
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {label && (
        <label className="font-display font-bold text-sm text-black ml-1">
          {label}
        </label>
      )}

      <div
        className={`relative w-full border-[2.5px] border-dashed border-black rounded-2xl overflow-hidden cursor-pointer transition-all ${
          isHovering || isDragging ? "bg-yellow/20" : "bg-white"
        } ${isDragging ? "border-yellow" : ""} ${
          error ? "border-pink bg-pink/10" : ""
        } ${className}`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />

        {preview ? (
          <div className="relative w-full aspect-21/9 flex items-center justify-center bg-slate-100 group">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white font-bold text-sm bg-black/50 px-3 py-1.5 rounded-xl border border-white/20 pointer-events-none">
                Ganti Gambar
              </span>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors z-10 shadow-md"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center aspect-21/9 pointer-events-none">
            <div className="w-12 h-12 bg-yellow/30 text-yellow-700 rounded-full flex items-center justify-center mb-3">
              <UploadCloud size={24} />
            </div>
            <p className="font-body font-bold text-sm text-black">
              {isDragging
                ? "Lepaskan file di sini"
                : "Klik atau seret gambar ke sini"}
            </p>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Maks {maxSizeMB}MB. Format: JPG, PNG, GIF
            </p>
          </div>
        )}
      </div>

      {error && (
        <span className="text-xs font-bold text-black bg-pink px-2 py-1 rounded-md self-start border-2 border-black">
          {error}
        </span>
      )}
    </div>
  );
}
