/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { database, ref, onValue, push } from "../../../../firebase/Firebase";
import "./AdminChatRight.scss";
import { MdOutlineMoodBad } from "react-icons/md";
import { IoIosSend } from "react-icons/io";
import { FaRegSmileWink } from "react-icons/fa";
import { BsEmojiSunglasses } from "react-icons/bs";
import Modal from "react-modal";

Modal.setAppElement("#root");

export default function AdminChatRight({ selectedUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const emojis = [
    "😂", "😊", "😍", "🥺", "😎", "😭", "😜", "😢", "🤔", "😡", 
    "😅", "😆", "😏", "🥳", "🤗", "💀", "🙄", "😇", "🤩", "👍", 
    "👎", "💔", "❤️", "🔥", "✨", "💥", "🌈", "🎉", "🎁", "🍕", 
    "🍔", "🍟", "🍩", "🍰", "🍫", "🍻", "🥂", "🍷", "🥤", "🌍", 
    "🌞", "🌝", "🌺", "🌷", "🐶", "🐱", "🐭", "🐯", "🦄", "💻", 
    "👨‍💻", "👩‍💻", "🖥️", "📱", "📲", "🖱️", "⌨️", "⚙️", "🛠️", 
    "🧑‍🎨", "🎨", "🔧", "🌐", "🚀", "⚡", "🔍", "💡", "🔒", "🔑", 
    "🖋️", "📝", "🗂️", "🗃️", "💾", "💳", "🧑‍💼", "👾", "🖤", "💎", 
    "🌟", "🔥", "✨", "🌀", "💬", "📥", "📤", "📊", "🔢", "📈", 
    "📉", "🚧", "🛑", "🎯", "👨‍💻🔧", "💬", "📝", "🌱", "🚧", 
    "🔄", "🌈"
  ];
  

  useEffect(() => {
    if (selectedUser) {
      const userEmailKey = selectedUser.email.replace(".", ",");
      const messagesRef = ref(database, `users/${userEmailKey}/messages`);

      const unsubscribe = onValue(messagesRef, (snapshot) => {
        if (snapshot.exists()) {
          const messagesData = Object.values(snapshot.val());
          setMessages(messagesData);
        } else {
          setMessages([]);
        }
      });

      return () => unsubscribe();
    }
  }, [selectedUser]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "" || !selectedUser) return;

    const userEmailKey = selectedUser.email.replace(".", ",");
    const messagesRef = ref(database, `users/${userEmailKey}/messages`);

    const messageData = {
      sender: "system",
      text: newMessage,
      timestamp: Date.now(),
    };

    push(messagesRef, messageData)
      .then(() => {
        setNewMessage("");
      })
      .catch((error) => {
        console.error("Mesaj gönderilemedi:", error);
      });
  };

  const handleQuickReply = (reply) => {
    setNewMessage(reply);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);


  const handleEmojiSelect = (emoji) => {
    setNewMessage((prev) => prev + emoji);
    closeModal(); 
  };

  return (
    <div className="adminChatRightContainer">
      {selectedUser ? (
        <>
          <div className="adminChatRightHeader">
            <h2>{selectedUser.name}</h2>
          </div>

          <div className="adminChatRightMessages">
            {messages.length > 0 ? (
              messages.map((message, index) =>
                message.sender === "user" ? (
                  <div
                    key={index}
                    className="message userMessage"
                    title={formatTimestamp(message.timestamp)}
                  >
                    <h6 style={{ fontWeight: "800" }}>{message.text}</h6>
                  </div>
                ) : (
                  <div
                    key={index}
                    className="message systemMessage"
                    title={formatTimestamp(message.timestamp)}
                  >
                    <h6 style={{ fontWeight: "800" }}>{message.text}</h6>
                  </div>
                )
              )
            ) : (
              <p>
                You haven’t received any messages yet...
                <i>
                  <MdOutlineMoodBad />
                </i>
              </p>
            )}
            <div className="quickRepliesContainer">
              <button
                onClick={() =>
                  handleQuickReply("Salam, sizə necə kömək edə bilərəm?")
                }
                className="quickReplyButton"
              >
                Salam
              </button>
              <button
                onClick={() =>
                  handleQuickReply(
                    "Sualınızı biraz daha ətraflı izah edə bilərsinizmi?"
                  )
                }
                className="quickReplyButton"
              >
                Ətraflı
              </button>
              <button
                onClick={() =>
                  handleQuickReply(
                    "Dərhal yoxlayıram, bir saniyə gözləyin zəhmət olmasa."
                  )
                }
                className="quickReplyButton"
              >
                Yoxlama
              </button>
              <button
                onClick={() =>
                  handleQuickReply(
                    "Təşəkkürlər, sizə ən qısa zamanda cavab verəcəyəm."
                  )
                }
                className="quickReplyButton"
              >
                Təşəkkür
              </button>
              <button
                onClick={() =>
                  handleQuickReply(
                    "Probleminizi həll etmək üçün əlimdən gələni edəcəyəm."
                  )
                }
                className="quickReplyButton"
              >
                Həll
              </button>
            </div>
          </div>

          <div className="adminRightChatInputContainer">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="adminRightChatInput"
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button className="chatEmojiButton" onClick={openModal}>
              <i>
                <BsEmojiSunglasses />
              </i>
            </button>
            <button
              onClick={handleSendMessage}
              className="adminRightChatSendButton"
            >
              <i>
                <IoIosSend />
              </i>
            </button>
          </div>


          <Modal
  
  isOpen={isModalOpen}
  onRequestClose={closeModal}
  className="modal-content"
  overlayClassName="modal-overlay"
            }}
          >
            <h3>Choose emoji</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {emojis.map((emoji, index) => (
                <span
                  key={index}
                  onClick={() => handleEmojiSelect(emoji)}
                  style={{
                    fontSize: "20px",
                    cursor: "pointer",
                    padding: "5px",
                    borderRadius: "4px",
                    background: "#f0f0f0",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.background = "#e0e0e0")}
                  onMouseLeave={(e) => (e.target.style.background = "#f0f0f0")}
                >
                  {emoji}
                </span>
              ))}
            </div>
            <button
              onClick={closeModal}
              style={{ marginTop: "20px", padding: "5px 10px" }}
            >
              Kapat
            </button>
          </Modal>
        </>
      ) : (
        <p>
          Choose a user to begin the conversation{" "}
          <FaRegSmileWink fontSize="1.4rem" />
        </p>
      )}
    </div>
  );
}
