import { useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ControlsProps {
  height: number;
  width: number;
  method: 'surface' | 'edge';
  grayscaleThreshold: number;
  blackPercentage: number;
  onHeightChange: (value: number) => void;
  onWidthChange: (value: number) => void;
  onMethodChange: (value: 'surface' | 'edge') => void;
  onGrayscaleThresholdChange: (value: number) => void;
  onBlackPercentageChange: (value: number) => void;
}

export default function Controls({
  height,
  width,
  method,
  grayscaleThreshold,
  blackPercentage,
  onHeightChange,
  onWidthChange,
  onMethodChange,
  onGrayscaleThresholdChange,
  onBlackPercentageChange,
}: ControlsProps) {
  // Internal state for handling number | string values from inputs
  const [internalHeight, setInternalHeight] = useState<number | string>(height);
  const [internalWidth, setInternalWidth] = useState<number | string>(width);
  const [internalGrayscaleThreshold, setInternalGrayscaleThreshold] = useState<number | string>(grayscaleThreshold);
  const [internalBlackPercentage, setInternalBlackPercentage] = useState<number | string>(blackPercentage);

  // Sync internal state with props when they change
  useEffect(() => {
    setInternalHeight(height);
  }, [height]);

  useEffect(() => {
    setInternalWidth(width);
  }, [width]);

  useEffect(() => {
    setInternalGrayscaleThreshold(grayscaleThreshold);
  }, [grayscaleThreshold]);

  useEffect(() => {
    setInternalBlackPercentage(blackPercentage);
  }, [blackPercentage]);

  // Handle internal state changes and convert to numbers for parent callbacks
  const handleHeightChange = (value: number | string) => {
    setInternalHeight(value);
    if (value === '') {
      // Don't call parent callback for empty string, let Input component handle validation
      return;
    }
    const numValue = typeof value === 'number' ? value : parseInt(value as string, 10) || 20;
    onHeightChange(numValue);
  };

  const handleWidthChange = (value: number | string) => {
    setInternalWidth(value);
    if (value === '') {
      // Don't call parent callback for empty string, let Input component handle validation
      return;
    }
    const numValue = typeof value === 'number' ? value : parseInt(value as string, 10) || 15;
    onWidthChange(numValue);
  };

  const handleGrayscaleThresholdChange = (value: number | string) => {
    setInternalGrayscaleThreshold(value);
    if (value === '') {
      // Don't call parent callback for empty string, let Input component handle validation
      return;
    }
    const numValue = typeof value === 'number' ? value : parseInt(value as string, 10) || 190;
    onGrayscaleThresholdChange(numValue);
  };

  const handleBlackPercentageChange = (value: number | string) => {
    setInternalBlackPercentage(value);
    if (value === '') {
      // Don't call parent callback for empty string, let Input component handle validation
      return;
    }
    const numValue = typeof value === 'number' ? value : parseInt(value as string, 10) || 15;
    onBlackPercentageChange(numValue);
  };

  return (
    <div className="space-y-4">
      {/* First row: Method, Fill Threshold, and Black % to Fill */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="method">Method</Label>
          <Select value={method} onValueChange={onMethodChange}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="surface">Surface</SelectItem>
              <SelectItem value="edge">Edge</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="grayscaleThreshold">Grayscale Threshold</Label>
          <Input
            id="grayscaleThreshold"
            type="number"
            numberValidation="int"
            min={0}
            max={255}
            value={internalGrayscaleThreshold}
            onValueChange={handleGrayscaleThresholdChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="blackPercentage" className={method === 'surface' ? 'cursor-not-allowed opacity-50' : ''}>
            Black % to Fill
          </Label>
          <Input
            id="blackPercentage"
            type="number"
            numberValidation="int"
            min={0}
            max={100}
            value={internalBlackPercentage}
            onValueChange={handleBlackPercentageChange}
            disabled={method === 'surface'}
          />
        </div>
      </div>

      {/* Second row: Height and Width */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="height">Height</Label>
          <Input
            id="height"
            type="number"
            numberValidation="int"
            min={5}
            max={30}
            value={internalHeight}
            onValueChange={handleHeightChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="width">Width</Label>
          <Input
            id="width"
            type="number"
            numberValidation="int"
            min={5}
            max={30}
            value={internalWidth}
            onValueChange={handleWidthChange}
          />
        </div>
      </div>
    </div>
  );
}
