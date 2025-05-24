import roxieImage from "../../../assets/images/Roxie_no_bg.png";
import userIcon from "../../../assets/images/user-icon.svg";

const AssistantMessage = ({ message }: { message: string }) => {
  return (
    <div className="mx-7 my-2 flex">
      <div className="bg-black mt-2 rounded-full w-[25px] h-[25px] overflow-hidden">
        <img src={roxieImage} alt="assistant_image" height={20} width={20} />
      </div>
      <div className="max-w-3/4 mx-2 px-4 py-2 rounded-lg backdrop-opacity-75">
        <p>{message}</p>
      </div>
    </div>
  );
};

const HumanMessage = ({ message }: { message: string }) => {
  return (
    <div className="mx-7 my-2 flex justify-end">
      <div className="bg-black mt-2 rounded-full w-[25px] h-[25px] flex justify-center items-center">
        <img src={userIcon} alt="assistant_image" height={15} width={15} />
      </div>

      <div className="max-w-3/4 mx-2 px-4 py-2 rounded-lg backdrop-opacity-75">
        <p>{message}</p>
      </div>
    </div>
  );
};

const ChatMessagesContainer = () => {
  return (
    <div className="h-full flex flex-col py-4 overflow-y-auto">
      <AssistantMessage message="Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores magni alias ea non illo et autem vero id quidem excepturi aspernatur pariatur eveniet repellat deleniti, odio sequi deserunt! Quas, soluta." />
      <HumanMessage message="Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores magni alias ea non illo et autem vero id quidem excepturi aspernatur pariatur eveniet repellat deleniti, odio sequi deserunt! Quas, soluta." />
    </div>
  );
};

export default ChatMessagesContainer;
