import { Puzzle } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';

export default function PuzzleSection() {
  const navigate = useNavigate();
  const [otpValue, setOtpValue] = useState('');

  const handleOtpChange = (value: string) => {
    setOtpValue(value.toUpperCase());
  };

  const isOtpFilled = otpValue.length === 18;

  const handleNavigate = () => {
    if (isOtpFilled) {
      navigate(`/game/p/${otpValue}`);
    }
  };

  return (
    <div className="space-y-2 w-full">
      <div className="mt-6 flex flex-col gap-2 items-center">
        <div className="relative w-fit">
          <Label htmlFor="otp" className="absolute -top-6 left-0 pl-1">
            Puzzle Code
          </Label>
          <InputOTP
            id="otp"
            inputMode="text"
            maxLength={18}
            pattern="^([0-9]{0,6}|[0-9]{6}[a-zA-Z0-9]*)$"
            autoComplete="off"
            value={otpValue}
            onChange={handleOtpChange}
            pasteTransformer={(pasted) => pasted.replaceAll('-', '').toUpperCase()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && isOtpFilled) {
                handleNavigate();
              }
            }}
          >
            {[6, 12].map((count, groupIdx) => {
              const group = (
                <InputOTPGroup key={groupIdx}>
                  {Array.from({ length: count }).map((_, slotIdx) => {
                    const index = groupIdx === 0 ? slotIdx : 6 + slotIdx;
                    return <InputOTPSlot index={index} key={slotIdx} className="w-7 h-9 text-base px-1" />;
                  })}
                </InputOTPGroup>
              );
              const separator = groupIdx < 1 ? <InputOTPSeparator key={`sep-${groupIdx}`} /> : null;
              return [group, separator];
            })}
          </InputOTP>
        </div>
      </div>
      <div className="flex justify-center">
        <Button className="mt-4" type="button" disabled={!isOtpFilled} onClick={handleNavigate}>
          <Puzzle className="mr-2 h-4 w-4" />
          Start with Puzzle Code
        </Button>
      </div>
    </div>
  );
}
