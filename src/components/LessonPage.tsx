
import { FC } from 'react';
import { ArrowLeft, BookOpenText } from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

interface LessonPageProps {
  lesson: {
    id: number;
    title: string;
    description: string;
  };
  onBack: () => void;
}

const LessonPage: FC<LessonPageProps> = ({ lesson, onBack }) => {
  return (
    <div className="h-full w-full">
      {/* Header with back button */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="hover:bg-white/10"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {lesson.title}
          </h1>
        </div>
      </div>

      {/* Main content area */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Assistant message - lesson introduction */}
          <div className="flex gap-4 p-6 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <BookOpenText className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex-grow space-y-4">
              <p className="text-lg leading-relaxed">
                {lesson.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                  onClick={() => console.log('Playing audio for:', lesson.title)}
                >
                  Play Audio Lesson
                </Button>
                <Button 
                  variant="outline"
                  className="border-white/20 hover:bg-white/10"
                  onClick={() => console.log('Starting quiz for:', lesson.title)}
                >
                  Take Quiz
                </Button>
              </div>
            </div>
          </div>

          <Separator className="opacity-10" />

          {/* Small chat box at the bottom */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t">
            <div className="max-w-3xl mx-auto">
              <input
                type="text"
                placeholder="Ask a question about this lesson..."
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
