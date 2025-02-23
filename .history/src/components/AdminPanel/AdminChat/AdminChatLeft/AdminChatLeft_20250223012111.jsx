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
  const [filter, setFilter] = useState("all"); // Filtre durumu

  const formatDate = (timestamp) => {
    if (!timestamp) return ""; // Mesaj yoksa boş string
    return timestamp; // String olarak direkt döndür
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
            return dateB - dateA; // En son mesaj önce
          });
          const lastMessage = sortedMessages.length > 0 ? sortedMessages[0] : null;
          return {
            name: usersData[key].name,
            email: usersData[key].email,
            lastMessageTime: lastMessage ? lastMessage.timestamp : null,
            lastSender: lastMessage ? lastMessage.sender : null, // Son mesajın göndericisi
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

  // Filtrelenmiş kullanıcılar
  const filteredData = users
    .filter((user) =>
      user.name.toLowerCase().includes(nameSearch.toLowerCase())
    )
    .filter((user) => {
      if (filter === "all") return true; // Tüm kullanıcılar
      if (filter === "unread") return user.lastSender === "user"; // Sadece user'dan gelen son mesajlar
      return true;
    });

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
          className={`allChatGroup ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </div>
        <div
          className={`unreadChatGroup ${filter === "unread" ? "active" : ""}`}
          onClick={() => setFilter("unread")}
        >
          Unread
        </div>
      </div>
      <div className="chatPersonList">
        {filteredData.map((user, index) => (
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
            <div className="chatPersonStatus">
              <IoMailUnread
                color={user.lastSender === "user" ? "#5a1d60" : "red"}
                className="statusIcon"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminChatLeft;