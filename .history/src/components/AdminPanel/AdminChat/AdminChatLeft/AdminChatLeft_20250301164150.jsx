import { useState, useEffect, useMemo } from "react";
import { database, ref, onValue, remove } from "../../../../firebase/Firebase";
import "./AdminChatLeft.scss";
import { MdDeleteOutline } from "react-icons/md";
import { IoMailUnread } from "react-icons/io5";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import toast from "react-hot-toast";
import { FaArrowCircleDown } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";

const AdminChatLeft = ({ onUserSelect }) => {
  const [nameSearch, setNameSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Timestamp formatlama fonksiyonu
  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(
      typeof timestamp === "number"
        ? timestamp
        : timestamp.split(" ")[0].split("-").reverse().join("-") +
          " " +
          (timestamp.split(" ")[1] || "00:00")
    );
    return date.toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    const dbRef = ref(database, "users");

    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          const userList = Object.keys(usersData).map((key) => {
            const messages = usersData[key].messages
              ? Object.values(usersData[key].messages)
              : [];
            const sortedMessages = messages.sort(
              (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
            );
            const lastMessage = sortedMessages[0] || null;
            return {
              name: usersData[key].name || "Unknown",
              email: usersData[key].email || key,
              lastMessageTime: lastMessage?.timestamp || null,
              lastMessageSender: lastMessage?.sender || null,
              userId: usersData[key].userId || key,
            };
          });
          setUsers(userList);
        } else {
          setUsers([]);
        }
      },
      (error) => {
        console.error("Firebase error:", error);
        toast.error("Failed to load users.");
      }
    );

    return () => unsubscribe();
  }, []);

  // Filtrelenmiş kullanıcıları memoize et
  const filteredData = useMemo(() => {
    return users.filter((user) =>
      user.name.toLowerCase().includes(nameSearch.toLowerCase())
    );
  }, [users, nameSearch]);

  const handleUserClick = (user) => {
    onUserSelect(user);
    setIsMenuOpen(false);
  };

  const handleDeleteChat = (email) => {
    const emailKey = email.replace(".", ",");
    const userRef = ref(database, `users/${emailKey}`);

    return remove(userRef)
      .then(() => {
        toast.success("Chat deleted successfully!", {
          position: "top-center",
          style: {
            background: "none",
            border: "1px solid #5a1d60",
            borderRadius: "15px",
            color: "#5a1d60",
          },
        });
      })
      .catch((error) => {
        console.error("Delete error:", error);
        toast.error("Failed to delete chat.", {
          position: "top-center",
          style: {
            background: "none",
            border: "1px solid #5a1d60",
            borderRadius: "15px",
            color: "#5a1d60",
          },
        });
      });
  };

  const handleDelete = (email) => {
    confirmAlert({
      title: "Confirm",
      message: "Are you certain you want to delete this chat?",
      buttons: [
        {
          label: "Yes!",
          onClick: () => handleDeleteChat(email),
        },
        {
          label: "No!",
          onClick: () =>
            toast.error("The process has been canceled.", {
              position: "top-center",
              style: {
                background: "none",
                border: "1px solid #5a1d60",
                borderRadius: "15px",
                color: "#5a1d60",
              },
            }),
        },
      ],
    });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div
      className={`adminChatLeftContainer ${
        isMenuOpen ? "chatLeftMobileOpen" : ""
      }`}
    >
      <button
        className={`chatToggle ${isMenuOpen ? "open" : ""}`}
        onClick={toggleMenu}
      >
        <FaArrowCircleDown />
      </button>
      <div className="adminChatLeftSearch">
        <input
          type="search"
          value={nameSearch}
          onChange={(e) => setNameSearch(e.target.value)}
          placeholder="Search users..."
        />
      </div>
      <div className="chatPersonList">
        {filteredData.length > 0 ? (
          filteredData.map((user, index) => (
            <div
              className="chatPerson"
              key={index}
              onClick={() => handleUserClick(user)}
            >
              <div className="chatPersonLeft">
                <i className="chatUserProfileIcon">
                  <FaCircleUser />
                </i>
                <div className="chatUserProfileInfo">
                  <h4>{user.name}</h4>
                  <p>{user.email}</p>
                </div>
              </div>
              <div className="chatPersonRight">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: "10px",
                  }}
                >
                  <div className="chatPersonStatus">
                    <IoMailUnread
                      className={
                        user.lastMessageSender === "user" ? "animate-shake" : ""
                      }
                      color={
                        user.lastMessageSender === "user" ? "red" : "#5a1d60"
                      }
                      fontSize="1.2rem"
                    />
                  </div>
                  <div
                    className="deleteChatAdmin"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(user.email);
                    }}
                  >
                    <MdDeleteOutline />
                  </div>
                </div>
                <p>{formatDate(user.lastMessageTime)}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminChatLeft;
