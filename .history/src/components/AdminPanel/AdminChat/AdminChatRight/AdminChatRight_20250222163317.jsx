import { useState, useEffect } from "react";
import { database, ref, onValue } from "../../../../firebase/Firebase";
import './AdminChatRight.scss';

export default function AdminChatRight({ selectedUser }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (selectedUser) {
      const userEmailKey = selectedUser.email.replace(".", ","); // Firebase key format
      const messagesRef = ref(database, `users/${userEmailKey}/messages`);

      const unsubscribe = onValue(messagesRef, (snapshot) => {
        if (snapshot.exists()) {
          const messagesData = Object.values(snapshot.val()); // Firebase verisini diziye çevir
          setMessages(messagesData);
        } else {
          setMessages([]);
        }
      });

      return () => unsubscribe();
    }
  }, [selectedUser]);

  return (
    <div className="adminChatRightContainer">
      {selectedUser ? (
        <>
          <h2>Chat with {selectedUser.name}</h2>
          <div className="adminChatRightMessages">
            {messages.length > 0 ? (
              messages.map((message, index) => (
                message.sender === "user" ? (
                  <div key={index} className="message userMessage messageBubble">
                    <p>{message.text}</p>
                  </div>
                ) : (
                  <div key={index} className="message systemMessage messageBubble">
                    <p>{message.text}</p>
                  </div>
                )
              ))
            ) : (
              <p>No messages yet...</p>
            )}
          </div>
        </>
      ) : (
        <p>Select a user to start chatting...</p>
      )}
    </div>
  );
}