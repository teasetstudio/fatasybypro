export * from './shotUtils';

/**
 * Format file size in bytes to human readable format
 * @param bytes - File size in bytes
 * @returns Formatted file size string (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Validate if a file is an image
 * @param file - File object to validate
 * @returns boolean indicating if file is an image
 */
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

/**
 * Validate file size against a maximum limit
 * @param file - File object to validate
 * @param maxSizeBytes - Maximum size in bytes
 * @returns boolean indicating if file size is valid
 */
export const isValidFileSize = (file: File, maxSizeBytes: number): boolean => {
  return file.size <= maxSizeBytes;
};

/**
 * Get file size validation error message
 * @param file - File object
 * @param maxSizeBytes - Maximum size in bytes
 * @returns Error message or null if valid
 */
export const getFileSizeError = (file: File, maxSizeBytes: number): string | null => {
  if (!isImageFile(file)) {
    return 'Only image files are allowed';
  }
  
  if (!isValidFileSize(file, maxSizeBytes)) {
    const maxSizeFormatted = formatFileSize(maxSizeBytes);
    const fileSizeFormatted = formatFileSize(file.size);
    return `File size too large. Maximum size is ${maxSizeFormatted}. Your file is ${fileSizeFormatted}`;
  }
  
  return null;
};

/**
 * Common toast messages for file operations
 */
export const TOAST_MESSAGES = {
  FILE_UPLOAD_SUCCESS: 'Image uploaded successfully',
  FILE_UPLOAD_ERROR: 'Failed to upload image. Please try again.',
  FILE_DELETE_SUCCESS: 'Image deleted successfully',
  FILE_DELETE_ERROR: 'Failed to delete image. Please try again.',
  FILE_SIZE_ERROR: (maxSize: string) => `File size too large. Maximum size is ${maxSize}`,
  FILE_TYPE_ERROR: 'Only image files are allowed',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  CLOUDINARY_ERROR: 'File size too large for free account. Please compress your image or upgrade your plan.',
  SHOT_CREATED: 'Shot created successfully',
  SHOT_DELETED: 'Shot deleted successfully',
  IMAGE_UPLOADED: 'Image uploaded successfully',
  IMAGE_DELETED: 'Image deleted successfully',
} as const; 