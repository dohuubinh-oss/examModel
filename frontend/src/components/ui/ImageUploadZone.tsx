'use client';

import React, { useRef, useState } from 'react';

interface ImageUploadZoneProps {
  /** 
   * URL của ảnh hiện tại trong State.
   * Nếu có giá trị, component sẽ hiển thị preview và dùng nó làm old_image_url khi tải ảnh mới.
   */
  value?: string | null;
  /** Callback nhận vào đường dẫn ảnh mới từ server sau khi upload thành công */
  onChange: (url: string) => void;
}

export function ImageUploadZone({ value, onChange }: ImageUploadZoneProps) {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lấy URL của backend, dự phòng cho localhost:8080 nếu biến môi trường chưa có
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      // 1. Khởi tạo FormData
      const formData = new FormData();
      formData.append('image', file);

      // 2. Kèm old_image_url để backend dọn rác
      if (value) {
        formData.append('old_image_url', value);
      }

      // 3. Gọi API POST multipart/form-data
      const response = await fetch(`${apiBaseUrl}/api/v1/upload/question-image`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        // Lấy URL ảnh mới lưu và cập nhật lên State tổng qua callback
        const newImageUrl = result.data.url;
        onChange(newImageUrl);
      } else {
        alert(result.message || 'Có lỗi xảy ra khi tải ảnh lên.');
      }
    } catch (error) {
      console.error('Upload Error:', error);
      alert('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
      // Xóa giá trị input file để có thể chọn lại chính file đó nếu cần
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleContainerClick = () => {
    // Không cho phép click mở hộp thoại nếu đang upload
    if (!isLoading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Helper function để lấy Absolute URL cho preview (do backend trả về relative URL bắt đầu bằng /images)
  const previewUrl = value?.startsWith('/') ? `${apiBaseUrl}${value}` : value;

  return (
    <div
      onClick={handleContainerClick}
      className={`relative flex items-center justify-center w-full min-h-[160px] p-4 border-2 border-dashed rounded-xl cursor-pointer overflow-hidden transition-all group
        ${isLoading ? 'border-gray-300 bg-gray-50 pointer-events-none' : 'border-blue-300 hover:border-blue-400 hover:bg-blue-50/50 bg-white'}`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
        className="hidden"
      />

      {/* Lớp phủ (Overlay) khi đang tải ảnh */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[2px]">
          <svg className="w-8 h-8 text-blue-600 animate-spin mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm font-semibold text-gray-700 animate-pulse">Đang tải ảnh lên...</span>
        </div>
      )}

      {/* Hiển thị Ảnh nếu đã có value, ngược lại hiển thị hướng dẫn Upload */}
      {previewUrl ? (
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Preview Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Preview Image"
            className="max-h-[250px] object-contain rounded-lg shadow-sm"
          />
          {/* Lớp phủ mờ (Hover state) hiển thị nút nhấn để đổi ảnh */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all rounded-lg opacity-0 group-hover:opacity-100 z-10">
            <span className="px-4 py-2 text-sm font-medium text-white bg-black/60 rounded-md backdrop-blur-sm shadow-lg transform scale-95 group-hover:scale-100 transition-transform">
              Nhấn để thay đổi ảnh
            </span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors">
          <svg className="w-12 h-12 mb-3 text-gray-300 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
          </svg>
          <p className="text-[15px] font-medium text-gray-600 mb-1">
            Kéo thả hoặc <span className="text-blue-600 underline underline-offset-2">chọn ảnh</span>
          </p>
          <p className="text-xs text-gray-400">Hỗ trợ JPG, PNG, WEBP (Tối đa 5MB)</p>
        </div>
      )}
    </div>
  );
}
