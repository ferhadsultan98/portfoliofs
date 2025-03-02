import { useState, useEffect, useRef } from "react";
import "./Chat.scss";
import { IoMdLogIn, IoIosSend } from "react-icons/io";
import { CgClose } from "react-icons/cg";
import { CiChat1 } from "react-icons/ci";
import {
  database,
  ref,
  set,
  get,
  child,
  onValue,
} from "../../firebase/Firebase";
import { v4 as uuidv4 } from "uuid";
import FSLogo from "../../assets/FS Light.png";
import ChatNotificationAudio from "../../assets/song/notfctn.mp3";
import { IoVolumeMute } from "react-icons/io5";
import { GoUnmute } from "react-icons/go";
import { BsEmojiSunglasses } from "react-icons/bs";
import toast from "react-hot-toast";

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
  const [suggestedDomains, setSuggestedDomains] = useState([]);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // Yeni state: Ses susturuldu mu?
  const chatMessagesRef = useRef(null);
  const audioRef = useRef(new Audio(ChatNotificationAudio));

  const current = new Date();
  const formattedDate = `${current.getDate()}-${
    current.getMonth() + 1
  }-${current.getFullYear()} ${current.getHours()}:${current.getMinutes()}`;

  const formatTimestamp = (timestamp) => {
    let date;
    if (typeof timestamp === "number") {
      date = new Date(timestamp);
    } else {
      return timestamp;
    }
    return `${date.getDate()}-${
      date.getMonth() + 1
    }-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    const filteredValue = value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8);
    const capitalizedValue =
      filteredValue.charAt(0).toUpperCase() + filteredValue.slice(1);
    setUserInfo({ ...userInfo, name: capitalizedValue });
  };

  const allowedDomains = [
    "gmail.com",
    "mail.ru",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
  ];

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setUserInfo({ ...userInfo, email: value });

    if (value.includes("@")) {
      const [prefix, domainPart] = value.split("@");
      if (!domainPart) {
        setSuggestedDomains(
          allowedDomains.map((domain) => `${prefix}@${domain}`)
        );
      } else {
        const filteredDomains = allowedDomains
          .filter((domain) => domain.startsWith(domainPart))
          .map((domain) => `${prefix}@${domain}`);
        setSuggestedDomains(filteredDomains);
      }
    } else {
      setSuggestedDomains([]);
    }
  };

  const validateEmail = (email) => {
    const domain = email.split("@")[1];
    return allowedDomains.includes(domain);
  };

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
            setMessages(
              userData.messages ? Object.values(userData.messages) : []
            );
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

  useEffect(() => {
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      if (latestMessage.sender === "system" && !isMuted) {
        audioRef.current.play().catch((error) => {
          console.log("Audio playback failed:", error);
        });
        if (!isChatVisible && isAuthenticated) {
          setHasUnreadMessages(true);
        }
      }
    }

    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages, isChatVisible, isAuthenticated, isMuted]);

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    if (userInfo.name.trim() && userInfo.email.trim()) {
      if (!validateEmail(userInfo.email)) {
        alert(
          "Only gmail.com, mail.ru, yahoo.com, hotmail.com, and outlook.com are allowed!"
        );
        return;
      }
      const emailKey = userInfo.email.replace(".", ",");
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, `users/${emailKey}`));

      let userId;
      let initialMessages = [];

      if (snapshot.exists()) {
        const userData = snapshot.val();
        userId = userData.userId;
        initialMessages = userData.messages
          ? Object.values(userData.messages)
          : [];
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

  const muteChat = () => {
    setIsMuted(!isMuted);
    if (!isMuted && audioRef.current) {
      audioRef.current.pause();
      toast.success("Sound muted!", {
        position: "top-center",
        style: {
          background: "none",
          border: "1px solid #5a1d60",
          borderRadius: "15px",
          color: "#ccc",
        },
      });
    } else {
      toast.success("Sound unmuted!", {
        position: "top-center",
        style: {
          background: "none",
          border: "1px solid #5a1d60",
          borderRadius: "15px",
          color: "#ccc",
        },
      });
    }
  };

  const toggleChat = () => {
    setIsChatVisible(!isChatVisible);
    if (!isChatVisible) {
      setHasUnreadMessages(false);
    }
  };

  return (
    <div className="chatContainer">
      {!isChatVisible && (
        <div onClick={toggleChat} className="showChatButton">
          <i>
            <CiChat1 />
          </i>
          {hasUnreadMessages && <span className="notification-dot"></span>}
        </div>
      )}

      <div className={`chatWindow ${isChatVisible ? "visible" : ""}`}>
        <div className="chatHeader">
          <div className="chatLogo">
            <img src={FSLogo} alt="chatLogo" />
            <h3>
              Chat <strong>BOT</strong>
            </h3>
          </div>
          <div className="chatMuteCloseContainer">
            <div className="chatMuteIcon">
              <i onClick={muteChat} title={isMuted ? "Unmute" : "Mute"}>
                {isMuted ? <IoVolumeMute /> : <GoUnmute />}
              </i>
            </div>
            <div className="chatCloseIcon">
              <i onClick={toggleChat} title="Close Chat">
                <CgClose />
              </i>
            </div>
          </div>
        </div>

        {!isAuthenticated ? (
          <form onSubmit={handleUserSubmit} className="userInfoForm">
            <p>Enter your details to start the conversation</p>
            <input
              type="text"
              value={userInfo.name}
              onChange={handleNameChange}
              placeholder="Name"
              className="chatInput"
              required
              maxLength="8"
            />
            <input
              type="email"
              value={userInfo.email}
              onChange={handleEmailChange}
              placeholder="Email"
              className="chatInput"
              required
              list="email-domains"
            />
            <datalist id="email-domains">
              {suggestedDomains.length > 0
                ? suggestedDomains.map((suggestion, index) => (
                    <option key={index} value={suggestion} />
                  ))
                : allowedDomains.map((domain) => (
                    <option key={domain} value={`@${domain}`} />
                  ))}
            </datalist>
            <button type="submit" className="chatSendButton">
              LOGIN
              <i>
                <IoMdLogIn />
              </i>
            </button>
          </form>
        ) : (
          <>
            <div className="chatMessages" ref={chatMessagesRef}>
              {messages.map((message, index) => {
                const currentMessageDate = new Date(
                  typeof message.timestamp === "number"
                    ? message.timestamp
                    : message.timestamp
                        .split(" ")[0]
                        .split("-")
                        .reverse()
                        .join("-")
                );
                const previousMessageDate =
                  index > 0
                    ? new Date(
                        typeof messages[index - 1].timestamp === "number"
                          ? messages[index - 1].timestamp
                          : messages[index - 1].timestamp
                              .split(" ")[0]
                              .split("-")
                              .reverse()
                              .join("-")
                      )
                    : null;

                const showDate =
                  index === 0 ||
                  (previousMessageDate &&
                    (currentMessageDate.getDate() !==
                      previousMessageDate.getDate() ||
                      currentMessageDate.getMonth() !==
                        previousMessageDate.getMonth() ||
                      currentMessageDate.getFullYear() !==
                        previousMessageDate.getFullYear()));

                return (
                  <>
                    {showDate && (
                      <div className="dateMessageLatest">
                        <h5>
                          {currentMessageDate.toLocaleDateString("tr-TR", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </h5>
                      </div>
                    )}
                    <div
                      key={index}
                      className={`chatMessage ${message.sender}`}
                    >
                      <p>{message.text}</p>
                      <i>{formatTimestamp(message.timestamp)}</i>
                    </div>
                  </>
                );
              })}
            </div>
            <form onSubmit={handleMessageSubmit} className="chatInputContainer">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Messages..."
                className="chatInput"
              />
              <button>
                <i>
                  <BsEmojiSunglasses />
                </i>
              </button>
              <button type="submit" className="chatSendButton">
                <i>
                  <IoIosSend />
                </i>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
