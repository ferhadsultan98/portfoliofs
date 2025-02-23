import { useState, useEffect } from "react";
import "./Chat.scss";
import { IoIosArrowDown, IoMdLogIn, IoIosSend } from "react-icons/io";
import { CiChat1 } from "react-icons/ci";
import { database, ref, set, get, child, onValue } from "../../firebase/Firebase";
import { v4 as uuidv4 } from "uuid";
import { GrStatusGoodSmall } from "react-icons/gr";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    userId: null,
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lastAuthTime, setLastAuthTime] = useState(null);

  const current = new Date();
  const formattedDate = `${current.getDate()}-${current.getMonth() + 1}-${current.getFullYear()} ${current.getHours()}:${current.getMinutes()}`;

  useEffect(() => {
    const checkUser = async () => {
      const savedEmail = sessionStorage.getItem("chatEmail");
      const authTime = sessionStorage.getItem("authTime");

      if (savedEmail && authTime) {
        const timeDiff = (Date.now() - parseInt(authTime)) / 60000;

        if (timeDiff < 10) {
          const emailKey = savedEmail.replace(".", ",");
          const dbRef = ref(database);
          const snapshot = await get(child(dbRef, `users/${emailKey}`));

          if (snapshot.exists()) {
            const userData = snapshot.val();
            setUserInfo({
              name: userData.name,
              email: savedEmail,
              userId: userData.userId,
            });
            setMessages(userData.messages ? Object.values(userData.messages) : []);
            setIsAuthenticated(true);
            setLastAuthTime(parseInt(authTime));
          } else {
         
            setUserInfo({ name: "", email: "", userId: null });
            setIsAuthenticated(false);
            setMessages([]);
            sessionStorage.removeItem("chatEmail");
            sessionStorage.removeItem("authTime");
          }
        } else {
          sessionStorage.removeItem("chatEmail");
          sessionStorage.removeItem("authTime");
        }
      }
    };

    checkUser();

    let unsubscribe;
    if (isAuthenticated && userInfo.email) {
      const emailKey = userInfo.email.replace(".", ",");
      const messagesRef = ref(database, `users/${emailKey}/messages`);

      unsubscribe = onValue(messagesRef, (snapshot) => {
        if (snapshot.exists()) {
          const messagesData = Object.values(snapshot.val());
          setMessages(messagesData);
        } else {
          // Mesajlar yoksa veya alınamazsa, formu göster
          setMessages([]);
          setIsAuthenticated(false);
          sessionStorage.removeItem("chatEmail");
          sessionStorage.removeItem("authTime");
        }
      });
    }

    const interval = setInterval(() => {
      if (lastAuthTime && (Date.now() - lastAuthTime) / 60000 >= 10) {
        setIsAuthenticated(false);
        setMessages([]);
        setUserInfo({ name: "", email: "", userId: null });
        sessionStorage.removeItem("chatEmail");
        sessionStorage.removeItem("authTime");
        setLastAuthTime(null);
      }
    }, 60000);

    return () => {
      clearInterval(interval);
      if (unsubscribe) unsubscribe();
    };
  }, [isAuthenticated, userInfo.email, lastAuthTime]);

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    if (userInfo.name.trim() && userInfo.email.trim()) {
      const emailKey = userInfo.email.replace(".", ",");
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, `users/${emailKey}`));

      let userId;
      let initialMessages = [];

      if (snapshot.exists()) {
        const userData = snapshot.val();
        userId = userData.userId;
        initialMessages = userData.messages ? Object.values(userData.messages) : [];
      } else {
        userId = uuidv4();
        initialMessages = [
          {
            text: `Hello, ${userInfo.name}! Welcome! Write a message to start a new conversation.`,
            sender: "system",
            timestamp: formattedDate,
          },
        ];
      }

      const userRef = ref(database, `users/${emailKey}`);
      await set(userRef, {
        name: userInfo.name,
        email: userInfo.email,
        userId: userId,
        messages: initialMessages,
      });

      setUserInfo({ ...userInfo, userId });
      setMessages(initialMessages);
      setIsAuthenticated(true);
      setLastAuthTime(Date.now());
      sessionStorage.setItem("chatEmail", userInfo.email);
      sessionStorage.setItem("authTime", Date.now());
    }
  };

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() && isAuthenticated) {
      const newMessage = {
        text: input,
        sender: "user",
        timestamp: formattedDate,
        userId: userInfo.userId,
      };

      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      setInput("");

      const emailKey = userInfo.email.replace(".", ",");
      const userRef = ref(database, `users/${emailKey}`);
      await set(userRef, {
        name: userInfo.name,
        email: userInfo.email,
        userId: userInfo.userId,
        messages: updatedMessages,
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
          <i>
            <CiChat1 />
          </i>
        </div>
      )}

      {isChatVisible && (
        <div className="chatWindow">
          <div className="chatHeader">
            <div className="chatStatusIcon">
              <i>
                <GrStatusGoodSmall />
              </i>
            </div>
            <div className="chatCloseIcon" onClick={toggleChat}>
              <i>
                <IoIosArrowDown />
              </i>
            </div>
          </div>

          {!isAuthenticated ? (
            <form onSubmit={handleUserSubmit} className="userInfoForm">
              <p>Enter your details to start the conversation</p>
              <input
                type="text"
                value={userInfo.name}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, name: e.target.value })
                }
                placeholder="Name"
                className="chatInput"
                required
              />
              <input
                type="email"
                value={userInfo.email}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, email: e.target.value })
                }
                placeholder="Email"
                className="chatInput"
                required
              />
              <button type="submit" className="chatSendButton">
                <i>
                  <IoMdLogIn />
                </i>
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
              <form
                onSubmit={handleMessageSubmit}
                className="chatInputContainer"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Messages.."
                  className="chatInput"
                />
                <button type="submit" className="chatSendButton">
                  <i>
                    <IoIosSend />
                  </i>
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Chat;