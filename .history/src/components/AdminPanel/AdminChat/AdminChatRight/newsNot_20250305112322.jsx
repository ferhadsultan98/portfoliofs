import { useState, useEffect } from 'react';

const CallCenterComponent = () => {
  // Mevcut state'lerinize ek olarak
  const [messages, setMessages] = useState([]); // Mesajları tutacak state
  const [previousMessageCount, setPreviousMessageCount] = useState(0);

  // Yeni mesajları kontrol eden useEffect
  useEffect(() => {
    // Burada mesajların geldiği bir API veya kaynağı simüle ediyoruz
    // Gerçek uygulamada bu sizin veri kaynağınıza bağlı olacaktır
    const checkNewMessages = () => {
      // Örnek olarak: fetchMessages() API çağrısı
      const newMessages = /* API'den gelen yeni mesajlar */;
      setMessages(newMessages);

      // Yeni mesaj kontrolü
      if (newMessages.length > previousMessageCount) {
        alert('Yeni bir mesaj geldi!');
      }
      setPreviousMessageCount(newMessages.length);
    };

    // Belirli aralıklarla kontrol etmek için (örneğin her 5 saniyede bir)
    const interval = setInterval(checkNewMessages, 5000);

    // Cleanup
    return () => clearInterval(interval);
  }, [previousMessageCount]);

  // Mevcut render kodunuz
  return (
    <section>
      <div className="container">
        <div className="table-container">
          <table>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id}>
                  <>
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
                  </>
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
}

export default CallCenterComponent;