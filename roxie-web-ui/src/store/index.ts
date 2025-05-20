import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, Message, Session } from '../types';

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentSessionId: null,
      sessions: [],
      isDarkMode: false,
      isDebugMode: false,
      isRecording: false,
      inputText: '',
      isLoading: false,

      addMessage: (message: Message) => {
        const { currentSessionId, sessions } = get();
        if (!currentSessionId) return;

        set({
          sessions: sessions.map((session) =>
            session.id === currentSessionId
              ? {
                  ...session,
                  messages: [...session.messages, message],
                  updatedAt: new Date().toISOString(),
                }
              : session
          ),
        });
      },

      createSession: (name: string) => {
        const { sessions } = get();
        const newSession: Session = {
          id: crypto.randomUUID(),
          name,
          messages: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set({
          sessions: [...sessions, newSession],
          currentSessionId: newSession.id,
        });
      },

      deleteSession: (sessionId: string) => {
        const { sessions } = get();
        const newSessions = sessions.filter((s) => s.id !== sessionId);
        const newCurrentSessionId = newSessions.length > 0 ? newSessions[0].id : null;

        set({
          sessions: newSessions,
          currentSessionId: newCurrentSessionId,
        });
      },

      renameSession: (sessionId: string, newName: string) => {
        const { sessions } = get();
        set({
          sessions: sessions.map((session) =>
            session.id === sessionId
              ? {
                  ...session,
                  name: newName,
                  updatedAt: new Date().toISOString(),
                }
              : session
          ),
        });
      },

      switchSession: (sessionId: string) => {
        set({ currentSessionId: sessionId });
      },

      toggleDarkMode: () => {
        set((state) => ({ isDarkMode: !state.isDarkMode }));
      },

      toggleDebugMode: () => {
        set((state) => ({ isDebugMode: !state.isDebugMode }));
      },

      toggleRecording: () => {
        set((state) => ({ isRecording: !state.isRecording }));
      },

      setInputText: (text: string) => {
        set({ inputText: text });
      },

      setIsLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'roxie-store',
    }
  )
);
