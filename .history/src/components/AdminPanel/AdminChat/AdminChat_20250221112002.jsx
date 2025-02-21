import './AdminChat.scss'
import AdminChatLeft from './AdminChatLeft/AdminChatLeft'
import AdminChatRight from './AdminChatRight/AdminChatRight'

export default function AdminChat() {
  return (
   <div className="adminChatContainer">
    <AdminChatLeft/>
    <AdminChatRight/>
   </div>
  )
}
