import { useState, useEffect } from "react";
import "./Chat.scss";
import { IoIosArrowDown } from "react-icons/io";
import { CiChat1 } from "react-icons/ci";
import { IoIosSend } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";
import { firestore, collection, query, where, getDocs, addDoc } from "../../firebase/Firebase";  // Düzgün import edilmiş Firestore

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

  // Firebase-dən əvvəlki mesajları fetch etmək
  const fetchMessages = async () => {
    if (name && email) {
      const q = query(
        collection(firestore, "messages"), // Firestore kolleksiyası
        where("name", "==", name),
        where("email", "==", email)
      );
      const querySnapshot = await getDocs(q);
      const previousMessages = [];
      querySnapshot.forEach((doc) => {
        previousMessages.push(doc.data());
      });
      if (previousMessages.length === 0) {
        setMessages([{ text: "İlk dəfə yazırsınız, Salam!", sender: "system" }]);
      } else {
        setMessages(previousMessages);
      }
    }
  };

  // İstifadəçi məlumatlarını daxil etdikdən sonra formu göndərmək
  const handleUserInfoSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      setIsUserInfoEntered(true);
      fetchMessages();  // İlk mesajları çəkirik
    }
  };

  // Yeni mesaj göndərmək
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      const newMessage = { text: input, sender: "user", name, email, date: formattedDate };
      setMessages([...messages, newMessage]);

      // Firebase Firestore-a mesaj əlavə etmək
      try {
        await addDoc(collection(firestore, "messages"), newMessage);
        setInput("");  // Mesaj göndərildikdən sonra input sahəsini təmizləyirik
      } catch (error) {
        console.error("Mesaj əlavə edilərkən xəta baş verdi: ", error);
      }
    }
  };

  // Chat-in görünməsini dəyişdirmək
  const toggleChat = () => {
    setIsChatVisible(!isChatVisible);
  };

  useEffect(() => {
    // Chat açıldığında və istifadəçi məlumatları daxil edilmədikdə ilk mesajı göstərmək
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

          {/* İstifadəçi məlumatlarını daxil etmək üçün form */}
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

          {/* Mesaj göndərmə sahəsi yalnız istifadəçi məlumatları daxil edildikdən sonra görünsün */}
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
