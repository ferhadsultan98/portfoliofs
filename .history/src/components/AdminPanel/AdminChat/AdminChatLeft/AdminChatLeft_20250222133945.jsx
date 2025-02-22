import "./AdminChatLeft.scss";

const AdminChatLeft = () {
  const current = new Date();
  const formattedDate = `${current.getDate()}-${
    current.getMonth() + 1
  }-${current.getFullYear()} ${current.getHours()}:${current.getMinutes()}`;

  return (
    <div className="adminChatLeftContainer">
      <div className="chatPersonList">
        <div className="chatPerson">
          <h3>Farhad</h3>
          <p>{formattedDate}</p>
        </div>
      </div>
    </div>
  );
}
