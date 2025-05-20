import { useState } from "react";
import { useStore } from "../store";

function SessionManager() {
  const sessions = useStore((state) => state.sessions);
  const currentSessionId = useStore((state) => state.currentSessionId);
  const switchSession = useStore((state) => state.switchSession);
  const deleteSession = useStore((state) => state.deleteSession);
  const renameSession = useStore((state) => state.renameSession);
  const createSession = useStore((state) => state.createSession);

  const [newSessionName, setNewSessionName] = useState("");
  const [editingSession, setEditingSession] = useState<string | null>(null);

  const handleCreateSession = () => {
    if (newSessionName.trim()) {
      createSession(newSessionName.trim());
      setNewSessionName("");
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      deleteSession(sessionId);
    }
  };

  const handleRenameSession = (sessionId: string, newName: string) => {
    renameSession(sessionId, newName);
    setEditingSession(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Sessions
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={newSessionName}
            onChange={(e) => setNewSessionName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreateSession()}
            placeholder="New session name..."
            className="flex-1 p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            onClick={handleCreateSession}
            className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
          >
            Create
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`flex items-center justify-between p-3 rounded-lg ${
              session.id === currentSessionId
                ? "bg-primary-50 dark:bg-primary-900"
                : "hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={
                  editingSession === session.id ? newSessionName : session.name
                }
                onChange={(e) => setNewSessionName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && editingSession === session.id) {
                    handleRenameSession(session.id, newSessionName);
                  }
                }}
                onBlur={() => setEditingSession(null)}
                className={`flex-1 ${
                  editingSession === session.id
                    ? "bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
                    : "cursor-pointer hover:underline"
                }`}
                onClick={() => {
                  if (!editingSession) {
                    setEditingSession(session.id);
                    setNewSessionName(session.name);
                  }
                }}
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(session.updatedAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => switchSession(session.id)}
                className="text-primary-500 hover:text-primary-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
              <button
                onClick={() => handleDeleteSession(session.id)}
                className="text-red-500 hover:text-red-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SessionManager;
