/**
 * File Helper Utilities
 * Provides functions for file type detection and icon mapping
 */

export type FileType = 'image' | 'pdf' | 'doc' | 'excel' | 'text' | 'unknown';

/**
 * Determines the file type based on URL or filename
 * @param url - The file URL or filename
 * @returns The detected file type
 */
export function getFileType(url: string): FileType {
  if (!url) return 'unknown';

  const lowerUrl = url.toLowerCase();

  // Check for images
  if (/\.(jpg|jpeg|png|gif|bmp|webp|svg|ico)(\?|$)/i.test(lowerUrl) || lowerUrl.includes('image')) {
    return 'image';
  }

  // Check for PDFs
  if (/\.pdf(\?|$)/i.test(lowerUrl) || lowerUrl.includes('pdf')) {
    return 'pdf';
  }

  // Check for Word documents
  if (/\.(doc|docx)(\?|$)/i.test(lowerUrl)) {
    return 'doc';
  }

  // Check for Excel spreadsheets
  if (/\.(xls|xlsx|csv)(\?|$)/i.test(lowerUrl)) {
    return 'excel';
  }

  // Check for text files
  if (/\.(txt|log|md)(\?|$)/i.test(lowerUrl)) {
    return 'text';
  }

  return 'unknown';
}

/**
 * Checks if a URL points to an image file
 * @param url - The file URL
 * @returns True if the file is an image
 */
export function isImageFile(url?: string): boolean {
  if (!url) return false;
  return getFileType(url) === 'image';
}

/**
 * Returns an appropriate emoji icon for the file type
 * @param url - The file URL
 * @returns An emoji representing the file type
 */
export function getFileIcon(url: string): string {
  const fileType = getFileType(url);

  switch (fileType) {
    case 'image':
      return '🖼️';
    case 'pdf':
      return '📄';
    case 'doc':
      return '📝';
    case 'excel':
      return '📊';
    case 'text':
      return '📃';
    default:
      return '📎';
  }
}

/**
 * Returns a human-readable file type label
 * @param url - The file URL
 * @returns A label for the file type
 */
export function getFileTypeLabel(url: string): string {
  const fileType = getFileType(url);

  switch (fileType) {
    case 'image':
      return 'Image';
    case 'pdf':
      return 'PDF Document';
    case 'doc':
      return 'Word Document';
    case 'excel':
      return 'Spreadsheet';
    case 'text':
      return 'Text File';
    default:
      return 'File';
  }
}

/**
 * Extracts the filename from a URL
 * @param url - The file URL
 * @returns The filename without query parameters
 */
export function getFileName(url?: string): string {
  if (!url) return 'Unknown file';

  try {
    // Handle Firebase Storage URLs which have encoded filenames
    const urlParts = url.split('/');
    let fileName = urlParts[urlParts.length - 1];

    // Remove query parameters
    fileName = fileName.split('?')[0];

    // Decode URL encoding
    fileName = decodeURIComponent(fileName);

    return fileName || 'Download file';
  } catch {
    return 'Download file';
  }
}
