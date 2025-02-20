import { useState, useEffect } from "react";
import "./Chat.scss";
import { IoIosArrowDown } from "react-icons/io";
import { CiChat1 } from "react-icons/ci";
import { IoIosSend } from "react-icons/io";
import { FaRegUser } from "react-icons/fa6";
import { db, collection, query, where, getDocs } from "../../"; 

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

  // Firebase-dən məlumatları alaraq e-poçt və ad əsasında əvvəlki söhbətləri göstərmək
  const fetchMessages = async () => {
    if (name && email) {
      const q = query(
        collection(db, "messages"),
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

  // İstifadəçi adı və e-poçt daxil edildikdən sonra mesajlaşma başlasın
  const handleUserInfoSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      setIsUserInfoEntered(true);
      fetchMessages();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const newMessage = { text: input, sender: "user", name, email, date: formattedDate };
      setMessages([...messages, newMessage]);

      // Firebase-ə mesajı əlavə et
      // db.collection("messages").add(newMessage);

      setInput("");
    }
  };

  const toggleChat = () => {
    setIsChatVisible(!isChatVisible);
  };

  useEffect(() => {
    // Chat başladıqda selamlama mesajı göndər
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

          {/* İstifadəçi məlumatı daxil edilmədikdə, inputları göstər */}
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
          
          {/* Mesaj yazma inputu, istifadəçi məlumatını daxil etdikdən sonra aktiv olacaq */}
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
