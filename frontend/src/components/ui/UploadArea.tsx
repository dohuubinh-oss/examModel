import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Image as ImageIcon, Upload, X } from 'lucide-react';

export interface UploadAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  minHeight?: string;
  onFileSelect?: (file: File | null) => void;
}

export const UploadArea = React.forwardRef<HTMLDivElement, UploadAreaProps>(
  ({ className, label = "Kéo thả hoặc Tải ảnh", minHeight = "min-h-[200px]", onFileSelect, ...props }, ref) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleDrag = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };

    const processFile = (file: File) => {
      if (file && file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        if (onFileSelect) onFileSelect(file);
      }
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processFile(e.dataTransfer.files[0]);
      }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        processFile(e.target.files[0]);
      }
    };

    const handleAreaClick = () => {
      if (!previewUrl && fileInputRef.current) {
        fileInputRef.current.click();
      }
    };

    const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation();
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (onFileSelect) onFileSelect(null);
    };

    return (
      <div
        ref={ref}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={handleAreaClick}
        style={{
          backgroundImage: 'radial-gradient(#e2e8f0 1.5px, transparent 1.5px)',
          backgroundSize: '20px 20px',
        }}
        className={cn(
          "relative group border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden p-6 text-center select-none",
          dragActive 
            ? "border-primary bg-primary/5 shadow-md shadow-primary/5" 
            : "border-slate-200 bg-slate-50/50 hover:border-primary/50 hover:bg-slate-50/80",
          minHeight,
          className
        )}
        {...props}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {previewUrl ? (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-white p-2">
            <img 
              src={previewUrl} 
              alt="Upload preview" 
              className="w-full h-full object-contain rounded-xl"
            />
            <button
              onClick={handleRemove}
              className="absolute top-3 right-3 p-1.5 bg-slate-900/80 hover:bg-slate-950 text-white rounded-full transition-colors z-10"
              title="Xóa ảnh"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:scale-110 transition-all duration-300">
              <Upload size={20} className="group-hover:animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-700 transition-colors">
                {label}
              </p>
              <p className="text-[10px] text-slate-400 font-medium mt-1">
                Kéo thả tệp tin ảnh hoặc nhấn để chọn từ máy tính
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }
);

UploadArea.displayName = "UploadArea";
