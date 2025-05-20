export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'tool' | 'debug';
  timestamp: string;
  isStreaming?: boolean;
  debugInfo?: {
    latency: number;
    jsonResponse: any;
  };
}

export interface Session {
  id: string;
  name: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface AppState {
  currentSessionId: string | null;
  sessions: Session[];
  isDarkMode: boolean;
  isDebugMode: boolean;
  isRecording: boolean;
  inputText: string;
  isLoading: boolean;

  // Actions
  addMessage: (message: Message) => void;
  createSession: (name: string) => void;
  deleteSession: (sessionId: string) => void;
  renameSession: (sessionId: string, newName: string) => void;
  switchSession: (sessionId: string) => void;
  toggleDarkMode: () => void;
  toggleDebugMode: () => void;
  toggleRecording: () => void;
  setInputText: (text: string) => void;
  setIsLoading: (loading: boolean) => void;
}
