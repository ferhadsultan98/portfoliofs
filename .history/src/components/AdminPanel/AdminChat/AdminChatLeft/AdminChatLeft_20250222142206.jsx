import "./AdminChatLeft.scss";

const AdminChatLeft = () => {
  const dataChat = [
    { name: "Farhad", date: formattedDate },
    { name: "Ali", date: formattedDate },
    { name: "Murat", date: formattedDate },
  ];

  const current = new Date();
  const formattedDate = `${current.getDate()}-${
    current.getMonth() + 1
  }-${current.getFullYear()} ${current.getHours()}:${current.getMinutes()}`;

  return (
    <div className="adminChatLeftContainer">
      <div className="chatPersonList">
        {dataChat.map((info, index) => (
          <div className="chatPerson" key={index}>
            <h3>{}</h3>
            <p>{formattedDate}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminChatLeft;
