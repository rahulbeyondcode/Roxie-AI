import { Message } from '../../types';

interface ChatMessageProps {
  message: Message;
}

function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';
  const isTool = message.role === 'tool';
  const isDebug = message.role === 'debug';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          isUser
            ? 'bg-blue-500 text-white'
            : isAssistant
            ? 'bg-gray-100 dark:bg-gray-700'
            : isTool
            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
            : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
        }`}
      >
        {message.isStreaming ? (
          <div className="animate-pulse">
            <div className="h-2 bg-gray-200 rounded w-1/4 mb-2" />
            <div className="h-2 bg-gray-200 rounded w-1/2 mb-2" />
            <div className="h-2 bg-gray-200 rounded w-3/4" />
          </div>
        ) : (
          <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: message.content }} />
        )}
      </div>
    </div>
  );
}

export default ChatMessage;
