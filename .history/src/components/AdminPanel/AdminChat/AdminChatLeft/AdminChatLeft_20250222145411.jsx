import { useState } from "react";
import "./AdminChatLeft.scss";
import { IoCloseCircleOutline } from "react-icons/io5";

const AdminChatLeft = () => {

  const [nameSearch, setNameSearch] = useState("")

  const current = new Date();
  const formattedDate = `${current.getDate()}-${
    current.getMonth() + 1
  }-${current.getFullYear()} ${current.getHours()}:${current.getMinutes()}`;

  const dataChat = [
    { name: "Farhad", date: formattedDate },
    { name: "Ali", date: formattedDate },
    { name: "Murat", date: formattedDate },
  ];
  const filteredData = dataChat.filter((infos) =>
    infos.name.toLowerCase().includes(nameSearch.toLowerCase())
  );
  return (
    <div className="adminChatLeftContainer">
      <div className="adminChatLeftSearch">
        <input type="text"
        value={nameSearch}
        onChange={(e) => setNameSearch(e.target.value)}
        />
        <i>
        <IoCloseCircleOutline />
        </i>
      </div>
      <div className="chatPersonList">
        {filteredData.map((infos, index) => (
          <div className="chatPerson" key={index}>
            <h3>{infos.name}</h3>
            <p>{infos.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminChatLeft;
