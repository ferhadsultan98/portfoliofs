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
  const [filter, setFilter] = useState("all");

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    return timestamp;
  };

  useEffect(() => {
    const dbRef = ref(database, "users");

    const unsubscribe = onValue(dbRef, (snapshot) => {
      console.log("Firebase Snapshot:", snapshot.val()); // Gelen veriyi kontrol et
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const userList = Object.keys(usersData).map((key) => {
          const messages = usersData[key].messages
            ? Object.values(usersData[key].messages)
            : [];
          console.log(`User ${key} Messages:`, messages); // Her kullanıcının mesajlarını kontrol et
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
          const lastMessage = sortedMessages.length > 0 ? sortedMessages[0] : null;
          return {
            name: usersData[key].name || "Unknown", // Name yoksa varsayılan
            email: usersData[key].email || key, // Email yoksa key’i kullan
            lastMessageTime: lastMessage ? lastMessage.timestamp : null,
            lastSender: lastMessage ? lastMessage.sender : null,
            userId: usersData[key].userId || "No ID",
          };
        });
        console.log("Processed User List:", userList); // İşlenmiş listeyi kontrol et
        setUsers(userList);
      } else {
        console.log("No data in 'users'");
        setUsers([]);
      }
    }, (error) => {
      console.error("Firebase Error:", error); // Hata yakalama
    });

    return () => unsubscribe();
  }, []);

  const filteredData = users
    .filter((user) => {
      console.log("Filtering User:", user); // Her kullanıcıyı kontrol et
      return user.name.toLowerCase().includes(nameSearch.toLowerCase());
    })
    .filter((user) => {
      if (filter === "all") return true;
      if (filter === "unread") return user.lastSender === "user";
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
        {filteredData.length > 0 ? (
          filteredData.map((user, index) => (
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
                  className={user.lastSender === "user" ? "statusIcon animate" : "statusIcon"}
                />
              </div>
            </div>
          ))
        ) : (
          <p>No users available</p> // Liste boşsa mesaj
        )}
      </div>
    </div>
  );
};

export default AdminChatLeft;