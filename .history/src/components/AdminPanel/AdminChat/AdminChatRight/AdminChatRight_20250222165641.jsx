/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { database, ref, onValue, push } from "../../../../firebase/Firebase";
import "./AdminChatRight.scss";
import { MdOutlineMoodBad } from "react-icons/md";

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

  return (
    <div className="adminChatRightContainer">
      {selectedUser ? (
        <>
          <div className="adminChatRightHeader">
            <h2>Chat with {selectedUser.name}</h2>
          </div>

          <div className="adminChatRightMessages">
            {messages.length > 0 ? (
              messages.map((message, index) =>
                message.sender === "user" ? (
                  <div key={index} className="message userMessage">
                    <p>{message.text}</p>
                  </div>
                ) : (
                  <div key={index} className="message systemMessage">
                    <p>{message.text}</p>
                  </div>
                )
              )
            ) : (
              <p>
                You haven’t received any messages yet...{" "}
                <i>
                  <MdOutlineMoodBad />
                </i>
              </p>
            )}
          </div>

          <div className="adminChatInputContainer">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="adminChatInput"
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button onClick={handleSendMessage} className="adminChatSendButton">
              Send
            </button>
          </div>
        </>
      ) : (
        <p>Choose a user to begin the conversation</p>
      )}
    </div>
  );
}
