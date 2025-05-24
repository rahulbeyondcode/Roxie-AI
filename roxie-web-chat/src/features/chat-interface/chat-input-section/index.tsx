import sendIcon from "../../../assets/images/send-icon.svg";

const ChatInputSection = () => {
  return (
    <div className="h-35 px-7 pb-3 flex items-center">
      <textarea
        spellCheck={false}
        placeholder="Type your query here..."
        className="h-full grow rounded-lg py-2 px-3 outline-0 backdrop-opacity-35 mr-2"
      />
      <button className="rounded-full h-[50px] w-[50px] flex justify-center items-center cursor-pointer backdrop-opacity-35">
        <img src={sendIcon} alt="" width="30px" height="30px" />
      </button>
    </div>
  );
};

export default ChatInputSection;
