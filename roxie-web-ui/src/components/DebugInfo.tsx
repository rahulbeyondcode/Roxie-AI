interface DebugInfoProps {
  debugInfo: {
    latency: number;
    jsonResponse: any;
  };
}

function DebugInfo({ debugInfo }: DebugInfoProps) {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg mt-2">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600 dark:text-gray-300">Latency:</span>
        <span className="font-mono text-sm text-gray-900 dark:text-white">
          {debugInfo.latency.toFixed(2)}ms
        </span>
      </div>
      <div className="bg-gray-200 dark:bg-gray-700 rounded-md p-3">
        <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 dark:text-gray-200">
          {JSON.stringify(debugInfo.jsonResponse, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default DebugInfo;
