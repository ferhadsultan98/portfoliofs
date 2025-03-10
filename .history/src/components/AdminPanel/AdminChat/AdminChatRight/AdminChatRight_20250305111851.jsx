import { useState, useEffect } from 'react';
import './CallCenterComponent.css'; // Stil dosyasını varsayıyorum

const CallCenterComponent = () => {
  // State tanımlamaları
  const [filteredData, setFilteredData] = useState([
    { id: 1, technical: "Tech1", status: "waiting" },
    { id: 2, technical: "Tech2", status: "schedule" },
  ]); // Örnek veri
  const [messages, setMessages] = useState([]);
  const [previousMessageCount, setPreviousMessageCount] = useState(0);
  const [view, setView] = useState(false); // colSpan için varsayımsal state

  // Mesaj kontrolü
  useEffect(() => {
    const checkNewMessages = () => {
      // Simüle edilmiş API çağrısı
      // Gerçek uygulamada burası gerçek veri kaynağınızla değiştirilmeli
      const newMessages = [
        ...messages,
        // Yeni mesaj simülasyonu (örnek olarak her 5 saniyede bir ekleniyor)
        { id: messages.length + 1, text: `Mesaj ${messages.length + 1}`, timestamp: new Date() }
      ];
      
      setMessages(newMessages);

      // Yeni mesaj kontrolü
      if (newMessages.length > previousMessageCount) {
        alert('Yeni bir mesaj geldi!');
        // İsterseniz daha fazla bilgi de ekleyebilirsiniz:
        // alert(`Yeni bir mesaj geldi! Toplam mesaj: ${newMessages.length}`);
      }
      setPreviousMessageCount(newMessages.length);
    };

    // 5 saniyede bir kontrol
    const interval = setInterval(checkNewMessages, 5000);

    // Component unmount olduğunda interval'i temizle
    return () => clearInterval(interval);
  }, [messages, previousMessageCount]);

  // Status değiştirme fonksiyonu
  const HandleEdit = (newStatus, item) => {
    const updatedData = filteredData.map(data => 
      data.id === item.id ? { ...data, status: newStatus } : data
    );
    setFilteredData(updatedData);
  };

  return (
    <section>
      <div className="container">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Technical</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id}>
                  <td>{item.technical || "N/A"}</td>
                  <td>
                    <select
                      onChange={(e) => HandleEdit(e.target.value, item)}
                      className="status-select"
                      value={item.status || "waiting"}
                      style={{
                        color:
                          item.status === "waiting"
                            ? "red"
                            : item.status === "schedule"
                            ? "blue"
                            : item.status === "success"
                            ? "green"
                            : "black",
                      }}
                    >
                      <option style={{ color: "red" }} value="waiting">Waiting</option>
                      <option style={{ color: "blue" }} value="schedule">Schedule</option>
                      <option style={{ color: "green" }} value="success">Success</option>
                    </select>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td
                    colSpan={view ? 8 : 3}
                    style={{ textAlign: "center", padding: "10px" }}
                  >
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default CallCenterComponent;