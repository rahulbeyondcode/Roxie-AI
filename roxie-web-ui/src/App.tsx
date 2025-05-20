import { useEffect, useRef, useState } from "react";
import ChatInterface from "./components/ChatInterface";
import SessionManager from "./components/SessionManager";
import Settings from "./components/Settings";
import VoiceInput from "./components/VoiceInput";
import { useStore } from "./store";

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const store = useStore();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize first session if none exists
    const sessions = store.sessions;
    if (sessions.length === 0) {
      store.createSession("New Session");
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [store.sessions]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Initializing...
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}
    >
      <div className="max-w-4xl mx-auto p-4">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            <span className="text-primary-500">Roxie</span> AI Assistant
          </h1>
          <Settings />
        </header>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 h-[calc(100vh-12rem)] overflow-hidden">
              <div className="h-full flex flex-col">
                <div
                  className="flex-1 overflow-y-auto pr-4"
                  ref={chatContainerRef}
                >
                  <ChatInterface />
                </div>
                <div className="mt-4">
                  <VoiceInput />
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/4">
            <SessionManager />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
