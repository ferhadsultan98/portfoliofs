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
      {/* Pass the user selection handler to AdminChatLeft */}
      <AdminChatLeft onUserSelect={handleUserSelect} />
      
      {/* Pass the selected user to AdminChatRight to display messages */}
      <AdminChatRight selectedUser={selectedUser} />
    </div>
  );
}
