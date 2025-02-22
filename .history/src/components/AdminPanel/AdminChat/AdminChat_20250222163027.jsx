import { useState } from "react";
import './AdminChat.scss';
import AdminChatLeft from './AdminChatLeft/AdminChatLeft';
import AdminChatRight from './AdminChatRight/AdminChatRight';

export default function AdminChat() {
  // State to manage the selected user
  const [selectedUser, setSelectedUser] = useState(null);

  // Function to handle user selection from the left chat list
  const handleUserSelect = (user) => {
    setSelectedUser(user); // Update the selected user state
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
