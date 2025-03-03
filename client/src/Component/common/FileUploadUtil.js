import imageCompression from 'browser-image-compression';
import jaxios from '../../util/jwtUtil';

// ✅ 허용된 파일 확장자 및 크기 제한
const allowedImageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
const allowedVideoExtensions = ['mp4', 'webm', 'ogg'];
const MAX_FILE_SIZE_MB = 5; // 5MB 제한

// ✅ 파일 검증 함수 (확장자 & MIME 타입 검사)
export function validateFile(file) {
    if (!file) return { valid: false, message: "파일이 선택되지 않았습니다." };

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const allowedImageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const allowedVideoExtensions = ['mp4', 'webm', 'ogg'];
    const isImage = allowedImageExtensions.includes(fileExtension);
    const isVideo = allowedVideoExtensions.includes(fileExtension);

    // ✅ MIME 타입 검사
    if (!(file.type.startsWith('image/') || file.type.startsWith('video/'))) {
        return { valid: false, message: "지원되지 않는 파일 형식입니다. (이미지: jpg, png / 동영상: mp4, webm)" };
    }

    // ✅ 확장자 & MIME 타입 불일치 차단
    if ((file.type.startsWith('image/') && !isImage) || (file.type.startsWith('video/') && !isVideo)) {
        return { valid: false, message: `파일 확장자(${fileExtension})와 MIME 타입(${file.type})이 일치하지 않습니다.` };
    }

    // ✅ 파일 크기 검사 (5MB 제한)
    const MAX_FILE_SIZE_MB = 5;
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        return { valid: false, message: `파일 크기가 너무 큽니다! (${(file.size / 1024 / 1024).toFixed(2)}MB) (최대 ${MAX_FILE_SIZE_MB}MB)` };
    }

    return { valid: true };
}


/**
 * 단일 파일 업로드 함수
 */
export async function uploadFile(file, url) {
    const validation = validateFile(file);
    if (!validation.valid) {
        alert(validation.message);
        return null;
    }

    let processedFile = file;

    // ✅ 이미지 압축 (이미지만 적용)
    if (file.type.startsWith('image/')) {
        processedFile = await imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
        });
    }

    // ✅ FormData 생성 및 서버 업로드
    const formData = new FormData();
    formData.append('file', processedFile);


    try {
        const response = await jaxios.post(url, formData);
        if (response.data.error) {
            alert(response.data.error);
            return null;
        }
        if (!response.data.filename) {
            alert("서버 응답이 올바르지 않습니다.");
            return null;
        }
        return response.data;
        
    } catch (error) {
        console.error("파일 업로드 오류:", error);
        alert("파일 업로드 중 오류가 발생했습니다.");
        return null;
    }
}

/**
 * 다중 파일 업로드 함수
 */
export async function uploadMultipleFiles(files, url) {
    if (!files || files.length === 0) {
        alert("파일을 선택해주세요.");
        return [];
    }

    // ✅ 각 파일을 `uploadFile` 함수를 통해 업로드
    const uploadPromises = files.map(file => uploadFile(file, url));
    return Promise.all(uploadPromises);
}
