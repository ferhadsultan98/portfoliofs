import { useState, useEffect } from "react";
import { database, ref, onValue, remove } from "../../../../firebase/Firebase";
import "./AdminChatLeft.scss";
import { MdDeleteOutline } from "react-icons/md";
import { IoMailUnread } from "react-icons/io5";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import toast from "react-hot-toast";
import { FaArrowCircleDown } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const AdminChatLeft = ({ onUserSelect }) => {
  const [nameSearch, setNameSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    if (typeof timestamp === "number") {
      const date = new Date(timestamp);
      return `${date.getDate()}-${
        date.getMonth() + 1
      }-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    }
    return timestamp;
  };

  useEffect(() => {
    const dbRef = ref(database, "users");

    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const userList = Object.keys(usersData)
          .map((key) => {
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
              lastMessageSender: lastMessage ? lastMessage.sender : null,
              userId: usersData[key].userId,
            };
          })
          .sort((a, b) => {
            if (!a.lastMessageTime) return 1;
            if (!b.lastMessageTime) return -1;
            
            const dateA = typeof a.lastMessageTime === "number" 
              ? new Date(a.lastMessageTime)
              : new Date(
                  a.lastMessageTime.split(" ")[0].split("-").reverse().join("-") +
                    " " +
                    a.lastMessageTime.split(" ")[1]
                );
            
            const dateB = typeof b.lastMessageTime === "number"
              ? new Date(b.lastMessageTime)
              : new Date(
                  b.lastMessageTime.split(" ")[0].split("-").reverse().join("-") +
                    " " +
                    b.lastMessageTime.split(" ")[1]
                );
            
            return dateB - dateA;
          });

        setUsers(userList);
      } else {
        setUsers([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const filteredData = users.filter((user) =>
    username.toLowerCase().includes(nameSearch.toLowerCase())
  );

  const handleUserClick = (user) => {
    onUserSelect(user);
    setIsMenuOpen(false);
  };

  const handleDeleteChat = (email) => {
    const emailKey = email.replace(".", ",");
    const userRef = ref(database, `users/${emailKey}`);

    remove(userRef)
      .then(() => {})
      .catch((error) => {});
  };

  const handleDelete = (email) => {
    confirmAlert({
      title: "Confirm",
      message: "Are you certain you want to do this?",
      buttons: [
        {
          label: "Yes!",
          onClick: () => {
            handleDeleteChat(email);
            toast.success("The process has been confirmed!", {
              position: "top-center",
              style: {
                background: "none",
                border: "1px solid #5a1d60",
                borderRadius: "15px",
                color: "#5a1d60",
              },
            });
          },
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

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(filteredData);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setUsers(items);
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
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="chatPersons">
          {(provided) => (
            <div
              className="chatPersonList"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {filteredData.map((user, index) => (
                <Draggable
                  key={user.email}
                  draggableId={user.email}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="chatPerson"
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
                          }}
                        >
                          <div className="chatPersonStatus">
                            <IoMailUnread
                              className={
                                user.lastMessageSender === "user"
                                  ? "animate-pulse"
                                  : ""
                              }
                              color={
                                user.lastMessageSender === "user"
                                  ? "darkred"
                                  : "#5a1d60"
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
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default AdminChatLeft;