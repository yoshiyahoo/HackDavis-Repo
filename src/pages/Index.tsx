
import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import ChatBox from '@/components/ChatBox';
import Sidebar from '@/components/Sidebar';
import AudioToggle from '@/components/AudioToggle';

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 border-b bg-background z-10">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <Logo />
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 pt-24 pb-20">
        <ChatBox />
      </main>

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Audio toggle */}
      <AudioToggle />
    </div>
  );
};

export default Index;
