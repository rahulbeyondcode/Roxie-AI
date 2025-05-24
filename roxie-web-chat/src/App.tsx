import { useEffect, useState } from "react";
import LoadingAnimation from "./assets/components/Loading";
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
    <div className="flex justify-center h-full bg-[url(./assets/images/background_image.jpg)] bg-center bg-cover">
      {showLoader ? <LoadingAnimation /> : <ChatInterface />}
    </div>
  );
}

export default App;
