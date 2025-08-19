import type { MarvinImage } from 'marvinj-ts';

/**
 * Loads a MarvinImage with promise wrapper
 * @param marvinImage - MarvinImage instance to load
 * @param url - Image URL to load
 * @returns Promise that resolves when image is loaded
 */
const loadMarvinImage = (marvinImage: MarvinImage, url: string): Promise<void> => {
  return new Promise((resolve, _reject) => {
    marvinImage.load(url, () => resolve());
    // Note: MarvinJ's load method doesn't provide an error callback.
    // If it fails, it may need additional error handling based on your setup.
  });
};

/**
 * Converts a canvas element to a Blob URL and sets it using a callback.
 *
 * This function takes an HTMLCanvasElement, converts its contents to a Blob,
 * creates an object URL from the Blob, and passes the URL to the provided setter function.
 * Useful for displaying or downloading the canvas image as a file or preview.
 *
 * @param canvas - The HTMLCanvasElement to convert.
 * @param setImageUrl - A callback function that receives the generated Blob URL.
 * @returns A Promise that resolves when the Blob URL is set.
 */
async function canvasToBlobUrl(canvas: HTMLCanvasElement, setImageUrl: (url: string) => void): Promise<void> {
  try {
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob));
    });

    if (blob) {
      const processedUrl = URL.createObjectURL(blob);
      setImageUrl(processedUrl);
    }
  } catch (error) {
    console.error('Error converting canvas to blob URL:', error);
  }
}

/**
 * Checks if a row in image data contains only white or black pixels
 * @param imageData - RGBA image data array
 * @param y - Row index to check
 * @param width - Image width in pixels
 * @param threshold - Grayscale threshold value (0-255)
 * @returns true if row is all white or all black, false if mixed
 */
const isRowWhiteOrBlack = (imageData: Uint8ClampedArray, y: number, width: number, threshold: number): boolean => {
  let allWhite = true;
  let allBlack = true;
  for (let x = 0; x < width; x++) {
    const index = (y * width + x) * 4;
    const gray = imageData[index]; // Grayscale, so R=G=B
    if (gray < threshold) allWhite = false; // Not all white
    if (gray >= threshold) allBlack = false; // Not all black
    if (!allWhite && !allBlack) return false; // Mixed pixels, keep row
  }
  return allWhite || allBlack; // Row is all white or all black
};

/**
 * Checks if a column in image data contains only white or black pixels
 * @param imageData - RGBA image data array
 * @param x - Column index to check
 * @param width - Image width in pixels
 * @param height - Image height in pixels
 * @param threshold - Grayscale threshold value (0-255)
 * @returns true if column is all white or all black, false if mixed
 */
const isColumnWhiteOrBlack = (
  imageData: Uint8ClampedArray,
  x: number,
  width: number,
  height: number,
  threshold: number,
): boolean => {
  let allWhite = true;
  let allBlack = true;
  for (let y = 0; y < height; y++) {
    const index = (y * width + x) * 4;
    const gray = imageData[index];
    if (gray < threshold) allWhite = false;
    if (gray >= threshold) allBlack = false;
    if (!allWhite && !allBlack) return false;
  }
  return allWhite || allBlack;
};

/**
 * Finds crop bounds by detecting rows/columns that are all white or black
 * @param imageData - RGBA image data array
 * @param width - Image width in pixels
 * @param height - Image height in pixels
 * @param threshold - Grayscale threshold value (0-255)
 * @returns Crop bounds object with top, bottom, left, right coordinates
 */
const getImageCropBounds = (
  imageData: Uint8ClampedArray,
  width: number,
  height: number,
  threshold: number,
): { top: number; bottom: number; left: number; right: number } => {
  // Find crop bounds
  let top = 0;
  while (top < height && isRowWhiteOrBlack(imageData, top, width, threshold)) top++;
  let bottom = height - 1;
  while (bottom > top && isRowWhiteOrBlack(imageData, bottom, width, threshold)) bottom--;
  let left = 0;
  while (left < width && isColumnWhiteOrBlack(imageData, left, width, height, threshold)) left++;
  let right = width - 1;
  while (right > left && isColumnWhiteOrBlack(imageData, right, width, height, threshold)) right--;

  return { top, bottom, left, right };
};

/**
 * Calculates scaling parameters to cover target dimensions while maintaining aspect ratio
 * @param cropWidth - Width of the cropped image
 * @param cropHeight - Height of the cropped image
 * @param targetWidth - Target width to scale to
 * @param targetHeight - Target height to scale to
 * @returns Scaling parameters object
 */
const getAspectRatioScaling = (
  cropWidth: number,
  cropHeight: number,
  targetWidth: number,
  targetHeight: number,
): { sx: number; sy: number; sWidth: number; sHeight: number } => {
  const aspectRatio = cropWidth / cropHeight;
  const targetAspectRatio = targetWidth / targetHeight;

  let sx: number, sy: number, sWidth: number, sHeight: number;

  if (aspectRatio > targetAspectRatio) {
    // Image is wider: scale by height, crop width
    sHeight = cropHeight;
    sWidth = cropHeight * targetAspectRatio;
    sx = (cropWidth - sWidth) / 2; // Center horizontally
    sy = 0;
  } else {
    // Image is taller: scale by width, crop height
    sWidth = cropWidth;
    sHeight = cropWidth / targetAspectRatio;
    sx = 0;
    sy = (cropHeight - sHeight) / 2; // Center vertically
  }

  return { sx, sy, sWidth, sHeight };
};

