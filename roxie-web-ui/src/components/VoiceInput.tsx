import { useRef, useCallback } from 'react';
import { useStore } from '../store';

// Declare Web Speech API types
interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResult[][];
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

function VoiceInput() {
  const store = useStore();
  const inputText = store.inputText;
  const setInputText = store.setInputText;
  const isRecording = store.isRecording;
  const toggleRecording = store.toggleRecording;
  const recognition = useRef<SpeechRecognition | null>(null);

  const startRecording = useCallback(() => {
    if (!('SpeechRecognition' in window && 'webkitSpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    const recognitionInstance = new (window.SpeechRecognition || (window as any).webkitSpeechRecognition)();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'en-US';

    recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('');
      setInputText(transcript);
    };

    recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
    };

    recognitionInstance.onend = () => {
      toggleRecording();
    };

    recognitionInstance.start();
    recognition.current = recognitionInstance;
  }, [setInputText, toggleRecording]);

  const stopRecording = useCallback(() => {
    if (recognition.current) {
      recognition.current.stop();
    }
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputText.trim()) {
        store.addMessage({
          id: crypto.randomUUID(),
          content: inputText,
          role: 'user',
          timestamp: new Date().toISOString(),
        });
        setInputText('');
      }
    }
  }, [inputText, setInputText]);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => (isRecording ? stopRecording() : startRecording())}
        className={`p-2 rounded-full transition-all duration-200 ${
          isRecording
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-gray-200 hover:bg-gray-300'
        }`}
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isRecording ? "M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" : "M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7-1a1 1 0 11-2 0 1 1 0 012 0zm7 1a1 1 0 11-2 0 1 1 0 012 0z"}
          />
        </svg>
      </button>
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message here... (Shift+Enter for new line)"
        className="flex-1 min-h-[48px] p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y"
      />
    </div>
  );
}

export default VoiceInput;
