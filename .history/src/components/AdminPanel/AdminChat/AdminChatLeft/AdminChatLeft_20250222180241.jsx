/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { database, ref, onValue } from "../../../../firebase/Firebase";
import { IoCloseCircleOutline } from "react-icons/io5";
import "./AdminChatLeft.scss";

const AdminChatLeft = ({ onUserSelect }) => {
  const [nameSearch, setNameSearch] = useState("");
  const [users, setUsers] = useState([]);

  const formatDate = (timestamp) => {
    const current = new Date(timestamp);
    return `${current.getDate()}-${
      current.getMonth() + 1
    }-${current.getFullYear()} ${current.getHours()}:${current.getMinutes()}`;
  };

  useEffect(() => {
    const dbRef = ref(database, "users");

    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const userList = Object.keys(usersData).map((key) => ({
          name: usersData[key].name,
          email: usersData[key].email,
          lastMessageTime:
            usersData[key].messages?.[usersData[key].messages.length - 1]
              ?.timestamp,
          userId: usersData[key].userId,
        }));
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
            .deleteChat
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminChatLeft;
