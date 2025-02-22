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
    <div className="admin-chat-right-container">
      {selectedUser ? (
        <>
          <h2 className="chat-header">Chat with {selectedUser.name}</h2>
          <div className="admin-chat-messages">
            {messages.length > 0 ? (
              messages.map((message, index) => (
                message.sender === "user" ? (
                  <div key={index} className="message user-message">
                    <p>{message.text}</p>
                  </div>
                ) : (
                  <div key={index} className="message system-message">
                    <p>{message.text}</p>
                  </div>
                )
              ))
            ) : (
              <p className="no-messages">No messages yet...</p>
            )}
          </div>
        </>
      ) : (
        <p className="no-user">Select a user to start chatting...</p>
      )}
    </div>
  );
}