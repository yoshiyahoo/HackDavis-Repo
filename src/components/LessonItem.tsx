
import { FC } from 'react';
import { Button } from './ui/button';

interface LessonItemProps {
  title: string;
  completed?: boolean;
  progress?: number;
  onClick: () => void;
}

const LessonItem: FC<LessonItemProps> = ({ title, completed, progress, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-3 py-2 hover:bg-accent rounded-md transition-colors"
    >
      <span className={`${completed ? 'line-through text-muted-foreground' : ''}`}>
        {title}
      </span>
      {completed && progress !== undefined && (
        <span className="ml-2 text-sm text-muted-foreground">{progress}%</span>
      )}
    </button>
  );
};

export default LessonItem;
