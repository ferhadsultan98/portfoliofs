/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { database, ref, onValue } from "../../../../firebase/Firebase";
import { IoCloseCircleOutline } from "react-icons/io5";
import "./AdminChatLeft.scss";

const AdminChatLeft = ({ onUserSelect }) => {
  const [nameSearch, setNameSearch] = useState("");
  const [users, setUsers] = useState([]);

  // Function to format the date as in your example
  const formatDate = (timestamp) => {
    const current = new Date(timestamp);
    return `${current.getDate()}-${current.getMonth() + 1}-${current.getFullYear()} ${current.getHours()}:${current.getMinutes()}`;
  };

  useEffect(() => {

    const dbRef = ref(database, "users");


    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const userList = Object.keys(usersData).map((key) => ({
          name: usersData[key].name,
          email: usersData[key].email,
          lastMessageTime: usersData[key].messages?.[usersData[key].messages.length - 1]?.timestamp,
          userId: usersData[key].userId, 
        }));
        setUsers(userList);  
      } else {
        setUsers([]); // Clear if no data is found
      }
    });

    // Cleanup the listener when the component is unmounted
    return () => unsubscribe();
  }, []);

  // Filter users based on the search input
  const filteredData = users.filter((user) =>
    user.name.toLowerCase().includes(nameSearch.toLowerCase())
  );

  // Handle user click to select the user and load messages
  const handleUserClick = (user) => {
    onUserSelect(user);  // Pass selected user to parent component
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
            onClick={() => handleUserClick(user)}  // Set selected user on click
          >
            <h3>{user.name}</h3>
            <p>{formatDate(user.lastMessageTime)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminChatLeft;
