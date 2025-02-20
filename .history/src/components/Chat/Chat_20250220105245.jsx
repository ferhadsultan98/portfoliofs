import { useState } from "react";
import "./Chat.scss";
import { IoIosArrowDown } from "react-icons/io";
import { CiChat1 } from "react-icons/ci";
import { IoIosSend } from "react-icons/io";
import { FaRegUser } from "react-icons/fa6";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isChatVisible, setIsChatVisible] = useState(false);

  const current = new Date();
  const day = current.getDate();
  const month = current.getMonth() + 1;
  const year = current.getFullYear();

  const formattedDate = `${day}-${month}-${year}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");
    }
  };

  const toggleChat = () => {
    setIsChatVisible(!isChatVisible);
  };

  return (
    <div className="chatContainer">
      {!isChatVisible && (
        <div onClick={toggleChat} className="showChatButton">
          <i>
            <CiChat1 />
          </i>
        </div>
      )}

      {isChatVisible && (
        <div className="chatWindow">
          <div className="chatHeader">
            <div className="chatCloseIcon" onClick={toggleChat}>
              <i>
                <IoIosArrowDown />
              </i>
            </div>
          </div>
          <div className="chatMessages">
            {messages.map((message, index) => (
              <div key={index} className={`chatMessage ${message.sender}`}>
                <p>
                  <FaRegUser style={{ display: "flex" }} />
                  {message.text}
                </p>
                <i>{formattedDate}</i>
              </div>
            ))}
          </div>
          <hr />
          <form onSubmit={handleSubmit} className="chatInputContainer">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Mesajınızı daxil edin..."
              className="chatInput"
            />

            <button type="submit" className="chatSendButton">
              <i>
                <IoIosSend />
              </i>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;
