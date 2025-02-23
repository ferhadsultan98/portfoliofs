/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
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
    const fetchUsers = async () => {
      try {
        // Firebase REST API endpoint (örnek URL, sizin endpoint'inize göre değişebilir)
        const response = await fetch(
          "https://your-firebase-project-default-rtdb.firebaseio.com/users.json"
        );
        const usersData = await response.json();

        if (usersData) {
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
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      }
    };

    fetchUsers();
  }, []); // Boş dependency array ile sadece mount sırasında çalışır

  const getFilteredData = () => {
    let filtered = users.filter((user) =>
      user.name.toLowerCase().includes(nameSearch.toLowerCase())
    );

    if (activeTab === "unread") {
      // Unread: Son mesaj kullanıcıdan gelmiş olanlar
      filtered = filtered.filter(
        (user) => user.lastMessageSender === "user" && user.lastMessageTime
      );
    }
    return filtered;
  };

  const handleUserClick = (user) => {
    onUserSelect(user);
  };

  const handleDeleteChat = async (email) => {
    try {
      const emailKey = email.replace(".", ",");
      // Firebase REST API ile DELETE isteği
      await fetch(
        `https://your-firebase-project-default-rtdb.firebaseio.com/users/${emailKey}.json`,
        {
          method: "DELETE",
        }
      );
      console.log(`${email} kullanıcısı tamamen silindi`);
      // State'i güncelle
      setUsers(users.filter((user) => user.email !== email));
    } catch (error) {
      console.error("Kullanıcı silinirken hata oluştu:", error);
    }
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
            {user.lastMessageSender === "user" && user.lastMessageTime && (
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