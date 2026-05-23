'use client';

import { useEffect, useRef } from 'react';

/**
 * Hook quản lý việc dọn dẹp (cleanup) rác hình ảnh trên server khi người dùng
 * upload ảnh nhưng lại hủy bỏ form (chuyển trang, đóng tab, reload) mà chưa bấm Lưu.
 *
 * @param uploadedImages Mảng các URL của ảnh đã được tải lên thành công
 * @param isSaved Cờ (flag) boolean xác định xem form đã được submit thành công hay chưa. 
 *                Nếu true, sẽ bỏ qua việc xóa ảnh.
 */
export function useImageCleanup(uploadedImages: string[], isSaved: boolean) {
  // Sử dụng useRef để lưu trữ giá trị mới nhất của State 
  // giúp hàm dọn dẹp trong useEffect (chỉ chạy 1 lần lúc mount) luôn lấy được dữ liệu đúng
  const imagesRef = useRef(uploadedImages);
  const isSavedRef = useRef(isSaved);

  useEffect(() => {
    imagesRef.current = uploadedImages;
    isSavedRef.current = isSaved;
  }, [uploadedImages, isSaved]);

  useEffect(() => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    const cleanupImages = () => {
      const imagesToCleanup = imagesRef.current;
      
      // Nếu user đã bấm lưu thành công hoặc không có ảnh nào để xóa thì bỏ qua
      if (isSavedRef.current || imagesToCleanup.length === 0) return;

      const payload = JSON.stringify({ urls: imagesToCleanup });

      // Ưu tiên sử dụng navigator.sendBeacon. 
      // Đây là Web API tối ưu nhất để gửi request nhỏ đáng tin cậy ngay cả khi trình duyệt đang đóng tab.
      if (navigator.sendBeacon) {
        // Gói payload vào Blob để có thể set header Content-Type là application/json
        const blob = new Blob([payload], { type: 'application/json' });
        navigator.sendBeacon(`${apiBaseUrl}/api/v1/upload/cleanup`, blob);
      } else {
        // Fallback: Sử dụng fetch với tùy chọn keepalive: true
        fetch(`${apiBaseUrl}/api/v1/upload/cleanup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: payload,
          keepalive: true, // Quan trọng: Đảm bảo request vẫn tiếp tục chạy khi unmount/đóng tab
        }).catch((err) => console.error('Lỗi khi dọn dẹp ảnh rác:', err));
      }
    };

    // 1. Lắng nghe sự kiện F5, Reload, Đóng tab của trình duyệt
    const handleBeforeUnload = () => {
      cleanupImages();
      // Ta không return chuỗi gì ở đây vì ta muốn quá trình xóa diễn ra ngầm (silent)
      // chứ không muốn hiện popup "Rời khỏi trang này?" làm phiền người dùng.
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // 2. Lắng nghe sự kiện Component Unmount (xảy ra khi Next.js chuyển route bằng <Link> hoặc router.push)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      cleanupImages();
    };
  }, []);
}
