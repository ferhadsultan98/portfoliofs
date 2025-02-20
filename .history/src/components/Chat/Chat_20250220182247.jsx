import { useState, useEffect } from "react";
import "./Chat.scss";
import { IoIosArrowDown } from "react-icons/io";
import { CiChat1 } from "react-icons/ci";
import { IoIosSend } from "react-icons/io";
import { database, ref, set, get, child } from "../../firebase/Firebase"; 
function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "", email: "" });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const current = new Date();
  const formattedDate = `${current.getDate()}-${current.getMonth() + 1}-${current.getFullYear()} ${current.getHours()}:${current.getMinutes()}`;

  // Check if user exists in Firebase on component mount
  useEffect(() => {
    const checkUser = async () => {
      const savedEmail = localStorage.getItem("chatEmail");
      if (savedEmail) {
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, `users/${savedEmail.replace(".", ",")}`));
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setUserInfo({ name: userData.name, email: savedEmail });
          setMessages(userData.messages || []);
          setIsAuthenticated(true);
        }
      }
    };
    checkUser();
  }, []);

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    if (userInfo.name.trim() && userInfo.email.trim()) {
      const emailKey = userInfo.email.replace(".", ","); // Replace . with , because Firebase doesn't allow . in keys
      const userRef = ref(database, `users/${emailKey}`);
      
      // Save user info and initial empty messages array
      await set(userRef, {
        name: userInfo.name,
        email: userInfo.email,
        messages: []
      });
      
      localStorage.setItem("chatEmail", userInfo.email);
      setIsAuthenticated(true);
    }
  };

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() && isAuthenticated) {
      const newMessage = {
        text: input,
        sender: "user",
        timestamp: formattedDate
      };
      
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      setInput("");

      // Save to Firebase
      const emailKey = userInfo.email.replace(".", ",");
      const userRef = ref(database, `users/${emailKey}`);
      await set(userRef, {
        name: userInfo.name,
        email: userInfo.email,
        messages: updatedMessages
      });
    }
  };

  const toggleChat = () => {
    setIsChatVisible(!isChatVisible);
  };

  return (
    <div className="chatContainer">
      {!isChatVisible && (
        <div onClick={toggleChat} className="showChatButton">
          <i><CiChat1 /></i>
        </div>
      )}

      {isChatVisible && (
        <div className="chatWindow">
          <div className="chatHeader">
            <div className="chatCloseIcon" onClick={toggleChat}>
              <i><IoIosArrowDown /></i>
            </div>
          </div>

          {!isAuthenticated ? (
            <form onSubmit={handleUserSubmit} className="userInfoForm">
              <input
                type="text"
                value={userInfo.name}
                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                placeholder="Adınızı daxil edin..."
                className="chatInput"
              />
              <input
                type="email"
                value={userInfo.email}
                onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                placeholder="Emailinizi daxil edin..."
                className="chatInput"
              />
              <button type="submit" className="chatSendButton">
                Daxil ol
              </button>
            </form>
          ) : (
            <>
              <div className="chatMessages">
                {messages.map((message, index) => (
                  <div key={index} className={`chatMessage ${message.sender}`}>
                    <p>{message.text}</p>
                    <i>{message.timestamp}</i>
                  </div>
                ))}
              </div>
              <hr />
              <form onSubmit={handleMessageSubmit} className="chatInputContainer">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Mesajınızı daxil edin..."
                  className="chatInput"
                />
                <button type="submit" className="chatSendButton">
                  <i><IoIosSend /></i>
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Chat;