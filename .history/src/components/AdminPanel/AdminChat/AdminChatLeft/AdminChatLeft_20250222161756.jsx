import { useState, useEffect } from "react";
import { database, ref, get, child } from "../../firebase/Firebase";
import { IoCloseCircleOutline } from "react-icons/io5";
import "./AdminChatLeft.scss";

const AdminChatLeft = () => {
  const [nameSearch, setNameSearch] = useState("");
  const [users, setUsers] = useState([]);

  // Function to format the date as in your example
  const formatDate = (timestamp) => {
    const current = new Date(timestamp);
    return `${current.getDate()}-${current.getMonth() + 1}-${current.getFullYear()} ${current.getHours()}:${current.getMinutes()}`;
  };

  useEffect(() => {
    // Function to fetch users from Firebase
    const fetchUsers = async () => {
      const dbRef = ref(database, "users");
      const snapshot = await get(dbRef);

      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const userList = Object.keys(usersData).map((key) => ({
          name: usersData[key].name,
          email: usersData[key].email,
          lastMessageTime: usersData[key].messages?.[usersData[key].messages.length - 1]?.timestamp,
        }));
        setUsers(userList);
      }
    };

    fetchUsers();
  }, []);

  const filteredData = users.filter((user) =>
    user.name.toLowerCase().includes(nameSearch.toLowerCase())
  );

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
          <div className="chatPerson" key={index}>
            <h3>{user.name}</h3>
            <p>{formatDate(user.lastMessageTime)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminChatLeft;
