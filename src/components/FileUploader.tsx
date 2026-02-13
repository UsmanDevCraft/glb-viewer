"use client";

import React, { useState, useRef } from "react";
import { Upload, File, X } from "lucide-react";

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.name.toLowerCase().endsWith(".glb")) {
        setSelectedFile(file);
        onFileSelect(file);
      } else {
        alert("Please upload a .glb file");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative group cursor-pointer transition-all duration-500 ease-out
          border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center
          ${
            isDragging
              ? "border-blue-400 bg-blue-400/10 scale-[1.02] shadow-[0_0_30px_-5px_rgba(96,165,250,0.3)]"
              : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
          }
          backdrop-blur-xl
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".glb"
          className="hidden"
        />

        <div className="relative mb-6">
          <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-xl group-hover:bg-blue-500/30 transition-all duration-500 opacity-0 group-hover:opacity-100" />
          {selectedFile ? (
            <div className="relative bg-blue-500/20 p-4 rounded-2xl">
              <File className="w-12 h-12 text-blue-400" />
            </div>
          ) : (
            <div className="relative bg-white/10 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-500">
              <Upload className="w-12 h-12 text-white/70 group-hover:text-white" />
            </div>
          )}
        </div>

        <div className="text-center">
          {selectedFile ? (
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white truncate max-w-[300px]">
                {selectedFile.name}
              </h3>
              <p className="text-white/50 text-sm">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              <button
                onClick={clearFile}
                className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-medium rounded-full transition-colors flex items-center gap-2 mx-auto"
              >
                <X className="w-4 h-4" /> Remove File
              </button>
            </div>
          ) : (
            <>
              <h3 className="text-2xl font-bold text-white mb-2">
                Drop your GLB here
              </h3>
              <p className="text-white/60 text-lg">
                or{" "}
                <span className="text-blue-400 underline decoration-2 underline-offset-4">
                  browse files
                </span>
              </p>
            </>
          )}
        </div>

        {!selectedFile && (
          <div className="mt-8 flex gap-3">
            <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-white/40 border border-white/10">
              GLB only
            </span>
            <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-white/40 border border-white/10">
              Max 50MB
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
