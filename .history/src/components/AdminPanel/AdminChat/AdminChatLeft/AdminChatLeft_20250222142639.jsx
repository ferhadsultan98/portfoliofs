import "./AdminChatLeft.scss";

const AdminChatLeft = () => {
  

  const current = new Date();
  const formattedDate = `${current.getDate()}-${
    current.getMonth() + 1
  }-${current.getFullYear()} ${current.getHours()}:${current.getMinutes()}`;
  const dataChat = [
    { name: "Farhad", date: formattedDate },
    { name: "Ali", date: formattedDate },
    { name: "Murat", date: formattedDate },
  ];
  return (
    <div className="adminChatLeftContainer">
      <div className="chatPersonList">
        {dataChat.map((infos, index) => (
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
