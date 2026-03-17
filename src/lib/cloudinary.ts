/**
 * Cloudinary Utility for Assets
 * Provides optimized URLs for images and videos
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

export const getCloudinaryUrl = (path: string, options: { 
  width?: number; 
  height?: number; 
  crop?: string;
  quality?: string;
  format?: string;
  resourceType?: 'image' | 'video' | 'raw';
} = {}) => {
  if (!path) return '';
  
  // If it's already a full URL, return it
  if (path.startsWith('http')) return path;

  // Resource type defaults to image
  const resourceType = options.resourceType || 'image';
  
  // Base Cloudinary URL
  let baseUrl = `https://res.cloudinary.com/${CLOUD_NAME}/${resourceType}/upload`;

  // Transformation parameters
  const transforms: string[] = [];
  
  // Auto optimization
  transforms.push('f_auto'); // Auto format
  transforms.push('q_auto'); // Auto quality

  if (options.width) transforms.push(`w_${options.width}`);
  if (options.height) transforms.push(`h_${options.height}`);
  if (options.crop) transforms.push(`c_${options.crop}`);
  
  // Custom quality/format if provided
  if (options.quality) transforms.push(`q_${options.quality}`);
  if (options.format) transforms.push(`f_${options.format}`);

  const transformStr = transforms.length > 0 ? transforms.join(',') : '';
  
  // Ensure the path doesn't start with a slash if we're adding one
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;

  return transformStr 
    ? `${baseUrl}/${transformStr}/${cleanPath}`
    : `${baseUrl}/${cleanPath}`;
};

/**
 * Helper for video assets
 */
export const getVideoUrl = (path: string) => {
  return getCloudinaryUrl(path, { resourceType: 'video' });
};

/**
 * Helper for optimized images
 */
export const getImageUrl = (path: string, width?: number) => {
  return getCloudinaryUrl(path, { resourceType: 'image', width });
};

/**
 * Securely delete an image via local backend proxy
 */
export const deleteCloudinaryImage = async (publicId: string): Promise<boolean> => {
  if (!publicId || publicId.startsWith('http')) return false;
  
  try {
    const res = await fetch('http://localhost:3001/api/delete-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ public_id: publicId })
    });
    
    const data = await res.json();
    return data.success === true;
  } catch (err) {
    console.error('Failed to delete image:', err);
    return false;
  }
};
