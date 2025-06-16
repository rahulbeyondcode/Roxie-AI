import { useEffect, useState } from "react";
import LoadingAnimation from "./assets/components/Loading";
import WaveDown from "./assets/components/WaveDown";
import WaveUp from "./assets/components/WaveUp";
import ChatInterface from "./features/chat-interface";
import { generateRandomBetween } from "./helpers/utils";
import "./styles/general.css";

function App() {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // Setting random loading screen duration
    const timeout = setTimeout(() => {
      setShowLoader(false);
    }, generateRandomBetween(500, 3500));

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="h-full relative">
      <WaveDown startColor="#505285" stopColor="#b5aee4" />
      <div className="flex justify-center h-full z-5 relative">
        {showLoader ? <LoadingAnimation /> : <ChatInterface />}
      </div>
      <WaveUp startColor="#505285" stopColor="#b5aee4" />
    </div>
  );
}

export default App;
