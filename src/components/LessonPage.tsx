
import { FC } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';

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
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-500/5 to-pink-500/5">
      <div className="container mx-auto px-4 pt-24 pb-20">
        <div className="w-full max-w-4xl mx-auto">
          {/* Header with back button */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {lesson.title}
            </h1>
          </div>

          {/* Main content */}
          <div className="space-y-8">
            {/* Description card */}
            <div className="p-6 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
              <p className="text-lg leading-relaxed text-foreground/90">
                {lesson.description}
              </p>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl h-16 text-lg"
                onClick={() => console.log('Playing audio for:', lesson.title)}
              >
                Play Audio Lesson
              </Button>
              <Button 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl h-16 text-lg"
                onClick={() => console.log('Starting quiz for:', lesson.title)}
              >
                Take Quiz
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
