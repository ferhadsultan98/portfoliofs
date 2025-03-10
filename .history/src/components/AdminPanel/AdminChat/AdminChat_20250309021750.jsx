import { useState } from "react";
import './AdminChat.scss';
import AdminChatLeft from './AdminChatLeft/AdminChatLeft';
import AdminChatRight from './AdminChatRight/AdminChatRight';

export default function AdminChat() {

  const [selectedUser, setSelectedUser] = useState(null);


  const handleUserSelect = (user) => {
    setSelectedUser(user); 
  };

  return (
    <div className="adminChatContainer">

      <AdminChatLeft onUserSelect={handleUserSelect} />
      

      <AdminChatRight selectedUser={selectedUser} />
    </div>
  );
}
