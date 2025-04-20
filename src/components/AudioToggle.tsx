import { FC, useState } from 'react';
import { Volume, VolumeX } from 'lucide-react';
import { Button } from './ui/button';

const AudioToggle: FC = () => {
  const [isEnabled, setIsEnabled] = useState(true);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setIsEnabled(!isEnabled)}
      className="fixed bottom-4 right-4"
    >
      {isEnabled ? <Volume className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
    </Button>
  );
};

export default AudioToggle;
