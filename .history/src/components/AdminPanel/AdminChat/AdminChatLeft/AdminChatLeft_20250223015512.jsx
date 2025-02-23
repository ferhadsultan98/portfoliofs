/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { database, ref, onValue, remove } from "../../../../firebase/Firebase";
import { IoCloseCircleOutline } from "react-icons/io5";
import "./AdminChatLeft.scss";
import { MdDeleteOutline } from "react-icons/md";
import { IoMailUnread } from "react-icons/io5";
import { confirmAlert } from "react-confirm-alert";

const AdminChatLeft = ({ onUserSelect }) => {
  const [nameSearch, setNameSearch] = useState("");
  const [users, setUsers] = useState([]);

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
          // Mesajları timestamp string'ine göre sırala
          const sortedMessages = messages.sort((a, b) => {
            // String timestamp'ları karşılaştırmak için Date'e çevir
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
          const lastMessage =
            sortedMessages.length > 0 ? sortedMessages[0] : null;
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
  const handleDelete = () => {
    confirmAlert({
      title: 'Onay',
      message: 'Bu işlemi yapmak istediğinizden emin misiniz?',
      buttons: [
        {
          label: 'Evet',
          onClick: () => alert('İşlem onaylandı!')
        },
        {
          label: 'Hayır',
          onClick: () => alert('İşlem iptal edildi.')
        }
      ]
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
            <div className="chatPersonLeft">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </div>
            <div className="chatPersonRight" >
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
            <div className="chatPersonStatus">
              <IoMailUnread color="red" fontSize="1.2rem"/>
            </div>
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
            <p>{formatDate(user.lastMessageTime)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminChatLeft;
