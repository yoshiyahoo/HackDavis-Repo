import { FC, useContext, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Send } from 'lucide-react';
import { LessonsContext } from './LessonGlobalState';

const ChatBox: FC = () => {
  const [message, setMessage] = useState("");
  const [text, setText] = useState("");
  //const { setLessons } = useContext(LessonsContext)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch("http://localhost:5000/generate_lesson", {
      method: "POST",
      body: message
    })
      .then(() => {
        setText("thinking...")
      });
    fetch("http://localhost:5000/generate_lesson", { 
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setText(data.responce);
      })
      .catch((_err) => {

      });

    fetch("http://localhost:5000/lessons", { 
      method: "POST",
      body: message
    })
      
    /*
    fetch ("http://localhost:5000/lessons", {
      method: "GET"
    })
      .then((res) => {
        return res.json()
      })
      .then((data) => {
        setLessons(data);
      })
      .catch((_err) => {

      })
    */
    if (message.trim()) {
      // Handle message submission
      setMessage('');
    }
  };

  const markup = { __html: text }

  return (
    <div className="w-full max-w-lg mx-auto bg-gradient-to-br from-[#ffffff] to-[#f8f9fa] rounded-xl shadow-xl overflow-hidden border border-[#e9ecef]/40 backdrop-blur-sm">
      <div className="p-3 border-b bg-gradient-to-r from-purple-500/10 to-pink-500/10">
        <h2 className="text-lg font-semibold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Welcome to EasyLearn Chat!
        </h2>
      </div>
      
      <div dangerouslySetInnerHTML={markup} className="h-[300px] overflow-y-auto p-4 bg-gradient-to-b from-white/50 to-white/30">
        {/* Chat messages would go here */}
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t bg-white/50 backdrop-blur-sm flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type the subject you want to learn about..."
          className="flex-1 bg-white/70 border-[#e9ecef] focus:border-purple-400 focus:ring-purple-400/30"
        />
        <Button 
          type="submit" 
          size="icon"
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatBox;
