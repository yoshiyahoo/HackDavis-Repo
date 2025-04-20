import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { PlayCircle } from 'lucide-react';
import ChatBox from './ChatBox';
import Quiz from '../Quiz'; // Import the Quiz component

interface LessonPopupProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: {
    title: string;
    description: string;
  };
  onPlayAudio: () => void;
}

const LessonPopup: FC<Omit<LessonPopupProps, 'onTakeQuiz'>> = ({
  isOpen,
  onClose,
  lesson,
  onPlayAudio,
}) => {
  const navigate = useNavigate();
  const [showQuiz, setShowQuiz] = useState(false);

  const handleTakeQuiz = () => {
    // Close the lesson popup and show the quiz popup
    onClose();
    setShowQuiz(true);
  };

  const handleCloseQuiz = () => {
    setShowQuiz(false);
  };

  return (
    <>
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
                onClick={handleTakeQuiz}
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

      {/* Quiz Dialog */}
      <Dialog open={showQuiz} onOpenChange={handleCloseQuiz}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <Quiz onClose={handleCloseQuiz} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LessonPopup;