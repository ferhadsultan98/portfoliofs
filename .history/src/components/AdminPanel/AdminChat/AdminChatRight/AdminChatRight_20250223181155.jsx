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

  return (
    <div className="adminChatRightContainer">
      {selectedUser ? (
        <>
          <div className="adminChatRightHeader">
            <h2>
              {selectedUser.name}
            </h2>
          </div>
          <hr  style={{color: '#5a1d60'}}/>

          <div className="adminChatRightMessages">
            {messages.length > 0 ? (
              messages.map((message, index) =>
                message.sender === "user" ? (
                  <div key={index} className="message userMessage">
                    <h5>{message.text}</h5>
                  </div>
                ) : (
                  <div key={index} className="message systemMessage">
                    <h5>{message.text}</h5>
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