/**
 * Converts RGBA image data to grayscale and sets transparent pixels to white
 * @param imageData - RGBA image data array to process
 * @param convertToGrayscale - Whether to convert to grayscale (true) or just handle transparency (false)
 */
const transparencyToWhite = (imageData: Uint8ClampedArray, convertToGrayscale: boolean = true): void => {
  for (let i = 0; i < imageData.length; i += 4) {
    const alpha = imageData[i + 3];

    if (alpha < 255) {
      // Transparent pixels become white
      imageData[i] = imageData[i + 1] = imageData[i + 2] = 255;
      imageData[i + 3] = 255; // Ensure full opacity
    } else if (convertToGrayscale) {
      // Convert to grayscale using luminance formula
      const gray = 0.299 * imageData[i] + 0.587 * imageData[i + 1] + 0.114 * imageData[i + 2];
      imageData[i] = imageData[i + 1] = imageData[i + 2] = gray;
    }
  }
};

/**
 * Converts grayscale image data directly to boolean array
 * @param imageData - RGBA image data array (should be grayscale)
 * @param width - Image width in pixels
 * @param height - Image height in pixels
 * @param threshold - Grayscale threshold value (0-255)
 * @returns 2D boolean array where true represents black pixels
 */
const grayImageToBooleanArray = (
  imageData: Uint8ClampedArray,
  width: number,
  height: number,
  threshold: number,
): boolean[][] => {
  const booleanArray: boolean[][] = [];
  for (let y = 0; y < height; y++) {
    const row: boolean[] = [];
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      const gray = imageData[index]; // Grayscale, so R=G=B
      row.push(gray < threshold); // true for black, false for white
    }
    booleanArray.push(row);
  }
  return booleanArray;
};

/**
 * Converts binary image data to a boolean array by cropping, scaling, and thresholding.
 *
 * This function takes RGBA image data and converts it to a 2D boolean array where each
 * cell represents whether a region of the image contains enough black pixels to meet
 * the specified threshold ratio.
 *
 * The function performs the following operations:
 * 1. Crops the input image to match the target aspect ratio (center crop)
 * 2. Divides the cropped image into m×n grid cells
 * 3. For each cell, counts black pixels (R=0) and determines if the percentage
 *    of black pixels meets or exceeds the specified ratio threshold
 *
 * @param rgbaData - Input image data as RGBA values (Uint8ClampedArray)
 * @param p - Width of the input image in pixels
 * @param q - Height of the input image in pixels
 * @param m - Width of the output boolean array (number of columns)
 * @param n - Height of the output boolean array (number of rows)
 * @param ratio - Threshold percentage (0-100) of black pixels needed for a cell to be true
 * @returns 2D boolean array where true indicates sufficient black pixel density
 * @throws Error if rgbaData length doesn't match expected p×q×4 size
 */
const binaryImageToBooleanArray = (
  rgbaData: Uint8ClampedArray,
  p: number, // image width
  q: number, // image height
  m: number, // output width
  n: number, // output height
  ratio: number, // 0..100, % of black pixels needed
): boolean[][] => {
  if (rgbaData.length !== p * q * 4) {
    throw new Error('Invalid image data length');
  }

  const targetRatio = m / n;
  const inputRatio = p / q;

  let cropWidth: number,
    cropHeight: number,
    offsetX = 0,
    offsetY = 0;

  if (inputRatio > targetRatio) {
    // Wider → crop width
    cropHeight = q;
    cropWidth = Math.round(q * targetRatio);
    offsetX = Math.floor((p - cropWidth) / 2);
  } else {
    // Taller → crop height
    cropWidth = p;
    cropHeight = Math.round(p / targetRatio);
    offsetY = Math.floor((q - cropHeight) / 2);
  }

  const output: boolean[][] = Array.from({ length: n }, () => Array(m).fill(false));

  for (let oy = 0; oy < n; oy++) {
    for (let ox = 0; ox < m; ox++) {
      const startX = Math.floor((ox * cropWidth) / m) + offsetX;
      const endX = Math.floor(((ox + 1) * cropWidth) / m) + offsetX;
      const startY = Math.floor((oy * cropHeight) / n) + offsetY;
      const endY = Math.floor(((oy + 1) * cropHeight) / n) + offsetY;

      let blackCount = 0;
      let totalCount = 0;

      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          const gray = rgbaData[(y * p + x) * 4]; // R channel
          if (gray === 0) {
            blackCount++;
          }
          totalCount++;
        }
      }

      output[oy][ox] = totalCount > 0 && (blackCount / totalCount) * 100 >= ratio;
    }
  }

  return output;
};

export {
  loadMarvinImage,
  canvasToBlobUrl,
  isRowWhiteOrBlack,
  isColumnWhiteOrBlack,
  getImageCropBounds,
  getAspectRatioScaling,
  transparencyToWhite,
  grayImageToBooleanArray,
  binaryImageToBooleanArray,
};
