/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { database, ref, onValue, push } from "../../../../firebase/Firebase";
import "./AdminChatRight.scss";
import { MdOutlineMoodBad } from "react-icons/md";
import { IoIosSend } from "react-icons/io";
import { FaRegSmileWink } from "react-icons/fa";

export default function AdminChatRight({ selectedUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

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

  // Timestamp'i okunabilir tarihe çeviren fonksiyon
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }); // Örnek çıktı: "01.03.2025 15:30:45"
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
                  <div key={index} className="message userMessage">
                    <h6 title={formatTimestamp(message.timestamp)}>
                      {message.text}
                    </h6>
                  </div>
                ) : (
                  <div key={index} className="message systemMessage">
                    <h6 title={formatTimestamp(message.timestamp)} >
                      {message.text}
                    </h6>
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
            <button
              onClick={handleSendMessage}
              className="adminRightChatSendButton"
            >
              <i>
                <IoIosSend />
              </i>
            </button>
          </div>
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