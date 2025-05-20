import { useStore } from "../store";

function Settings() {
  const isDarkMode = useStore((state) => state.isDarkMode);
  const toggleDarkMode = useStore((state) => state.toggleDarkMode);
  const isDebugMode = useStore((state) => state.isDebugMode);
  const toggleDebugMode = useStore((state) => state.toggleDebugMode);

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={toggleDarkMode}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <svg
          className={`w-5 h-5 ${
            isDarkMode ? "text-gray-500" : "text-yellow-500"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
        <span className="text-sm">{isDarkMode ? "Light" : "Dark"}</span>
      </button>

      <button
        onClick={toggleDebugMode}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <svg
          className={`w-5 h-5 ${
            isDebugMode ? "text-blue-500" : "text-gray-500"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-sm">Debug</span>
      </button>
    </div>
  );
}

export default Settings;
