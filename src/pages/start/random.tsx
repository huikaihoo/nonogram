import { Dices } from 'lucide-react';
import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { generateRandomString, padZero } from '@/lib/utils';

export interface RandomProps {
  height: number | string;
  width: number | string;
  fillPercent: number | string;
}

const defaultRandomProps: RandomProps = {
  height: 20,
  width: 20,
  fillPercent: 70,
};

export default function RandomSection() {
  const navigate = useNavigate();

  const [randomProps, setRandomProps] = useLocalStorage<RandomProps>('random-props', defaultRandomProps);

  const handleHeightChange = (value: number | string) => {
    setRandomProps((prev) => ({ ...prev, height: value }));
  };

  const handleWidthChange = (value: number | string) => {
    setRandomProps((prev) => ({ ...prev, width: value }));
  };

  const handleFillPercentChange = (value: number | string) => {
    setRandomProps((prev) => ({ ...prev, fillPercent: value }));
  };

  // Generate a 12-char random string with time
  const handleStartRandom = () => {
    const h = padZero(randomProps.height, 2);
    const w = padZero(randomProps.width, 2);
    const f = padZero(randomProps.fillPercent, 2);
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
            value={randomProps.height}
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
            value={randomProps.width}
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
            value={randomProps.fillPercent}
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
