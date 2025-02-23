/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { database, ref, onValue, remove } from "../../../../firebase/Firebase";
import { IoCloseCircleOutline } from "react-icons/io5";
import "./AdminChatLeft.scss";
import { MdDeleteOutline } from "react-icons/md";
import { IoMailUnread } from "react-icons/io5";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import toast from "react-hot-toast";
import { PiSmileyAngry } from "react-icons/pi";

const AdminChatLeft = ({ onUserSelect }) => {
  const [nameSearch, setNameSearch] = useState("");
  const [users, setUsers] = useState([]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    if (typeof timestamp === "number") {

      const date = new Date(timestamp);
      return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    }
 
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
            let dateA, dateB;
            if (typeof a.timestamp === "number") {
              dateA = new Date(a.timestamp);
            } else {
              dateA = new Date(
                a.timestamp.split(" ")[0].split("-").reverse().join("-") +
                  " " +
                  a.timestamp.split(" ")[1]
              );
            }
            if (typeof b.timestamp === "number") {
              dateB = new Date(b.timestamp);
            } else {
              dateB = new Date(
                b.timestamp.split(" ")[0].split("-").reverse().join("-") +
                  " " +
                  b.timestamp.split(" ")[1]
              );
            }
            return dateB - dateA; 
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
        
      })
      .catch((error) => {
        
      });
  };

  const handleDelete = (email) => {
    confirmAlert({
      title: "Confirm",
      message: `"Are you certain you want to do this?" <PiSmileyAngry />`
      ,
      buttons: [
        {
          label: "Evet",
          onClick: () => {
            handleDeleteChat(email);
            alert("The process has been confirmed!");
            toast.success("The process has been confirmed!", { position: "top-center",  style: {
              background: 'none',
              border: '1px solid #5a1d60',
              borderRadius: '15px',
              color: '#5a1d60',
            } })
          },
        },
        {
          label: "Hayır",
          onClick: () => toast.error("The process has been canceled.", { position: "top-center",  style: {
            background: 'none',
            border: '1px solid #5a1d60',
            borderRadius: '15px',
            color: '#5a1d60',
          } })
        },
      ],
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
            <div className="chatPersonRight">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <div className="chatPersonStatus">
                  <IoMailUnread color="red" fontSize="1.2rem" />
                </div>
                <div
                  className="deleteChatAdmin"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(user.email); // email’i parametre olarak geç
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