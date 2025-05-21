import { FileDetails } from '../types';

/**
 * Converts a file to base64 encoding
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:application/msword;base64,")
      const base64String = result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = error => reject(error);
  });
};

/**
 * Creates file details object from File
 */
export const getFileDetails = (file: File): FileDetails => {
  return {
    name: file.name,
    size: file.size,
    type: file.type || 'Unknown type',
    lastModified: file.lastModified
  };
};

/**
 * Formats file size in human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Validates if the file type is supported
 */
export const isValidFileType = (file: File): boolean => {
  // This can be expanded to include other document types
  const supportedTypes = [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/pdf',
    'text/plain'
  ];
  
  return supportedTypes.includes(file.type);
};

/**
 * Determines file icon based on file type
 */
export const getFileTypeIcon = (fileType: string): string => {
  if (fileType.includes('word')) return 'file-text';
  if (fileType.includes('pdf')) return 'file-text';
  if (fileType.includes('text')) return 'file-text';
  return 'file';
};

/**
 * Converts base64 to a Blob
 */
export const base64ToBlob = (base64: string, mimeType: string = 'application/octet-stream'): Blob => {
  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  
  return new Blob(byteArrays, { type: mimeType });
};

/**
 * Creates a download link for a blob
 */
export const downloadBlob = (blob: Blob, fileName: string): void => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Validates base64 string
 */
export const isValidBase64 = (str: string): boolean => {
  if (!str) return false;
  try {
    // Try to decode the string
    return btoa(atob(str)) === str;
  } catch (err) {
    return false;
  }
};