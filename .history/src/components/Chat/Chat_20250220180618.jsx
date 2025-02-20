import { useState, useEffect } from "react";
import "./Chat.scss";
import { IoIosArrowDown } from "react-icons/io";
import { CiChat1 } from "react-icons/ci";
import { IoIosSend } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";
import { firestore, collection, query, where, getDocs } from "../../firebase/Firebase";  // Corrected import

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isUserInfoEntered, setIsUserInfoEntered] = useState(false);

  const current = new Date();
  const day = current.getDate();
  const month = current.getMonth() + 1;
  const year = current.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;

  // Firebase function to fetch previous messages based on name and email
  const fetchMessages = async () => {
    if (name && email) {
      const q = query(
        collection(firestore, "messages"), // Use firestore here
        where("name", "==", name),
        where("email", "==", email)
      );
      const querySnapshot = await getDocs(q);
      const previousMessages = [];
      querySnapshot.forEach((doc) => {
        previousMessages.push(doc.data());
      });
      setMessages(previousMessages);
    }
  };

  // Handle the user info form submission
  const handleUserInfoSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      setIsUserInfoEntered(true);
      fetchMessages();
    }
  };

  // Handle sending a new message
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const newMessage = { text: input, sender: "user", name, email, date: formattedDate };
      setMessages([...messages, newMessage]);

      // Optionally, you can add the message to Firebase Firestore here if needed

      setInput("");
    }
  };

  // Toggle chat visibility
  const toggleChat = () => {
    setIsChatVisible(!isChatVisible);
  };

  useEffect(() => {
    // Display a greeting message when chat is visible but user info is not entered
    if (isChatVisible && !isUserInfoEntered) {
      setMessages([{ text: "Salam! Əvvəlcə adınızı və e-poçtunuzu daxil edin.", sender: "system" }]);
    }
  }, [isChatVisible, isUserInfoEntered]);

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

          {/* Display the user info form if not entered yet */}
          {!isUserInfoEntered ? (
            <form onSubmit={handleUserInfoSubmit} className="userInfoForm">
              <input
                type="text"
                placeholder="Adınızı daxil edin"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="userInfoInput"
              />
              <input
                type="email"
                placeholder="E-poçtunuzu daxil edin"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="userInfoInput"
              />
              <button type="submit" className="userInfoSubmitButton">
                Daxil et
              </button>
            </form>
          ) : (
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
          )}

          <hr />

          {/* Message input will only appear after user info is entered */}
          {isUserInfoEntered && (
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
          )}
        </div>
      )}
    </div>
  );
}

export default Chat;
