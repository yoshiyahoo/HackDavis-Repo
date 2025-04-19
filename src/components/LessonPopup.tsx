
import { FC } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { PlayCircle } from 'lucide-react';
import ChatBox from './ChatBox';

interface LessonPopupProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: {
    title: string;
    description: string;
  };
  onPlayAudio: () => void;
  onTakeQuiz: () => void;
}

const LessonPopup: FC<LessonPopupProps> = ({
  isOpen,
  onClose,
  lesson,
  onPlayAudio,
  onTakeQuiz,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{lesson.title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-6">
          <p className="text-muted-foreground">{lesson.description}</p>
          
          <div className="flex flex-col gap-4 items-center">
            <Button
              onClick={onPlayAudio}
              className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <PlayCircle className="mr-2" />
              Play Lesson
            </Button>
            
            <Button
              onClick={onTakeQuiz}
              variant="outline"
              className="w-full"
            >
              Take Quiz
            </Button>
          </div>
          
          <div className="h-[150px] overflow-hidden rounded-lg border">
            <ChatBox />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LessonPopup;
