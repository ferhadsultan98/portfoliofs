import { useState, useEffect } from "react";
import "./Chat.scss";
import { IoIosArrowDown, IoMdLogIn, IoIosSend } from "react-icons/io";
import { CiChat1 } from "react-icons/ci";
import { database, ref, set, get, child, onValue } from "../../firebase/Firebase";
import { v4 as uuidv4 } from "uuid";
import { GrStatusGoodSmall } from "react-icons/gr";
import { FaUserTie } from "react-icons/fa";      // Added for user icon
import { LiaDev } from "react-icons/lia";          // Added for system icon

// ... (rest of your existing imports and hooks remain unchanged)

const Chat = () => {
  // ... (all your existing state and functions remain unchanged)

  return (
    <div className="chatContainer">
      {!isChatVisible && (
        <div onClick={toggleChat} className="showChatButton">
          <i>
            <CiChat1 />
          </i>
        </div>
      )}
  
      <div className={`chatWindow ${isChatVisible ? 'visible' : ''}`}>
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
            {/* ... (existing form content unchanged) */}
          </form>
        ) : (
          <>
            <div className="chatMessages">
              {messages.map((message, index) => (
                <div key={index} className={`chatMessage ${message.sender}`}>
                  {message.sender === "system" && (
                    <span className="message-icon left">
                      <LiaDev />
                    </span>
                  )}
                  <div className="message-content">
                    <p>{message.text}</p>
                    <i>{formatTimestamp(message.timestamp)}</i>
                  </div>
                  {message.sender === "user" && (
                    <span className="message-icon right">
                      <FaUserTie />
                    </span>
                  )}
                </div>
              ))}
            </div>
            <form onSubmit={handleMessageSubmit} className="chatInputContainer">
              {/* ... (existing input form unchanged) */}
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;