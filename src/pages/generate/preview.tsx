import { Loader2 } from 'lucide-react';
import { Marvin, MarvinImage } from 'marvinj-ts';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import {
  binaryImageToBooleanArray,
  canvasToBlobUrl,
  getAspectRatioScaling,
  getImageCropBounds,
  grayImageToBooleanArray,
  loadMarvinImage,
  transparencyToWhite,
} from '@/services/image';

export interface PreviewProps {
  originalImageUrl: string;
  method: 'surface' | 'edge';
  grayscaleThreshold: number;
  fillPercentage: number;
  width: number;
  height: number;
  onLoadingChange?: (isLoading: boolean) => void;
}

const Preview: React.FC<PreviewProps> = ({
  originalImageUrl,
  method,
  grayscaleThreshold,
  fillPercentage,
  width,
  height,
  onLoadingChange,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [processedImageUrl, setProcessedImageUrl] = useState<string>('');
  const [booleanArray, setBooleanArray] = useState<boolean[][] | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const imageToSurface = useCallback(
    async (imageUrl: string): Promise<void> => {
      try {
        const img = new Image();
        img.src = imageUrl;
        await img.decode();

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;

        // Draw original image
        ctx.drawImage(img, 0, 0);

        // Handle transparency: set transparent pixels to white and convert to grayscale
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const data = imageData.data;

        transparencyToWhite(data, true); // convert to grayscale at the same time
        ctx.putImageData(imageData, 0, 0);

        // Get grayscale image data for cropping
        const cropImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const cropData = cropImageData.data;

        // Find crop bounds
        const { top, bottom, left, right } = getImageCropBounds(
          cropData,
          canvas.width,
          canvas.height,
          grayscaleThreshold,
        );

        // If the entire image is white or black, create a blank (white) resized canvas
        if (top > bottom || left > right) {
          // Resize canvas to target dimensions
          canvas.width = width;
          canvas.height = height;

          // Fill with white
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);

          // Convert canvas to blob URL for display
          canvasToBlobUrl(canvas, setProcessedImageUrl);
          return;
        }

        // Crop dimensions
        const cropWidth = right - left + 1;
        const cropHeight = bottom - top + 1;

        // Create a new canvas for the cropped image
        const cropCanvas = document.createElement('canvas');
        cropCanvas.width = cropWidth;
        cropCanvas.height = cropHeight;
        const cropCtx = cropCanvas.getContext('2d');
        if (cropCtx) {
          cropCtx.drawImage(canvas, left, top, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
        }

        // Resize cropped image to width x height using "fill" approach (like object-fit: cover)
        canvas.width = width;
        canvas.height = height;

        // Calculate scaling to cover width x height while maintaining aspect ratio
        const { sx, sy, sWidth, sHeight } = getAspectRatioScaling(cropWidth, cropHeight, width, height);

        // Draw cropped image to fill width x height
        if (cropCtx) {
          ctx.drawImage(cropCanvas, sx, sy, sWidth, sHeight, 0, 0, width, height);
        }

        // Convert canvas to blob URL for display
        canvasToBlobUrl(canvas, setProcessedImageUrl);
      } catch (error) {
        console.error('Error processing image to surface:', error);
      }
    },
    [grayscaleThreshold, width, height],
  );

  const imageToOutline = useCallback(
    async (imageUrl: string): Promise<void> => {
      try {
        const img = new Image();
        img.src = imageUrl;
        await img.decode();

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;

        // Draw original image
        ctx.drawImage(img, 0, 0);

        // Handle transparency: set transparent pixels to white
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const data = imageData.data;

        transparencyToWhite(data, false);
        ctx.putImageData(imageData, 0, 0);

        // Use MarvinImage to create outline
        const marvinImage: MarvinImage = new MarvinImage(img.width, img.height);
        await loadMarvinImage(marvinImage, canvas.toDataURL());

        // Apply MarvinJ outline processing
        const outlineImage: MarvinImage = marvinImage.clone();
        outlineImage.clear(0xff000000);
        Marvin.prewitt(marvinImage, outlineImage, 1);
        Marvin.invertColors(outlineImage, outlineImage);
        Marvin.thresholding(outlineImage, outlineImage, grayscaleThreshold, -1);

        // Draw the processed image back to canvas
        outlineImage.draw(canvas, 0, 0, false);

        // Convert canvas to blob URL for display
        canvasToBlobUrl(canvas, setProcessedImageUrl);
      } catch (error) {
        console.error('Error converting image to outline:', error);
      }
    },
    [grayscaleThreshold],
  );

  const surfaceToArray = useCallback(async (): Promise<void> => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Check if the canvas is already resized (which it should be after imageToSurface)
      if (canvas.width !== width || canvas.height !== height) {
        // This should not happen, but as a fallback, create all-false array
        const allFalseArray: boolean[][] = Array.from({ length: height }, () => Array(width).fill(false));
        setBooleanArray(allFalseArray);
        return;
      }

      // Get resized image data for boolean array
      const finalImageData = ctx.getImageData(0, 0, width, height);
      const finalData = finalImageData.data;

      // Create boolean array
      const booleanArray = grayImageToBooleanArray(finalData, width, height, grayscaleThreshold);
      setBooleanArray(booleanArray);
    } catch (error) {
      console.error('Error converting surface to array:', error);
    }
  }, [grayscaleThreshold, width, height]);

  const outlineToArray = useCallback(async (): Promise<void> => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Get processed image data for cropping and array conversion
      const processedImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const processedData = processedImageData.data;

      // Find crop bounds
      const { top, bottom, left, right } = getImageCropBounds(
        processedData,
        canvas.width,
        canvas.height,
        grayscaleThreshold,
      );

      // If the entire image is white or black, return an all-false array
      if (top > bottom || left > right) {
        const allFalseArray: boolean[][] = Array.from({ length: height }, () => Array(width).fill(false));
        setBooleanArray(allFalseArray);
        return;
      }

      // Crop dimensions
      const cropWidth = right - left + 1;
      const cropHeight = bottom - top + 1;

      // Create a new canvas for the cropped image
      const cropCanvas = document.createElement('canvas');
      cropCanvas.width = cropWidth;
      cropCanvas.height = cropHeight;
      const cropCtx = cropCanvas.getContext('2d');
      if (cropCtx) {
        cropCtx.drawImage(canvas, left, top, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
      }

      const croppedImageData = cropCtx?.getImageData(0, 0, cropWidth, cropHeight);
      if (croppedImageData) {
        const croppedData = croppedImageData.data;
        const booleanArray = binaryImageToBooleanArray(
          croppedData,
          cropWidth,
          cropHeight,
          width,
          height,
          fillPercentage,
        );
        setBooleanArray(booleanArray);
      }
    } catch (error) {
      console.error('Error converting outline to array:', error);
    }
  }, [grayscaleThreshold, fillPercentage, width, height]);

  // Clear processed content when original image changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: Dependencies are intentionally omitted to prevent infinite re-renders when parameters change
  useEffect(() => {
    setProcessedImageUrl('');
    setBooleanArray(null);
  }, [originalImageUrl]);

  // When any input prop changes, trigger loading and processing
  useEffect(() => {
    if (originalImageUrl) {
      setIsLoading(true);
      onLoadingChange?.(true);
      setProcessedImageUrl('');
      setBooleanArray(null);

      const process = async () => {
        if (method === 'surface') {
          await imageToSurface(originalImageUrl);
          await surfaceToArray();
        } else if (method === 'edge') {
          await imageToOutline(originalImageUrl);
          await outlineToArray();
        }
        setIsLoading(false);
        onLoadingChange?.(false);
      };
      process();
    }
  }, [originalImageUrl, method, imageToSurface, imageToOutline, outlineToArray, surfaceToArray, onLoadingChange]);

  // Separate useEffect for cleanup
  // useEffect(() => {
  //   return () => {
  //     if (processedImageUrl) {
  //       URL.revokeObjectURL(processedImageUrl);
  //     }
  //   };
  // }, [processedImageUrl]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Original Image */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-center">Original</h3>
          <div className="aspect-square rounded-lg border overflow-hidden bg-muted">
            {originalImageUrl && (
              <img src={originalImageUrl} alt="Original uploaded content" className="w-full h-full object-cover" />
            )}
          </div>
        </div>

        {/* Processed Image */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-center">Processed</h3>
          <div className="aspect-square rounded-lg border overflow-hidden bg-muted">
            {processedImageUrl ? (
              <img
                src={processedImageUrl}
                alt={`Processed ${method} content`}
                className="w-full h-full object-cover"
                style={{
                  imageRendering: method === 'surface' ? 'pixelated' : 'auto',
                }}
              />
            ) : isLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <Skeleton className="w-2/3 h-2/3 flex items-center justify-center">
                  <Loader2 className="animate-spin w-16 h-16" />
                </Skeleton>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Boolean Array Preview */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-center">Nonogram</h3>
          <div className="aspect-square border overflow-hidden bg-muted">
            {booleanArray ? (
              <div
                className="grid w-full h-full"
                style={{
                  gridTemplateColumns: `repeat(${width}, 1fr)`,
                  gridTemplateRows: `repeat(${height}, 1fr)`,
                }}
              >
                {booleanArray.flat().map((value: boolean, index: number) => {
                  const row = Math.floor(index / width);
                  const col = index % width;
                  const isLastRow = row === height - 1;
                  const isLastCol = col === width - 1;

                  return (
                    <div
                      key={index}
                      className={`border-gray-300 ${!isLastCol ? 'border-r' : ''} ${!isLastRow ? 'border-b' : ''}`}
                      style={{
                        backgroundColor: value ? '#000000' : '#ffffff',
                      }}
                    />
                  );
                })}
              </div>
            ) : isLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <Skeleton className="w-2/3 h-2/3 flex items-center justify-center">
                  <Loader2 className="animate-spin w-16 h-16" />
                </Skeleton>
              </div>
            ) : (
              <div
                className="grid w-full h-full"
                style={{
                  gridTemplateColumns: `repeat(${width}, 1fr)`,
                  gridTemplateRows: `repeat(${height}, 1fr)`,
                }}
              >
                {Array.from({ length: height * width }, (_, index) => {
                  const row = Math.floor(index / width);
                  const col = index % width;
                  const isLastRow = row === height - 1;
                  const isLastCol = col === width - 1;

                  return (
                    <div
                      key={index}
                      className={`border-gray-300 ${!isLastCol ? 'border-r' : ''} ${!isLastRow ? 'border-b' : ''}`}
                      style={{
                        backgroundColor: '#ffffff',
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </>
  );
};

export default Preview;
