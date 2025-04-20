import { FC, useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Send } from 'lucide-react';
import Quiz from '../Quiz';
import { QuizQuestion } from '../utils/quizLoader';

const ChatBox: FC = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lessonHtml, setLessonHtml] = useState("");
  const [quizData, setQuizData] = useState<QuizQuestion[] | null>(null);
  const [quizTitle, setQuizTitle] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError(null);
    setLessonHtml("Generating lesson...");
    
    try {
      // Step 1: Send message to generate lesson
      await fetch("http://127.0.0.1:5000/generate_lesson", {
        method: "POST",
        body: message
      });
      
      // Step 2: Get the generated lesson
      const lessonResponse = await fetch("http://127.0.0.1:5000/generate_lesson", { 
        method: "GET",
      });
      
      // Handle HTML response - don't try to parse as JSON
      const htmlContent = await lessonResponse.text();
      setLessonHtml(htmlContent);
      
      // Step 3: Generate quiz from the lesson
      const quizResponse = await fetch('http://localhost:5001/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: message }),
      });

      if (!quizResponse.ok) {
        const errorData = await quizResponse.json();
        throw new Error(errorData.error || 'Failed to generate quiz');
      }

      const quizData = await quizResponse.json() as QuizQuestion[];
      
      // Extract title from the first question or use default
      const title = quizData[0]?.question?.split(' ').slice(0, 3).join(' ') || "Generated Quiz";
      setQuizTitle(title);
      setQuizData(quizData);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'An error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseQuiz = () => {
    setQuizData(null);
  };

  const markup = { __html: lessonHtml };

  return (
    <div className="w-full max-w-lg mx-auto bg-gradient-to-br from-[#ffffff] to-[#f8f9fa] rounded-xl shadow-xl overflow-hidden border border-[#e9ecef]/40 backdrop-blur-sm">
      {quizData ? (
        <Quiz onClose={handleCloseQuiz} title={quizTitle} />
      ) : (
        <>
          <div className="p-3 border-b bg-gradient-to-r from-purple-500/10 to-pink-500/10">
            <h2 className="text-lg font-semibold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Welcome to EasyLearn Chat!
            </h2>
          </div>
          
          <div dangerouslySetInnerHTML={markup} className="h-[300px] overflow-y-auto p-4 bg-gradient-to-b from-white/50 to-white/30">
            {/* Lesson content is rendered via dangerouslySetInnerHTML */}
          </div>

          <form onSubmit={handleSubmit} className="p-3 border-t bg-white/50 backdrop-blur-sm flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type the subject you want to learn about..."
              className="flex-1 bg-white/70 border-[#e9ecef] focus:border-purple-400 focus:ring-purple-400/30"
              disabled={loading}
            />
            <Button 
              type="submit" 
              size="icon"
              disabled={loading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
          
          {error && (
            <div className="p-3 bg-red-100 text-red-800 text-sm">
              {error}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ChatBox;
