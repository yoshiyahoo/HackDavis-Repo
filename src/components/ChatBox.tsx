
import { FC, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Send } from 'lucide-react';

const ChatBox: FC = () => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // Handle message submission
      setMessage('');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-card rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold text-center">Welcome to EasyLearn Chat!</h2>
      </div>
      
      <div className="h-[400px] overflow-y-auto p-4">
        {/* Chat messages would go here */}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button type="submit" size="icon">
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
};

export default ChatBox;
