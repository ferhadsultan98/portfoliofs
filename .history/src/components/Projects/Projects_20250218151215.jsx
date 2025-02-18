import { useEffect, useState } from "react";
import { database, ref, get } from "../../firebase/Firebase";
import { IoLogoGithub, IoMdCloseCircleOutline } from "react-icons/io";
import "./Projects.css";
import AOS from "aos";
import "aos/dist/aos.css";

const Projects = () => {
  useEffect(() => {
    AOS.init();
  }, []);
  const [cards, setCards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [consoleMessages, setConsoleMessages] = useState([]);

  const fetchData = async () => {
    try {
      const projectsRef = ref(database, "cards");
      const snapshot = await get(projectsRef);

      if (snapshot.exists()) {
        const data = snapshot.val();

        const projectList = Object.keys(data).map((key) => ({
          id: key,
          coverName: data[key].cardCoverName || "",
          description: data[key].cardDescription || "",
          githubLink: data[key].cardGithubLink || "",
          tags: data[key].cardTags || [],
          title: data[key].cardTitle || "",
        }));
        setCards(projectList);

        setConsoleMessages((prev) => [
          ...prev,
          "Projects data fetched successfully",
        ]);
      } else {
        setConsoleMessages((prev) => [...prev, "No data available"]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setConsoleMessages((prev) => [
        ...prev,
        `Error fetching data: ${error.message}`,
      ]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (card) => {
    setModalContent(card);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsClosing(true);
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    if (isClosing) {
      const timer = setTimeout(() => {
        setIsModalOpen(false);
        setIsClosing(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isClosing]);

  return (
    <div
      className="ProjeContainer"
      id="projects"
      style={{ paddingTop: "80px" }}
      data-aos="fade-up"
      data-aos-delay="10"
    >
      <h1>Projects</h1>
      <hr className="project-separator" />

      {consoleMessages.length > 0 && (
        <div className="console-output"style={{display: 'none'}}>
          <h3 >Console Output:</h3>
          {consoleMessages.map((msg, index) => (
            <div key={index}>{msg}</div>
          ))}
        </div>
      )}

      <div className="card-container">
        {cards && cards.length > 0 ? (
          cards.map((card, index) => (
            <div
              className="card"
              key={index}
              onClick={() => openModal(card)}
              data-aos="zoom-out-down"
              data-aos-delay={(index + 10) * 1}
              style={{border: '2px solid red'}}
            >
              <div className="backCard"></div>
              <div className="card-main">
                <h1 alt={`${card.title} Logo`}>{card.coverName}</h1>
              </div>
              <div className="card-hover" id="cardInfo">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <div className="tags">
                  {card.tags && card.tags.length > 0 ? (
                    card.tags.map((tag, tagIndex) => (
                      <div className="tag" key={tagIndex}>
                        {tag}
                      </div>
                    ))
                  ) : (
                    <div>No tags available</div>
                  )}
                </div>
                <a
                  href={card.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IoLogoGithub size={40} color="white" />
                </a>
              </div>
            </div>
          ))
        ) : (
          <p>No projects available</p>
        )}
      </div>
      {isModalOpen && modalContent && (
        <div
          className={`modal ${isModalOpen ? "open" : ""} ${
            isClosing ? "closing" : ""
          }`}
        >
          <div className="modal-overlay" onClick={closeModal}></div>
          <div className="modal-content">
            <h2>{modalContent.title}</h2>
            <p>{modalContent.description}</p>
            <div className="tags">
              {modalContent.tags && modalContent.tags.length > 0 ? (
                modalContent.tags.map((tag, tagIndex) => (
                  <div className="tag" key={tagIndex}>
                    {tag}
                  </div>
                ))
              ) : (
                <div>No tags available</div>
              )}
            </div>
            <a
              href={modalContent.githubLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IoLogoGithub size={40} color="white" />
            </a>
            <button className="close-btn" onClick={closeModal}>
              <IoMdCloseCircleOutline style={{ fontSize: "24px" }} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
