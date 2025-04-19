
import { FC } from 'react';

const Logo: FC = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
        <span className="text-primary-foreground font-bold">E</span>
      </div>
      <span className="text-xl font-semibold">EasyLearn</span>
    </div>
  );
};

export default Logo;
