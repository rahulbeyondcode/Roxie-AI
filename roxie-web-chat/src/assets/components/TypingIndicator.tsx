import roxieImage from "../images/Roxie_no_bg.png";

const TypingIndicator = () => {
  return (
    <div className="mx-7 my-2 flex">
      <div className="bg-black mt-2 rounded-full w-[25px] h-[25px] overflow-hidden">
        <img src={roxieImage} alt="assistant_image" height={20} width={20} />
      </div>
      <div className="bg-[#5a5c9eec] text-white mx-2 px-4 py-3 rounded-lg backdrop-opacity-75 flex items-center gap-1">
        <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0ms]" />
        <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
};

export default TypingIndicator;
