/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { database, ref, onValue, remove } from "../../../../firebase/Firebase";
import { IoCloseCircleOutline } from "react-icons/io5";
import "./AdminChatLeft.scss";
import { MdDeleteOutline } from "react-icons/md";

const AdminChatLeft = ({ onUserSelect }) => {
  const [nameSearch, setNameSearch] = useState("");
  const [users, setUsers] = useState([]);

  // String timestamp'ı direkt kullan
  const formatDate = (timestamp) => {
    if (!timestamp) return ""; // Boşsa boş string döndür
    return timestamp; // String olarak geldiği için direkt döndür
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
          // Mesajları timestamp'a göre sırala (string karşılaştırması için)
          const sortedMessages = messages.sort((a, b) => {
            // String timestamp'ları karşılaştır
            return new Date(b.timestamp) - new Date(a.timestamp);
          });
          const lastMessage = sortedMessages.length > 0 ? sortedMessages[0] : null;
          return {
            name: usersData[key].name,
            email: usersData[key].email,
            lastMessageTime: lastMessage ? lastMessage.timestamp : null,
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

  const filteredData = users.filter((user) =>
    user.name.toLowerCase().includes(nameSearch.toLowerCase())
  );

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
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminChatLeft;