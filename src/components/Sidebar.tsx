
import { FC } from 'react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 w-64 h-full bg-background border-r transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-200 ease-in-out z-50`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-lg">TO DO</h2>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {/* Todo items would go here */}
          </div>
          <div className="p-4 border-t">
            <h2 className="font-semibold text-lg">DONE</h2>
            <div className="mt-2">
              {/* Done items would go here */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
