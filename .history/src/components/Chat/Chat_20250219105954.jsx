import { useState } from "react";
import "./Chat.scss";
import { IoCloseCircleOutline } from "react-icons/io5";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");
    }
  };
const closeHandle = () =
  return (
    <div className="chatContainer">
      <div className="chatMessages">
        {messages.map((message, index) => (
          <div key={index} className={`chatMessage ${message.sender}`}>
            <p>{message.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="chatInputContainer">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Mesajınızı daxil edin..."
          className="chatInput"
        />
        <button type="submit" className="chatSendButton">
          Göndər
        </button>
      </form>
      <div className="chatCloseIcon">
        <i>
          <IoCloseCircleOutline />
        </i>
      </div>
    </div>
  );
}

export default Chat;
