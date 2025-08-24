import { Dices } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { generateRandomString } from '@/lib/utils';

const pad2 = (n: number | string) => n.toString().padStart(2, '0');

export default function RandomSection() {
  const navigate = useNavigate();

  const [height, setHeight] = useState<number | string>(20);
  const [width, setWidth] = useState<number | string>(20);
  const [fillPercent, setFillPercent] = useState<number | string>(70);

  const handleHeightChange = (value: number | string) => {
    setHeight(value);
  };

  const handleWidthChange = (value: number | string) => {
    setWidth(value);
  };

  const handleFillPercentChange = (value: number | string) => {
    setFillPercent(value);
  };

  // Generate a 12-char random string with time
  const handleStartRandom = () => {
    const h = pad2(height);
    const w = pad2(width);
    const f = pad2(fillPercent);
    const randomStr = generateRandomString(12);
    navigate(`/game/p/${h}${w}${f}${randomStr}`);
  };

  return (
    <div className="space-y-2 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="height">Height</Label>
          <Input
            id="height"
            type="number"
            numberValidation="int"
            min={5}
            max={30}
            value={height}
            onValueChange={handleHeightChange}
            className="w-full"
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
            value={width}
            onValueChange={handleWidthChange}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fillPercent">Fill %</Label>
          <Input
            id="fillPercent"
            type="number"
            numberValidation="int"
            min={10}
            max={90}
            value={fillPercent}
            onValueChange={handleFillPercentChange}
            className="w-full"
          />
        </div>
      </div>
      <div className="flex justify-center">
        <Button className="mt-4" type="button" onClick={handleStartRandom}>
          <Dices className="mr-2 h-4 w-4" />
          Start with Random
        </Button>
      </div>
    </div>
  );
}
