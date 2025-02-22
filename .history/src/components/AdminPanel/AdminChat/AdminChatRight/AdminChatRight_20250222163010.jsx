import { useState, useEffect } from "react";
import { database, ref, onValue } from "../../../../firebase/Firebase";
import './AdminChatRight.scss';

export default function AdminChatRight({ selectedUser }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (selectedUser) {
      const userEmailKey = selectedUser.email.replace(".", ",");  // Firebase key format
      const messagesRef = ref(database, `users/${userEmailKey}/messages`);

      // Listen for changes to the selected user's messages
      const unsubscribe = onValue(messagesRef, (snapshot) => {
        if (snapshot.exists()) {
          const messagesData = snapshot.val();
          setMessages(messagesData);  // Set messages state
        } else {
          setMessages([]);  // If no messages, set an empty array
        }
      });

      // Cleanup the listener when the component is unmounted
      return () => unsubscribe();
    }
  }, [selectedUser]);  // Fetch new messages when selectedUser changes

  return (
    <div className="adminChatRightContainer">
      {selectedUser ? (
        <>
          <h2>Chat with {selectedUser.name}</h2>
          <div className="adminChatRightMessages">
            {messages.length > 0 ? (
              messages.map((message, index) => (
                message.sender === "user" ? (
                  <div key={index} className="message userMessage">
                    <h3>{message.text}</h3>
                  </div>
                ) : (
                  <div key={index} className="message systemMessage">
                    <h3>{message.text}</h3>
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
