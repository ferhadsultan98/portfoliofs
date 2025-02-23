/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { database, ref, onValue, remove } from "../../../../firebase/Firebase";
import { IoCloseCircleOutline } from "react-icons/io5";
import "./AdminChatLeft.scss";
import { MdDeleteOutline } from "react-icons/md";
import { IoMailUnread } from "react-icons/io5";

const AdminChatLeft = ({ onUserSelect }) => {
  const [nameSearch, setNameSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    return timestamp;
  };

  useEffect(() => {
    const dbRef = ref(database, "users");

    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const userList = Object.keys(usersData).map((key) => {
          const messages = usersData[key].messages
            ? Object.values(usersData[key].messages)
            : [];
          const sortedMessages = messages.sort((a, b) => {
            const dateA = new Date(
              a.timestamp.split(" ")[0].split("-").reverse().join("-") +
                " " +
                a.timestamp.split(" ")[1]
            );
            const dateB = new Date(
              b.timestamp.split(" ")[0].split("-").reverse().join("-") +
                " " +
                b.timestamp.split(" ")[1]
            );
            return dateB - dateA;
          });
          const lastMessage =
            sortedMessages.length > 0 ? sortedMessages[0] : null;
          return {
            name: usersData[key].name,
            email: usersData[key].email,
            lastMessageTime: lastMessage ? lastMessage.timestamp : null,
            lastMessageSender: lastMessage ? lastMessage.sender : null,
            userId: usersData[key].userId,
          };
        });
        setUsers(userList);
      } else {
        setUsers([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const getFilteredData = () => {
    let filtered = users.filter((user) =>
      user.name.toLowerCase().includes(nameSearch.toLowerCase())
    );

    if (activeTab === "unread") {
      // Exclude messages where last sender is either "admin" or "system"
      filtered = filtered.filter(
        (user) =>
          user.lastMessageSender &&
          user.lastMessageSender !== "admin" &&
          user.lastMessageSender !== "system"
      );
    }

    return filtered;
  };

  const handleUserClick = (user) => {
    onUserSelect(user);
  };

  const handleDeleteChat = (email) => {
    const emailKey = email.replace(".", ",");
    const userRef = ref(database, `users/${emailKey}`);

    remove(userRef)
      .then(() => {
        console.log(`${email} kullanıcısı tamamen silindi`);
      })
      .catch((error) => {
        console.error("Kullanıcı silinirken hata oluştu:", error);
      });
  };

  const isUnread = (user) => {
    return (
      user.lastMessageSender &&
      user.lastMessageSender !== "admin" &&
      user.lastMessageSender !== "system"
    );
  };

  return (
    <div className="adminChatLeftContainer">
      <div className="adminChatLeftSearch">
        <input
          type="text"
          value={nameSearch}
          onChange={(e) => setNameSearch(e.target.value)}
          placeholder="Search users..."
        />
        <i>
          <IoCloseCircleOutline onClick={() => setNameSearch("")} />
        </i>
      </div>
      <div className="adminChatLeftGroups">
        <div
          className={`allChatGroup ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          All
        </div>
        <div
          className={`unreadChatGroup ${activeTab === "unread" ? "active" : ""}`}
          onClick={() => setActiveTab("unread")}
        >
          Unread
        </div>
      </div>
      <div className="chatPersonList">
        {getFilteredData().map((user, index) => (
          <div
            className="chatPerson"
            key={index}
            onClick={() => handleUserClick(user)}
          >
            <div className="chatPersonHeader">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </div>
            <p>{formatDate(user.lastMessageTime)}</p>
            <div
              className="deleteChatAdmin"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteChat(user.email);
              }}
            >
              <MdDeleteOutline />
            </div>
            {activeTab === "all" && isUnread(user) && (
              <div className="chatPersonStatus">
                <IoMailUnread color="red" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminChatLeft;