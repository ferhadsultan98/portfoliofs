import "./AdminChatLeft.scss";

const AdminChatLeft = () => {

const dataChat = [
  {name: "Farhad", date: formattedDate},
  {name: "Ali", date: formattedDate},
  {name: "Murat", date: formattedDate},
]


  const current = new Date();
  const formattedDate = `${current.getDate()}-${
    current.getMonth() + 1
  }-${current.getFullYear()} ${current.getHours()}:${current.getMinutes()}`;

  return (
    <div className="adminChatLeftContainer">
      <div className="chatPersonList">
        <div className="chatPerson">
          {}
       
        </div>
      </div>
    </div>
  );
}
export default AdminChatLeft