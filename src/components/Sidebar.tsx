
import { FC } from 'react';
import LessonItem from './LessonItem';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLessonSelect: (lesson: { id: number; title: string; description: string }) => void;
}

// Example lessons data - in a real app, this would come from your backend
const lessons = [
  { id: 1, title: "Introduction to AI", description: "Learn the basics of Artificial Intelligence" },
  { id: 2, title: "Machine Learning Basics", description: "Understand fundamental concepts of ML" },
  { id: 3, title: "Neural Networks", description: "Deep dive into neural networks" },
];

const completedLessons = [
  { id: 4, title: "Python Basics", progress: 100, description: "Python programming fundamentals" },
  { id: 5, title: "Data Structures", progress: 95, description: "Essential data structures" },
];

const Sidebar: FC<SidebarProps> = ({ isOpen, onClose, onLessonSelect }) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      
      <div className={`fixed top-0 left-0 w-64 h-full bg-background/80 backdrop-blur-lg border-r transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-200 ease-in-out z-50`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b bg-white/5">
            <h2 className="font-semibold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">TO DO</h2>
            <div className="mt-4 space-y-1">
              {lessons.map((lesson) => (
                <LessonItem
                  key={lesson.id}
                  title={lesson.title}
                  onClick={() => onLessonSelect(lesson)}
                />
              ))}
            </div>
          </div>
          
          <div className="p-4 border-t mt-auto bg-white/5">
            <h2 className="font-semibold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">DONE</h2>
            <div className="mt-2 space-y-1">
              {completedLessons.map((lesson) => (
                <LessonItem
                  key={lesson.id}
                  title={lesson.title}
                  completed
                  progress={lesson.progress}
                  onClick={() => onLessonSelect(lesson)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
